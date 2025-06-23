import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SolicitacaoCarta, StatusSolicitacao } from '../../database/entities/SolicitacaoCarta';
import { Usuario } from '../../database/entities/Usuario';
import { Banco } from '../../database/entities/Banco';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PdfService } from '../pdf/pdf.service';
import { TemplatesService } from '../templates/templates.service';
import { RedisService } from '../redis/redis.service';
import { EmailService } from '../email/email.service';
import { ZapierService } from '../zapier/zapier.service';

@Injectable()
export class SolicitacoesService {
  constructor(
    @InjectModel(SolicitacaoCarta)
    private solicitacaoModel: typeof SolicitacaoCarta,
    @InjectModel(Usuario)
    private usuarioModel: typeof Usuario,
    @InjectModel(Banco)
    private bancoModel: typeof Banco,
    private usuariosService: UsuariosService,
    private pdfService: PdfService,
    private templatesService: TemplatesService,
    private redisService: RedisService,
    private emailService: EmailService,
    private zapierService: ZapierService,
  ) {}

  async create(createSolicitacaoDto: any): Promise<SolicitacaoCarta> {
    const { cnpj, ...dados } = createSolicitacaoDto;
    
    // Buscar usuário pelo CNPJ
    const usuario = await this.usuarioModel.findOne({
      where: { cnpj }
    });

    if (!usuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }

    // Verificar limite de solicitações em aberto
    const solicitacoesEmAberto = await this.countSolicitacoesEmAberto(usuario.id);
    if (solicitacoesEmAberto >= 5) {
      throw new HttpException('Limite de 5 solicitações em aberto atingido', HttpStatus.BAD_REQUEST);
    }

    // Verificar se banco existe
    const banco = await this.bancoModel.findByPk(dados.banco_id);
    if (!banco) {
      throw new HttpException('Banco não encontrado', HttpStatus.NOT_FOUND);
    }

    // Preparar dados_carta usando os dados reais do formulário
    const dados_carta = {
      nome_empresa: dados.razao_social,
      cnpj_cliente: dados.cnpj_emitente,
      cidade: dados.cidade,
      estado: dados.estado,
      telefone: dados.telefone,
      email: dados.email,
      gerente_nome: dados.nome_gerente,
      gerente_telefone: dados.telefone_gerente,
      gerente_email: dados.email_gerente,
      cnab: dados.cnab,
      padrao_van: dados.fornecedor_van,
      // Dados bancários
      agencia: dados.agencia,
      agencia_dv: dados.agencia_dv,
      conta: dados.conta,
      conta_dv: dados.conta_dv,
      convenio: dados.convenio,
      // Dados exclusivos Nexxera
      preferencia_contato_gerente: dados.preferencia_contato_gerente
    };

    return this.solicitacaoModel.create({
      usuario_id: usuario.id,
      banco_id: dados.banco_id,
      produtos: dados.produtos,
      dados_carta: dados_carta,
      fornecedor_van: dados.fornecedor_van,
      status: StatusSolicitacao.EM_ABERTO
    });
  }

  async findAll(query?: any): Promise<SolicitacaoCarta[]> {
    const where: any = {};
    
    if (query?.cnpj) {
      const usuario = await this.usuarioModel.findOne({
        where: { cnpj: query.cnpj }
      });
      if (usuario) {
        where.usuario_id = usuario.id;
      }
    }

    if (query?.status) {
      where.status = query.status;
    }

    if (query?.banco_id) {
      where.banco_id = query.banco_id;
    }

    return this.solicitacaoModel.findAll({
      where,
      include: [
        {
          model: Usuario,
          attributes: ['cnpj', 'nome_empresa', 'tipo']
        },
        {
          model: Banco,
          attributes: ['codigo', 'nome']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  }

  async findOne(id: number): Promise<SolicitacaoCarta> {
    const solicitacao = await this.solicitacaoModel.findByPk(id, {
      include: [
        {
          model: Usuario,
          attributes: ['cnpj', 'nome_empresa', 'tipo']
        },
        {
          model: Banco,
          attributes: ['codigo', 'nome', 'produtos']
        }
      ]
    });
    
    if (!solicitacao) {
      throw new HttpException('Solicitação não encontrada', HttpStatus.NOT_FOUND);
    }
    
    return solicitacao;
  }

  async update(id: number, updateSolicitacaoDto: any): Promise<SolicitacaoCarta> {
    const solicitacao = await this.findOne(id);
    
    // Não permitir edição se já foi finalizada
    if (solicitacao.status === StatusSolicitacao.FINALIZADA) {
      throw new HttpException('Solicitação finalizada não pode ser editada', HttpStatus.BAD_REQUEST);
    }

    await solicitacao.update(updateSolicitacaoDto);
    
    return this.findOne(id);
  }

  async updateStatus(id: number, status: StatusSolicitacao, observacoes?: string): Promise<SolicitacaoCarta> {
    const solicitacao = await this.findOne(id);
    
    await solicitacao.update({
      status,
      observacoes: observacoes || solicitacao.observacoes
    });
    
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const solicitacao = await this.findOne(id);
    await solicitacao.destroy();
  }

  private async countSolicitacoesEmAberto(usuarioId: number): Promise<number> {
    return this.solicitacaoModel.count({
      where: {
        usuario_id: usuarioId,
        status: StatusSolicitacao.EM_ABERTO
      }
    });
  }

  async getDashboardStats(cnpj?: string): Promise<any> {
    const where: any = {};
    
    if (cnpj) {
      const usuario = await this.usuarioModel.findOne({
        where: { cnpj }
      });
      if (usuario) {
        where.usuario_id = usuario.id;
      }
    }

    const [total, emAberto, finalizadas] = await Promise.all([
      this.solicitacaoModel.count({ where }),
      this.solicitacaoModel.count({ 
        where: { ...where, status: StatusSolicitacao.EM_ABERTO }
      }),
      this.solicitacaoModel.count({ 
        where: { ...where, status: StatusSolicitacao.FINALIZADA }
      })
    ]);

    return {
      total,
      em_aberto: emAberto,
      finalizadas
    };
  }

  // Novos métodos para PDF e envio
  async generatePdf(solicitacaoId: number): Promise<Buffer> {
    const solicitacao = await this.findOne(solicitacaoId);
    const usuario = await this.usuarioModel.findByPk(solicitacao.usuario_id);
    const banco = await this.bancoModel.findByPk(solicitacao.banco_id);

    const data = {
      ...solicitacao.toJSON(),
      usuario,
      banco,
    };

    return this.pdfService.generatePdf(solicitacaoId, data);
  }

  async generatePdfBase64(solicitacaoId: number): Promise<string> {
    const solicitacao = await this.findOne(solicitacaoId);
    const usuario = await this.usuarioModel.findByPk(solicitacao.usuario_id);
    const banco = await this.bancoModel.findByPk(solicitacao.banco_id);

    const data = {
      ...solicitacao.toJSON(),
      usuario,
      banco,
    };

    return this.pdfService.generatePdfBase64(solicitacaoId, data);
  }

  async sendPdfToClient(solicitacaoId: number): Promise<void> {
    // TODO: Implementar envio de email com PDF anexado
    // Por enquanto, apenas gera o PDF
    await this.generatePdf(solicitacaoId);
  }

  async clearPdfCache(solicitacaoId?: number): Promise<void> {
    if (solicitacaoId) {
        const key = `pdf:${solicitacaoId}`;
        await this.redisService.del(key);
    } else {
        const keys = await this.redisService.keys('pdf:*');
        await this.redisService.del(keys);
    }
  }

  async generatePreviewPdf(data: {
    banco_id: number;
    produto: string;
    formData: any;
    fornecedor_van: string;
  }): Promise<string> {
    console.log(`🔍 Service: Iniciando generatePreviewPdf para produto ${data.produto}`);
    
    const { banco_id, produto, formData, fornecedor_van } = data;
    
    // Buscar banco
    console.log(`🏦 Service: Buscando banco com ID ${banco_id}`);
    const banco = await this.bancoModel.findByPk(banco_id);
    if (!banco) {
      console.error(`❌ Service: Banco não encontrado com ID ${banco_id}`);
      throw new HttpException('Banco não encontrado', HttpStatus.NOT_FOUND);
    }
    console.log(`✅ Service: Banco encontrado: ${banco.nome}`);

    // Determinar o padrão VAN baseado no fornecedor
    const padraoVan = fornecedor_van.toLowerCase();
    console.log(`🔧 Service: Padrão VAN: ${padraoVan}`);
    
    // Preparar dados para o template
    console.log(`📋 Service: Preparando dados para template`);
    const templateData = {
      banco: {
        nome: banco.nome,
        codigo: banco.codigo,
        padrao_van: banco.padrao_van
      },
      dados: {
        razaoSocial: formData.razao_social,
        cnpjEmitente: formData.cnpj_emitente,
        nomeResponsavel: formData.nome_responsavel,
        cargoResponsavel: formData.cargo_responsavel,
        telefone: formData.telefone,
        email: formData.email,
        agencia: formData.agencia,
        agenciaDV: formData.agencia_dv,
        conta: formData.conta,
        contaDV: formData.conta_dv,
        convenio: formData.convenio,
        cnab: formData.cnab,
        nomeGerente: formData.nome_gerente,
        telefoneGerente: formData.telefone_gerente,
        emailGerente: formData.email_gerente,
        cnpjSoftwareHouse: formData.cnpj_software_house
      },
      produtos: [produto],
      cnab: formData.cnab
    };

    console.log(`📄 Service: Chamando pdfService.generatePdfFromTemplate`);
    // Gerar PDF usando o serviço de PDF
    const pdfBuffer = await this.pdfService.generatePdfFromTemplate(padraoVan, templateData);
    
    // TEMPORÁRIO: Usar método simples sem Puppeteer para testar
    // console.log(`📄 Service: Usando método simples sem Puppeteer (teste)`);
    // const pdfBuffer = await this.pdfService.generateSimplePdfFromTemplate(padraoVan, templateData);
    
    console.log(`✅ Service: PDF gerado com sucesso (${pdfBuffer.length} bytes)`);
    
    // Retornar em base64
    const base64 = pdfBuffer.toString('base64');
    console.log(`🔄 Service: Convertido para base64 (${base64.length} caracteres)`);
    
    return base64;
  }

  async sendCartasEmail(solicitacaoId: number): Promise<{ success: boolean; message: string; emailsEnviados: number }> {
    try {
      console.log(`🚀 Iniciando envio de emails para solicitação ${solicitacaoId}`);
      
      const solicitacao = await this.findOne(solicitacaoId);
      const usuario = await this.usuarioModel.findByPk(solicitacao.usuario_id);
      const banco = await this.bancoModel.findByPk(solicitacao.banco_id);

      if (!solicitacao || !usuario || !banco) {
        throw new HttpException('Dados da solicitação não encontrados', HttpStatus.NOT_FOUND);
      }

      console.log(`📋 Dados da solicitação:`, {
        solicitacaoId,
        usuario: usuario.nome_empresa,
        banco: banco.nome,
        produtos: solicitacao.produtos,
        email: solicitacao.dados_carta.email
      });

      let emailsEnviados = 0;
      const resultados: Array<{ produto: string; status: string; erro?: string }> = [];

      // Enviar email para cada produto
      for (const produto of solicitacao.produtos) {
        try {
          console.log(`📧 Gerando PDF para produto: ${produto}`);
          
          // Gerar PDF para o produto específico
          const pdfBuffer = await this.generatePdfForProduct(solicitacao, usuario, banco, produto);
          
          console.log(`📄 PDF gerado com sucesso para ${produto} (${pdfBuffer.length} bytes)`);

          // Enviar email
          const emailEnviado = await this.emailService.sendCartaEmail({
            to: solicitacao.dados_carta.email,
            produto: produto,
            banco: banco.nome,
            pdfBuffer: pdfBuffer,
            dadosCliente: {
              razao_social: solicitacao.dados_carta.nome_empresa,
              cnpj_emitente: solicitacao.dados_carta.cnpj_cliente,
              nome_responsavel: solicitacao.dados_carta.nome_empresa,
              email: solicitacao.dados_carta.email
            }
          });

          if (emailEnviado) {
            emailsEnviados++;
            resultados.push({ produto, status: 'enviado' });
            console.log(`✅ Email enviado com sucesso para ${produto}`);
          } else {
            resultados.push({ produto, status: 'falha', erro: 'Transporter não inicializado' });
            console.log(`❌ Falha ao enviar email para ${produto}`);
          }

        } catch (error) {
          console.error(`❌ Erro ao processar produto ${produto}:`, error.message);
          resultados.push({ produto, status: 'falha', erro: error.message });
        }
      }

      console.log(`📊 Resumo do envio: ${emailsEnviados}/${solicitacao.produtos.length} emails enviados`);
      console.log(`📋 Resultados detalhados:`, resultados);

      return {
        success: emailsEnviados > 0,
        message: `${emailsEnviados} de ${solicitacao.produtos.length} emails enviados com sucesso`,
        emailsEnviados
      };

    } catch (error) {
      console.error(`❌ Erro geral no envio de emails:`, error.message);
      throw new HttpException(
        `Erro ao enviar emails: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async integrateZapier(solicitacaoId: number): Promise<{ success: boolean; message: string; integracoesEnviadas: number }> {
    try {
      console.log(`🔗 Iniciando integração Zapier para solicitação ${solicitacaoId}`);
      
      const solicitacao = await this.findOne(solicitacaoId);
      const usuario = await this.usuarioModel.findByPk(solicitacao.usuario_id);
      const banco = await this.bancoModel.findByPk(solicitacao.banco_id);

      if (!solicitacao || !usuario || !banco) {
        throw new HttpException('Dados da solicitação não encontrados', HttpStatus.NOT_FOUND);
      }

      console.log(`📋 Dados para integração Zapier:`, {
        solicitacaoId,
        usuario: usuario.nome_empresa,
        banco: banco.nome,
        produtos: solicitacao.produtos,
        email: solicitacao.dados_carta.email
      });

      let integracoesEnviadas = 0;
      const resultados: Array<{ produto: string; status: string; erro?: string; messageId?: string }> = [];

      // Enviar para Zapier para cada produto
      for (const produto of solicitacao.produtos) {
        try {
          console.log(`🔗 Gerando PDF para integração Zapier - Produto: ${produto}`);
          
          // Gerar PDF para o produto específico
          const pdfBuffer = await this.generatePdfForProduct(solicitacao, usuario, banco, produto);
          const pdfBase64 = pdfBuffer.toString('base64');
          
          console.log(`📄 PDF gerado para Zapier - ${produto} (${pdfBuffer.length} bytes)`);

          // Preparar dados para Zapier
          const dadosZapier = {
            cnpj_sh: usuario.cnpj,
            email: solicitacao.dados_carta.email,
            cnpj_cliente: solicitacao.dados_carta.cnpj_cliente,
            produto: produto,
            arquivo: pdfBase64
          };

          console.log(`📤 Enviando dados para Zapier:`, {
            cnpj_sh: dadosZapier.cnpj_sh,
            email: dadosZapier.email,
            cnpj_cliente: dadosZapier.cnpj_cliente,
            produto: dadosZapier.produto,
            arquivo_size: `${Math.round(pdfBase64.length / 1024)}KB`
          });

          // Enviar para Zapier
          const resultadoZapier = await this.zapierService.enviarParaZapier(dadosZapier);
          
          if (resultadoZapier.success) {
            integracoesEnviadas++;
            resultados.push({ produto, status: 'enviado', messageId: resultadoZapier.message });
            console.log(`✅ Integração Zapier bem-sucedida para ${produto}`);
          } else {
            resultados.push({ produto, status: 'falha', erro: resultadoZapier.message });
            console.log(`❌ Falha na integração Zapier para ${produto}`);
          }

        } catch (error) {
          console.error(`❌ Erro ao processar integração Zapier para ${produto}:`, error.message);
          resultados.push({ produto, status: 'falha', erro: error.message });
        }
      }

      console.log(`📊 Resumo da integração Zapier: ${integracoesEnviadas}/${solicitacao.produtos.length} integrações enviadas`);
      console.log(`📋 Resultados detalhados:`, resultados);

      return {
        success: integracoesEnviadas > 0,
        message: `${integracoesEnviadas} de ${solicitacao.produtos.length} integrações Zapier enviadas com sucesso`,
        integracoesEnviadas
      };

    } catch (error) {
      console.error(`❌ Erro geral na integração Zapier:`, error.message);
      throw new HttpException(
        `Erro na integração Zapier: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async finalizarSolicitacao(solicitacaoId: number): Promise<SolicitacaoCarta> {
    try {
      console.log(`🏁 Finalizando solicitação ${solicitacaoId}`);
      
      const solicitacao = await this.findOne(solicitacaoId);
      
      if (solicitacao.status === StatusSolicitacao.FINALIZADA) {
        console.log(`⚠️ Solicitação ${solicitacaoId} já está finalizada`);
        return solicitacao;
      }

      // Atualizar status para finalizada
      await solicitacao.update({
        status: StatusSolicitacao.FINALIZADA,
        observacoes: solicitacao.observacoes ? 
          `${solicitacao.observacoes}\n\nFinalizada em: ${new Date().toISOString()}` :
          `Finalizada em: ${new Date().toISOString()}`
      });

      console.log(`✅ Solicitação ${solicitacaoId} finalizada com sucesso`);
      
      return this.findOne(solicitacaoId);
    } catch (error) {
      console.error(`❌ Erro ao finalizar solicitação ${solicitacaoId}:`, error.message);
      throw new HttpException(
        `Erro ao finalizar solicitação: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async generatePdfForProduct(solicitacao: any, usuario: any, banco: any, produto: string): Promise<Buffer> {
    // Preparar dados para o template usando os dados reais da solicitação
    const templateData = {
      banco: {
        nome: banco.nome,
        codigo: banco.codigo,
        padrao_van: banco.padrao_van
      },
      dados: {
        razaoSocial: solicitacao.dados_carta.nome_empresa,
        cnpjEmitente: solicitacao.dados_carta.cnpj_cliente,
        nomeResponsavel: solicitacao.dados_carta.nome_empresa, // Usar nome da empresa como responsável
        cargoResponsavel: 'Responsável', // Pode ser mantido fixo ou adicionado ao formulário
        telefone: solicitacao.dados_carta.telefone,
        email: solicitacao.dados_carta.email,
        agencia: solicitacao.dados_carta.agencia || '0001',
        agenciaDV: solicitacao.dados_carta.agencia_dv || '0',
        conta: solicitacao.dados_carta.conta || '00000000000000000000',
        contaDV: solicitacao.dados_carta.conta_dv || '0',
        convenio: solicitacao.dados_carta.convenio || '00000000000000000000',
        cnab: solicitacao.dados_carta.cnab,
        nomeGerente: solicitacao.dados_carta.gerente_nome,
        telefoneGerente: solicitacao.dados_carta.gerente_telefone,
        emailGerente: solicitacao.dados_carta.gerente_email,
        cnpjSoftwareHouse: usuario.cnpj
      },
      produtos: [produto],
      cnab: solicitacao.dados_carta.cnab
    };

    // Determinar o padrão VAN baseado no fornecedor
    const padraoVan = solicitacao.fornecedor_van.toLowerCase();
    
    // Gerar PDF usando o serviço de PDF
    return await this.pdfService.generatePdfFromTemplate(padraoVan, templateData);
  }
} 
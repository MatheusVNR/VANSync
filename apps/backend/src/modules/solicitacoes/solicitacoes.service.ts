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
      nome_responsavel: dados.nome_responsavel,
      cargo_responsavel: dados.cargo_responsavel,
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

    const novaSolicitacao = await this.solicitacaoModel.create({
      usuario_id: usuario.id,
      banco_id: dados.banco_id,
      produto: dados.produto || dados.produtos,
      dados_carta: dados_carta,
      fornecedor_van: dados.fornecedor_van,
      status: StatusSolicitacao.EM_ABERTO
    } as any);
    console.log('✅ Solicitação criada:', novaSolicitacao.id, novaSolicitacao.produto);
    return novaSolicitacao;
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
      order: [['created_at', 'DESC']]
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
    
    // Não permitir edição se já foi aprovada
    if (solicitacao.status === StatusSolicitacao.APROVADA) {
      throw new HttpException('Solicitação aprovada não pode ser editada', HttpStatus.BAD_REQUEST);
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

    const [total, emAberto, aprovadas] = await Promise.all([
      this.solicitacaoModel.count({ where }),
      this.solicitacaoModel.count({ 
        where: { ...where, status: StatusSolicitacao.EM_ABERTO }
      }),
      this.solicitacaoModel.count({ 
        where: { ...where, status: StatusSolicitacao.APROVADA }
      })
    ]);

    return {
      total_solicitacoes: total,
      solicitacoes_pendentes: emAberto,
      solicitacoes_aprovadas: aprovadas
    };
  }

  /**
   * Gera PDF para uma solicitação específica, reutilizando cache quando possível
   */
  async generatePdf(solicitacaoId: number): Promise<Buffer> {
    const solicitacao = await this.findOne(solicitacaoId);
    const usuario = await this.usuarioModel.findByPk(solicitacao.usuario_id);
    const banco = await this.bancoModel.findByPk(solicitacao.banco_id);

    // Gera PDF com dados preenchidos reais
    return this.generatePdfForProduct(solicitacao, usuario, banco, solicitacao.produto);
  }

  /**
   * Gera PDF em base64 para uma solicitação específica
   */
  async generatePdfBase64(solicitacaoId: number): Promise<string> {
    const pdfBuffer = await this.generatePdf(solicitacaoId);
    return pdfBuffer.toString('base64');
  }

  /**
   * Envia PDF para o cliente (método legado)
   */
  async sendPdfToClient(solicitacaoId: number): Promise<void> {
    await this.generatePdf(solicitacaoId);
  }

  /**
   * Limpa cache de PDFs
   */
  async clearPdfCache(solicitacaoId?: number): Promise<void> {
    if (solicitacaoId) {
        const key = `pdf:${solicitacaoId}`;
        await this.redisService.del(key);
    } else {
        const keys = await this.redisService.keys('pdf:*');
        await this.redisService.del(keys);
    }
  }

  /**
   * Gera PDF de preview e cacheia para reutilização posterior
   * Este método é usado no wizard para preview
   */
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
    
    // Converter valores CNAB para formato esperado pelo template Finnet
    const converterCnab = (cnab: string) => {
      if (cnab === 'CNAB240') return '240';
      if (cnab === 'CNAB400') return '400';
      if (cnab === 'CNAB444') return '444';
      return cnab; // Manter original se não for um dos valores conhecidos
    };
    
    const cnabConvertido = converterCnab(formData.cnab);
    
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
        cnab: cnabConvertido,
        nomeGerente: formData.nome_gerente,
        telefoneGerente: formData.telefone_gerente,
        emailGerente: formData.email_gerente,
        cnpjSoftwareHouse: formData.cnpj_software_house,
        // Dados específicos para Nexxera
        cidade: formData.cidade || '',
        estado: formData.estado || '',
        preferenciaContato: formData.preferencia_contato_gerente || 'Email'
      },
      produto: [produto], // Para template Finnet
      produtos: [produto], // Para template Nexxera
      cnab: cnabConvertido
    };

    console.log(`📄 Service: Chamando pdfService.generatePdfFromTemplate`);
    // Gerar PDF usando o serviço de PDF
    const pdfBuffer = await this.pdfService.generatePdfFromTemplate(padraoVan, templateData);
    
    console.log(`✅ Service: PDF gerado com sucesso (${pdfBuffer.length} bytes)`);
    
    // Retornar em base64
    const base64 = pdfBuffer.toString('base64');
    console.log(`🔄 Service: Convertido para base64 (${base64.length} caracteres)`);
    
    return base64;
  }

  /**
   * Gera PDF de preview e cacheia com chave específica para reutilização
   * Este método é usado no wizard para preview e cacheia o PDF para uso posterior
   */
  async generatePreviewPdfWithCache(data: {
    banco_id: number;
    produto: string;
    formData: any;
    fornecedor_van: string;
    cacheKey?: string; // Chave opcional para cache personalizado
  }): Promise<{ pdfBase64: string; cacheKey: string }> {
    console.log(`🔍 Service: Iniciando generatePreviewPdfWithCache para produto ${data.produto}`);
    
    const { banco_id, produto, formData, fornecedor_van, cacheKey } = data;
    
    // Gerar chave de cache única baseada nos dados
    const cacheKeyGenerated = cacheKey || this.generateCacheKey({
      banco_id,
      produto,
      formData,
      fornecedor_van
    });
    
    console.log(`🔑 Service: Chave de cache: ${cacheKeyGenerated}`);
    
    // Tentar recuperar do cache primeiro
    const cachedPdf = await this.redisService.getPdf(cacheKeyGenerated);
    if (cachedPdf) {
      console.log(`✅ Service: PDF encontrado no cache (${cachedPdf.length} bytes)`);
      return {
        pdfBase64: cachedPdf.toString('base64'),
        cacheKey: cacheKeyGenerated
      };
    }
    
    // Se não estiver no cache, gerar novo PDF
    console.log(`📄 Service: Gerando novo PDF...`);
    const pdfBase64 = await this.generatePreviewPdf({
      banco_id,
      produto,
      formData,
      fornecedor_van
    });
    
    // Cachear o PDF gerado
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    await this.redisService.setPdf(cacheKeyGenerated, pdfBuffer, 3600); // Cache por 1 hora
    console.log(`💾 Service: PDF cacheado com sucesso`);
    
    return {
      pdfBase64,
      cacheKey: cacheKeyGenerated
    };
  }

  /**
   * Recupera PDF do cache usando a chave fornecida
   */
  async getPdfFromCache(cacheKey: string): Promise<Buffer | null> {
    console.log(`🔍 Service: Recuperando PDF do cache com chave: ${cacheKey}`);
    const pdfBuffer = await this.redisService.getPdf(cacheKey);
    
    if (pdfBuffer) {
      console.log(`✅ Service: PDF recuperado do cache (${pdfBuffer.length} bytes)`);
    } else {
      console.log(`❌ Service: PDF não encontrado no cache`);
    }
    
    return pdfBuffer;
  }

  /**
   * Gera chave de cache única baseada nos dados
   */
  private generateCacheKey(data: {
    banco_id: number;
    produto: string;
    formData: any;
    fornecedor_van: string;
  }): string {
    const hash = require('crypto').createHash('md5');
    const dataString = JSON.stringify({
      banco_id: data.banco_id,
      produto: data.produto,
      fornecedor_van: data.fornecedor_van,
      // Incluir apenas campos relevantes do formData para evitar chaves muito longas
      formData: {
        razao_social: data.formData.razao_social,
        cnpj_emitente: data.formData.cnpj_emitente,
        agencia: data.formData.agencia,
        conta: data.formData.conta,
        convenio: data.formData.convenio,
        cnab: data.formData.cnab
      }
    });
    hash.update(dataString);
    return `preview:${hash.digest('hex')}`;
  }

  /**
   * Envia cartas por email usando PDFs do cache quando possível
   */
  async sendCartasEmail(solicitacaoId: number, cacheKeys?: string[]): Promise<{ success: boolean; message: string; emailsEnviados: number }> {
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
        produto: solicitacao.produto,
        email: solicitacao.dados_carta.email
      });

      let emailsEnviados = 0;
      const resultados: Array<{ produto: string; status: string; erro?: string }> = [];

      // Enviar email para o produto único
      const produto = solicitacao.produto;
      try {
        console.log(`📧 Gerando PDF para produto: ${produto}`);
        
        let pdfBuffer: Buffer | null = null;
        
        // Se temos cacheKeys, tentar usar o PDF do cache
        if (cacheKeys && cacheKeys.length > 0) {
          console.log(`🔍 Tentando recuperar PDF do cache...`);
          pdfBuffer = await this.getPdfFromCache(cacheKeys[0]);
        }
        
        // Se não encontrou no cache, gerar novo PDF
        if (!pdfBuffer) {
          console.log(`📄 Gerando novo PDF para ${produto}`);
          pdfBuffer = await this.generatePdfForProduct(solicitacao, usuario, banco, produto);
        } else {
          console.log(`✅ PDF recuperado do cache para ${produto}`);
        }
        
        console.log(`📄 PDF pronto para envio - ${produto} (${pdfBuffer.length} bytes)`);

        // Enviar email
        const emailEnviado = await this.emailService.sendCartaEmail({
          to: solicitacao.dados_carta.email,
          produto: produto,
          banco: banco.nome,
          pdfBuffer: pdfBuffer,
          dadosCliente: {
            razao_social: solicitacao.dados_carta.nome_empresa,
            cnpj_emitente: solicitacao.dados_carta.cnpj_cliente,
            nome_responsavel: solicitacao.dados_carta.nome_responsavel,
            cargo_responsavel: solicitacao.dados_carta.cargo_responsavel,
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

      console.log(`📊 Resumo do envio: ${emailsEnviados}/1 emails enviados`);
      console.log(`📋 Resultados detalhados:`, resultados);

      return {
        success: emailsEnviados > 0,
        message: `${emailsEnviados} de 1 emails enviados com sucesso`,
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

  /**
   * Integra com Zapier usando PDFs do cache quando possível
   */
  async integrateZapier(solicitacaoId: number, cacheKeys?: string[]): Promise<{ success: boolean; message: string; integracoesEnviadas: number }> {
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
        produto: solicitacao.produto,
        email: solicitacao.dados_carta.email
      });

      let integracoesEnviadas = 0;
      const resultados: Array<{ produto: string; status: string; erro?: string; messageId?: string }> = [];

      // Enviar para Zapier para o produto único
      const produto = solicitacao.produto;
      try {
        console.log(`🔗 Gerando PDF para integração Zapier - Produto: ${produto}`);
        
        let pdfBuffer: Buffer | null = null;
        
        // Se temos cacheKeys, tentar usar o PDF do cache
        if (cacheKeys && cacheKeys.length > 0) {
          console.log(`🔍 Tentando recuperar PDF do cache para Zapier...`);
          pdfBuffer = await this.getPdfFromCache(cacheKeys[0]);
        }
        
        // Se não encontrou no cache, gerar novo PDF
        if (!pdfBuffer) {
          console.log(`📄 Gerando novo PDF para Zapier - ${produto}`);
          pdfBuffer = await this.generatePdfForProduct(solicitacao, usuario, banco, produto);
        } else {
          console.log(`✅ PDF recuperado do cache para Zapier - ${produto}`);
        }
        
        const pdfBase64 = pdfBuffer.toString('base64');
        console.log(`📄 PDF pronto para Zapier - ${produto} (${pdfBuffer.length} bytes)`);

        // Preparar dados para Zapier
        const dadosZapier = {
          cnpj_sh: usuario.cnpj,
          email: usuario.email || "", // Email da software house
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

      console.log(`📊 Resumo da integração Zapier: ${integracoesEnviadas}/1 integrações enviadas`);
      console.log(`📋 Resultados detalhados:`, resultados);

      return {
        success: integracoesEnviadas > 0,
        message: `${integracoesEnviadas} de 1 integrações Zapier enviadas com sucesso`,
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

  /**
   * Processa solicitação completa usando PDFs do cache
   */
  async processarCompleto(solicitacaoId: number, cacheKeys?: string[]): Promise<{
    success: boolean;
    message: string;
    resultados: {
      emails: { success: boolean; message: string; emailsEnviados: number };
      zapier: { success: boolean; message: string; integracoesEnviadas: number };
      finalizacao: { success: boolean; message: string };
    };
    solicitacao: any;
  }> {
    try {
      console.log(`🚀 Iniciando processamento completo para solicitação ${solicitacaoId}`);
      
      // Processar emails
      const resultadoEmails = await this.sendCartasEmail(solicitacaoId, cacheKeys);
      
      // Processar Zapier
      const resultadoZapier = await this.integrateZapier(solicitacaoId, cacheKeys);
      
      // Finalizar solicitação
      const solicitacao = await this.finalizarSolicitacao(solicitacaoId);
      
      return {
        success: resultadoEmails.success && resultadoZapier.success,
        message: 'Processamento completo finalizado',
        resultados: {
          emails: resultadoEmails,
          zapier: resultadoZapier,
          finalizacao: {
            success: true,
            message: 'Solicitação finalizada com sucesso'
          }
        },
        solicitacao
      };
      
    } catch (error) {
      console.error(`❌ Erro no processamento completo:`, error.message);
      throw new HttpException(
        `Erro no processamento completo: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async finalizarSolicitacao(solicitacaoId: number): Promise<SolicitacaoCarta> {
    try {
      console.log(`🏁 Finalizando solicitação ${solicitacaoId}`);
      
      const solicitacao = await this.findOne(solicitacaoId);
      
      if (solicitacao.status === StatusSolicitacao.APROVADA) {
        console.log(`⚠️ Solicitação ${solicitacaoId} já está aprovada`);
        return solicitacao;
      }

      // Atualizar status para aprovada
      await solicitacao.update({
        status: StatusSolicitacao.APROVADA,
        observacoes: solicitacao.observacoes ? 
          `${solicitacao.observacoes}\n\nAprovada em: ${new Date().toISOString()}` :
          `Aprovada em: ${new Date().toISOString()}`
      });

      console.log(`✅ Solicitação ${solicitacaoId} aprovada com sucesso`);
      
      return this.findOne(solicitacaoId);
    } catch (error) {
      console.error(`❌ Erro ao aprovar solicitação ${solicitacaoId}:`, error.message);
      throw new HttpException(
        `Erro ao aprovar solicitação: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  private async generatePdfForProduct(solicitacao: any, usuario: any, banco: any, produto: string): Promise<Buffer> {
    // Garantir que produto e cnab sejam arrays
    const produtosArray = Array.isArray(solicitacao.produto) ? solicitacao.produto : [solicitacao.produto];
    
    // Converter valores CNAB para formato esperado pelo template Finnet
    const converterCnab = (cnab: string) => {
      if (cnab === 'CNAB240') return '240';
      if (cnab === 'CNAB400') return '400';
      if (cnab === 'CNAB444') return '444';
      return cnab; // Manter original se não for um dos valores conhecidos
    };
    
    const cnabArray = Array.isArray(solicitacao.dados_carta.cnab) 
      ? solicitacao.dados_carta.cnab.map(converterCnab)
      : [converterCnab(solicitacao.dados_carta.cnab)];

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
        nomeResponsavel: solicitacao.dados_carta.nome_responsavel || solicitacao.dados_carta.nome_empresa, // Usar nome do responsável se disponível
        cargoResponsavel: solicitacao.dados_carta.cargo_responsavel || 'Responsável', // Usar cargo do responsável se disponível
        telefone: solicitacao.dados_carta.telefone,
        email: solicitacao.dados_carta.email,
        agencia: solicitacao.dados_carta.agencia || '0001',
        agenciaDV: solicitacao.dados_carta.agencia_dv || '0',
        conta: solicitacao.dados_carta.conta || '00000000000000000000',
        contaDV: solicitacao.dados_carta.conta_dv || '0',
        convenio: solicitacao.dados_carta.convenio || '00000000000000000000',
        cnab: cnabArray,
        nomeGerente: solicitacao.dados_carta.gerente_nome,
        telefoneGerente: solicitacao.dados_carta.gerente_telefone,
        emailGerente: solicitacao.dados_carta.gerente_email,
        cnpjSoftwareHouse: usuario.cnpj,
        // Dados específicos para Nexxera
        cidade: solicitacao.dados_carta.cidade || '',
        estado: solicitacao.dados_carta.estado || '',
        preferenciaContato: solicitacao.dados_carta.preferencia_contato_gerente || 'Email'
      },
      produto: produtosArray, // Para template Finnet
      produtos: produtosArray, // Para template Nexxera
      cnab: cnabArray
    };

    // Determinar o padrão VAN baseado no fornecedor
    const padraoVan = solicitacao.fornecedor_van.toLowerCase();
    
    // Gerar PDF usando o serviço de PDF
    return await this.pdfService.generatePdfFromTemplate(padraoVan, templateData);
  }
} 
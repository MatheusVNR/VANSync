import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SolicitacaoCarta, StatusSolicitacao } from '../../database/entities/SolicitacaoCarta';
import { Usuario } from '../../database/entities/Usuario';
import { Banco } from '../../database/entities/Banco';
import { UsuariosService } from '../usuarios/usuarios.service';
import { PdfService } from '../pdf/pdf.service';
import { TemplatesService } from '../templates/templates.service';
import { RedisService } from '../redis/redis.service';

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

    return this.solicitacaoModel.create({
      ...dados,
      usuario_id: usuario.id,
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
    await this.pdfService.clearPdfCache(solicitacaoId);
  }
} 
import {
    Controller,
    Post,
    Body,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { PdfService } from './pdf.service';
  import { SolicitacoesService } from '../solicitacoes/solicitacoes.service';
  
@Controller('pdf')
export class PdfController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly solicitacoesService: SolicitacoesService,
  ) {}

  @Post('base64')
  async generatePdfBase64(@Body() body: any): Promise<{ base64: string }> {
    try {
      const solicitacaoId = body.solicitacaoId;

      const solicitacao = await this.solicitacoesService.findOne(solicitacaoId);
      if (!solicitacao) {
        throw new HttpException('Solicitação não encontrada.', HttpStatus.NOT_FOUND);
      }

      const dadosRaw = typeof solicitacao.dados_carta === 'string'
        ? JSON.parse(solicitacao.dados_carta)
        : solicitacao.dados_carta || {};

      const data = {
        banco: {
          nome: solicitacao.banco?.nome || 'Banco Exemplo',
          padrao_van: dadosRaw.padrao_van || solicitacao.banco?.padrao_van || '',
        },
        dados: {
          razaoSocial: dadosRaw.nome_empresa || '',
          cnpjEmitente: dadosRaw.cnpj_cliente || '',
          telefone: dadosRaw.telefone || '',
          email: dadosRaw.email || '',
          nomeResponsavel: dadosRaw.nome_empresa || '',
          cargoResponsavel: dadosRaw.cargo || '',
          emailGerente: dadosRaw.gerente_email || '',
          telefoneGerente: dadosRaw.gerente_telefone || '',
          nomeGerente: dadosRaw.gerente_nome || '',
          agencia: dadosRaw.agencia || '',
          conta: dadosRaw.conta || '',
          contaDV: dadosRaw.conta_dv || '',
          convenio: dadosRaw.convenio || '',
          cidade: dadosRaw.cidade || '',
          estado: dadosRaw.estado || '',
          preferenciaContato: dadosRaw.preferencia_contato || '',
        },
        produtos: Array.isArray(solicitacao.produto)
          ? solicitacao.produto
          : typeof solicitacao.produto === 'string' && solicitacao.produto.includes(',')
            ? solicitacao.produto.split(',').map(p => p.trim())
            : [solicitacao.produto],
        cnab: dadosRaw.cnab || '',
      };

      console.log('📄 Dados para gerar PDF:', JSON.stringify(data, null, 2));

      const base64 = await this.pdfService.generatePdfBase64(solicitacaoId, data);
      return { base64 };
    } catch (error) {
      console.error('❌ Erro ao gerar PDF:', error);
      throw new HttpException('Erro ao gerar PDF', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
  
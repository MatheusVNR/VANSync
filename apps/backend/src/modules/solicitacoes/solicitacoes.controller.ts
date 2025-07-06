import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { SolicitacoesService } from './solicitacoes.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TipoUsuario } from '../../database/entities/Usuario';
import { StatusSolicitacao } from '../../database/entities/SolicitacaoCarta';

@Controller('solicitacoes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SolicitacoesController {
  constructor(private readonly solicitacoesService: SolicitacoesService) {}

  @Post()
  create(@Body() createSolicitacaoDto: any) {
    return this.solicitacoesService.create(createSolicitacaoDto);
  }

  @Get()
  findAll(@Query() query: any) {
    return this.solicitacoesService.findAll(query);
  }

  @Get('dashboard')
  getDashboardStats(@Query('cnpj') cnpj?: string) {
    return this.solicitacoesService.getDashboardStats(cnpj);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.solicitacoesService.findOne(+id);
  }

  @Get(':id/pdf')
  async generatePdf(@Param('id') id: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.solicitacoesService.generatePdf(+id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="carta-van-${id}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao gerar PDF',
        error: error.message,
      });
    }
  }

  @Get(':id/pdf/base64')
  async generatePdfBase64(@Param('id') id: string) {
    return {
      base64: await this.solicitacoesService.generatePdfBase64(+id),
    };
  }

  @Post(':id/send')
  async sendPdfToClient(@Param('id') id: string) {
    await this.solicitacoesService.sendPdfToClient(+id);
    return {
      message: 'PDF enviado com sucesso',
    };
  }

  @Post(':id/clear-cache')
  @Roles(TipoUsuario.ADMIN)
  async clearPdfCache(@Param('id') id: string) {
    await this.solicitacoesService.clearPdfCache(+id);
    return {
      message: 'Cache do PDF limpo com sucesso',
    };
  }

  @Patch(':id')
  @Roles(TipoUsuario.ADMIN)
  update(@Param('id') id: string, @Body() updateSolicitacaoDto: any) {
    return this.solicitacoesService.update(+id, updateSolicitacaoDto);
  }

  @Patch(':id/status')
  @Roles(TipoUsuario.ADMIN)
  updateStatus(
    @Param('id') id: string, 
    @Body() body: { status: StatusSolicitacao; observacoes?: string }
  ) {
    return this.solicitacoesService.updateStatus(+id, body.status, body.observacoes);
  }

  @Delete(':id')
  @Roles(TipoUsuario.ADMIN)
  remove(@Param('id') id: string) {
    return this.solicitacoesService.remove(+id);
  }

  @Post('preview-pdf')
  async generatePreviewPdf(@Body() previewData: any) {
    try {
      console.log('🔄 Iniciando geração de preview PDF');
      console.log('📋 Dados recebidos:', JSON.stringify(previewData, null, 2));
      
      const { banco_id, produtos, formData, fornecedor_van } = previewData;
      
      console.log(`🏦 Banco ID: ${banco_id}`);
      console.log(`📦 Produtos: ${produtos.join(', ')}`);
      console.log(`🔧 Fornecedor VAN: ${fornecedor_van}`);
      
      const pdfs = await Promise.all(
        produtos.map(async (produto: string, index: number) => {
          console.log(`📄 Gerando PDF ${index + 1}/${produtos.length} para produto: ${produto}`);
          
          try {
            const pdfBase64 = await this.solicitacoesService.generatePreviewPdf({
              banco_id,
              produto,
              formData,
              fornecedor_van
            });
            
            console.log(`✅ PDF ${index + 1} gerado com sucesso (${pdfBase64.length} caracteres base64)`);
            
            return {
              produto,
              pdfBase64,
              titulo: `Carta de Solicitação - ${produto}`
            };
          } catch (error) {
            console.error(`❌ Erro ao gerar PDF ${index + 1} para ${produto}:`, error.message);
            throw error;
          }
        })
      );
      
      console.log(`🎉 Todos os ${pdfs.length} PDFs gerados com sucesso`);
      
      return {
        success: true,
        pdfs
      };
    } catch (error) {
      console.error('❌ Erro geral na geração de preview PDF:', error.message);
      console.error('Stack trace:', error.stack);
      
      return {
        success: false,
        message: error.message,
        error: error
      };
    }
  }

  /**
   * Novo endpoint para gerar preview PDF com cache
   */
  @Post('preview-pdf-with-cache')
  async generatePreviewPdfWithCache(@Body() previewData: any) {
    try {
      console.log('🔄 Iniciando geração de preview PDF com cache');
      console.log('📋 Dados recebidos:', JSON.stringify(previewData, null, 2));
      
      const { banco_id, produtos, formData, fornecedor_van } = previewData;
      
      console.log(`🏦 Banco ID: ${banco_id}`);
      console.log(`📦 Produtos: ${produtos.join(', ')}`);
      console.log(`🔧 Fornecedor VAN: ${fornecedor_van}`);
      
      const pdfs = await Promise.all(
        produtos.map(async (produto: string, index: number) => {
          console.log(`📄 Gerando PDF ${index + 1}/${produtos.length} para produto: ${produto}`);
          
          try {
            const resultado = await this.solicitacoesService.generatePreviewPdfWithCache({
              banco_id,
              produto,
              formData,
              fornecedor_van
            });
            
            console.log(`✅ PDF ${index + 1} gerado com sucesso (${resultado.pdfBase64.length} caracteres base64)`);
            console.log(`🔑 Cache key: ${resultado.cacheKey}`);
            
            return {
              produto,
              pdfBase64: resultado.pdfBase64,
              cacheKey: resultado.cacheKey,
              titulo: `Carta de Solicitação - ${produto}`
            };
          } catch (error) {
            console.error(`❌ Erro ao gerar PDF ${index + 1} para ${produto}:`, error.message);
            throw error;
          }
        })
      );
      
      console.log(`🎉 Todos os ${pdfs.length} PDFs gerados com sucesso`);
      
      return {
        success: true,
        pdfs
      };
    } catch (error) {
      console.error('❌ Erro geral na geração de preview PDF com cache:', error.message);
      console.error('Stack trace:', error.stack);
      
      return {
        success: false,
        message: error.message,
        error: error
      };
    }
  }

  @Post(':id/send-emails')
  async sendCartasEmail(@Param('id') id: string, @Body() body?: { cacheKeys?: string[] }) {
    try {
      const resultado = await this.solicitacoesService.sendCartasEmail(+id, body?.cacheKeys);
      return {
        success: resultado.success,
        message: resultado.message,
        emailsEnviados: resultado.emailsEnviados
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        emailsEnviados: 0
      };
    }
  }

  @Post(':id/zapier-integration')
  async integrateZapier(@Param('id') id: string, @Body() body?: { cacheKeys?: string[] }) {
    try {
      const resultado = await this.solicitacoesService.integrateZapier(+id, body?.cacheKeys);
      return {
        success: resultado.success,
        message: resultado.message,
        integracoesEnviadas: resultado.integracoesEnviadas
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        integracoesEnviadas: 0
      };
    }
  }

  @Post(':id/finalizar')
  async finalizarSolicitacao(@Param('id') id: string) {
    try {
      const solicitacao = await this.solicitacoesService.finalizarSolicitacao(+id);
      return {
        success: true,
        message: 'Solicitação finalizada com sucesso',
        solicitacao
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        solicitacao: null
      };
    }
  }

  /**
   * Novo endpoint para processamento completo com cache
   */
  @Post(':id/processar-completo')
  async processarCompleto(@Param('id') id: string, @Body() body?: { cacheKeys?: string[] }) {
    try {
      const resultado = await this.solicitacoesService.processarCompleto(+id, body?.cacheKeys);
      return {
        success: resultado.success,
        message: resultado.message,
        resultados: resultado.resultados,
        solicitacao: resultado.solicitacao
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        resultados: {
          emails: { success: false, message: error.message, emailsEnviados: 0 },
          zapier: { success: false, message: error.message, integracoesEnviadas: 0 },
          finalizacao: { success: false, message: error.message }
        },
        solicitacao: null
      };
    }
  }

  /**
   * Endpoint para recuperar PDF do cache
   */
  @Get('cache/:cacheKey')
  async getPdfFromCache(@Param('cacheKey') cacheKey: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.solicitacoesService.getPdfFromCache(cacheKey);
      
      if (!pdfBuffer) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: 'PDF não encontrado no cache'
        });
      }
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="carta-van-cache.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.send(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erro ao recuperar PDF do cache',
        error: error.message,
      });
    }
  }
} 
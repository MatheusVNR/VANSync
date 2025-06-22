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
} 
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
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
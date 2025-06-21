import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { TipoUsuario } from '../../database/entities/Usuario';

@Controller('usuarios')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @Roles(TipoUsuario.ADMIN)
  create(@Body() createUsuarioDto: any) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @Roles(TipoUsuario.ADMIN)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  @Roles(TipoUsuario.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(+id);
  }

  @Patch(':id')
  @Roles(TipoUsuario.ADMIN)
  update(@Param('id') id: string, @Body() updateUsuarioDto: any) {
    return this.usuariosService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @Roles(TipoUsuario.ADMIN)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
} 
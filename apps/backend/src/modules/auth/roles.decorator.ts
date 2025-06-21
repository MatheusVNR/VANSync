import { SetMetadata } from '@nestjs/common';
import { TipoUsuario } from '../../database/entities/Usuario';

export const Roles = (...roles: TipoUsuario[]) => SetMetadata('roles', roles); 
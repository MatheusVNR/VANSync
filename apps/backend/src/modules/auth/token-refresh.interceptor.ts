import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class TokenRefreshInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    
    return next.handle().pipe(
      map(data => {
        // Verificar se há token no header
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const token = authHeader.substring(7);
          
          // Verificar se o token está próximo de expirar
          if (this.authService.isTokenExpiringSoon(token)) {
            // Adicionar header para indicar que o token está expirando
            response.set('X-Token-Expiring', 'true');
            response.set('X-Token-Expires-In', '120'); // 2 minutos
          }
        }
        
        return data;
      })
    );
  }
} 
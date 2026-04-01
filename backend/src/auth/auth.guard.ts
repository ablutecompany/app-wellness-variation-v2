import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  /**
   * Verificar se o pedido tem um token de sessão válido.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token de autenticação não fornecido ou inválido');
    }

    const token = authHeader.split(' ')[1];
    try {
      const user = await this.authService.validateSession(token);
      request.user = user; // Anexar o utilizador autenticado ao pedido
      return true;
    } catch (e) {
      throw new UnauthorizedException('Sessão expirada ou inválida');
    }
  }
}

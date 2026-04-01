import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Verificar permissões por papel e garantir o escopo do utilizador.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Se nenhuma regra for definida, assumir que a rota é protegida por defeito (deny-all ou apenas auth)
    // Mas aqui permitimos se não houver @Roles (conforme política de cada projecto)
    if (!requiredRoles) {
      return true;
    }

    const { user, body, params, query } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Utilizador não identificado na sessão');
    }

    // 1. Validar papel (RBAC Base)
    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException(`Acesso negado para o papel: ${user.role}`);
    }

    // 2. Garantir ESCALARIDADE (Data Scoping)
    // Se for um utilizador comum, só pode aceder aos seus dados
    if (user.role === UserRole.END_USER) {
      const targetUserId = body.userId || params.userId || query.userId;
      
      // Se houver um targetUserId explícito, tem de ser o do próprio utilizador
      if (targetUserId && targetUserId !== user.id) {
        throw new ForbiddenException('Tentativa de aceder a dados de outro utilizador detectada');
      }
      
      // Injectar o userId da sessão no body se não houver, para garantir integridade biográfica
      if (body && !body.userId) body.userId = user.id;
    }

    // 3. MINIAPP_RUNTIME: Garantir que não acede a query global
    if (user.role === UserRole.MINIAPP_RUNTIME) {
       // Futura lógica de validação de app_id no header vs payload
    }

    return true;
  }
}

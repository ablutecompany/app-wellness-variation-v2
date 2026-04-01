import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('audit')
@UseGuards(AuthGuard, RolesGuard)
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Post('consumption')
  @Roles(UserRole.END_USER, UserRole.SERVICE_BACKEND, UserRole.ADMIN_INTERNAL)
  async trackConsumption(
    @Body() body: { 
      userId: string; 
      domain: string; 
      insightId: string; 
      bundleVersion: string;
      action?: 'viewed' | 'tapped';
    }
  ) {
    const { userId, domain, insightId, bundleVersion, action = 'viewed' } = body;
    
    // Rastro de Auditoria: Log imediato de consumo biográfico
    await this.auditService.logInsightConsumption(
      userId, 
      domain, 
      insightId, 
      bundleVersion, 
      action
    );

    return { 
      status: 'logged', 
      domain, 
      insightId, 
      timestamp: new Date().toISOString() 
    };
  }
}

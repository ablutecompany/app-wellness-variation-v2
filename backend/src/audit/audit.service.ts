import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(actorType: string, actorId: string, eventType: string, targetType?: string, targetId?: string, payload?: any) {
    return this.prisma.auditEvent.create({
      data: {
        actorType,
        actorId,
        eventType,
        targetType,
        targetId,
        payload,
      },
    });
  }
}

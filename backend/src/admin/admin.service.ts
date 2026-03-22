import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async approveAddon(addonId: string) {
    return this.prisma.addonApp.update({
      where: { id: addonId },
      data: { status: 'approved' },
    });
  }

  async getAuditLogs() {
    return this.prisma.auditEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}

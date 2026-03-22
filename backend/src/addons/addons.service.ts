import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AddonsService {
  constructor(private prisma: PrismaService) {}

  async getCatalog() {
    return this.prisma.addonApp.findMany({
      where: { active: true, status: 'approved' },
      include: { capabilities: true },
    });
  }

  async install(userId: string, addonId: string) {
    const addon = await this.prisma.addonApp.findUnique({
      where: { id: addonId },
    });

    if (!addon) throw new NotFoundException('Add-on not found');

    return this.prisma.addonInstallation.create({
      data: {
        userId,
        addonId,
        status: 'active',
      },
    });
  }

  async getInstallations(userId: string) {
    return this.prisma.addonInstallation.findMany({
      where: { userId, status: 'active' },
      include: { addon: true },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EquipmentService {
  constructor(private prisma: PrismaService) {}

  async findNearby(lat: number, lng: number) {
    // Basic geofence simulation
    return this.prisma.equipmentLocation.findMany({
      include: { equipments: true },
    });
  }

  async startSession(userId: string, equipmentId: string, pairingMethod: string) {
    return this.prisma.equipmentSession.create({
      data: {
        userId,
        equipmentId,
        pairingMethod,
        status: 'active',
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MeasurementService {
  constructor(private prisma: PrismaService) {}

  async ingest(userId: string, data: any) {
    const session = await this.prisma.measurementSession.create({
      data: {
        userId,
        sourceType: data.sourceType,
        sourceId: data.sourceId,
        sessionType: data.sessionType,
        startedAt: new Date(data.startedAt || Date.now()),
        validationStatus: 'pending',
        processingStatus: 'received',
      },
    });

    // In a real scenario, we'd trigger normalization here
    // For now, we save the raw data
    if (data.raw) {
      await this.prisma.rawMeasurement.create({
        data: {
          sessionId: session.id,
          family: data.raw.family,
          code: data.raw.code,
          rawValue: data.raw.value,
          unit: data.raw.unit,
          capturedAt: new Date(),
          ingestVersion: '1.0',
        },
      });
    }

    return session;
  }

  async getLatestBiomarkers(userId: string) {
    return this.prisma.biomarkerResult.findMany({
      where: { userId, userVisible: true },
      orderBy: { capturedAt: 'desc' },
      take: 20,
      include: { definition: true },
    });
  }
}

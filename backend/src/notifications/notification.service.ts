import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async send(userId: string, title: string, body: string, type: string) {
    return this.prisma.notificationEvent.create({
      data: {
        userId,
        title,
        body,
        type,
        status: 'pending',
        scheduledFor: new Date(),
      },
    });
  }
}

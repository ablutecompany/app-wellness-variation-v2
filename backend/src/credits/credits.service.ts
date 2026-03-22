import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const wallet = await this.prisma.creditWallet.findUnique({
      where: { userId },
    });
    return wallet?.currentBalance || 0;
  }

  async consume(userId: string, amount: number, referenceType: string, referenceId: string) {
    const wallet = await this.prisma.creditWallet.findUnique({
      where: { userId },
    });

    if (!wallet || wallet.currentBalance < amount) {
      throw new BadRequestException('Insufficient credits');
    }

    return this.prisma.$transaction([
      this.prisma.creditWallet.update({
        where: { userId },
        data: {
          currentBalance: { decrement: amount },
          lifetimeConsumed: { increment: amount },
        },
      }),
      this.prisma.creditTransaction.create({
        data: {
          userId,
          amount: -amount,
          type: 'consumption',
          balanceBefore: wallet.currentBalance,
          balanceAfter: wallet.currentBalance - amount,
          referenceType,
          referenceId,
        },
      }),
    ]);
  }
}

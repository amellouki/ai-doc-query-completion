import { Injectable } from '@nestjs/common';
import { HistoryItem, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HistoryService {
  constructor(private prismaService: PrismaService) {}

  async createHistoryItem(
    data: Prisma.HistoryItemCreateInput,
  ): Promise<HistoryItem> {
    return this.prismaService.historyItem.create({
      data,
    });
  }

  async getHistoryByConversationId(
    conversationId: number,
  ): Promise<HistoryItem[]> {
    return this.prismaService.historyItem.findMany({
      where: {
        conversationId,
      },
    });
  }

  async updateHistoryById(
    id: number,
    data: Prisma.HistoryItemUpdateInput,
  ): Promise<HistoryItem> {
    return this.prismaService.historyItem.update({
      where: {
        id,
      },
      data,
    });
  }
}

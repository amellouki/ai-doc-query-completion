import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConversationService } from './repositories/conversation/conversation.service';
import { HistoryService } from './repositories/history/history.service';
import { Conversation, HistoryItem, Prisma } from '@prisma/client';
import { AppendHistoryDto } from './dto/convo-retrieval-qa-request.dto';

@Controller('api')
export class AppController {
  constructor(
    private conversationService: ConversationService,
    private historyService: HistoryService,
  ) {}

  @Post('/create_conversation')
  async createConvo(@Body() request: any): Promise<Conversation> {
    const convoData: Prisma.ConversationCreateInput = {
      History: {
        create: [],
      },
      retrievalLanguageModel: {
        create: {
          name: 'Retrieval Language Model',
        },
      },
      conversationModel: {
        create: {
          name: 'QA Language Model',
        },
      },
      human: {
        create: {
          name: 'Human',
        },
      },
    };
    console.log(request);
    return this.conversationService.createConversation(convoData);
  }

  @Get('conversations')
  async getConversations(): Promise<Conversation[]> {
    return this.conversationService.conversations();
  }

  @Get('conversation')
  async getConversationHistory(@Query('id') id: string): Promise<Conversation> {
    return this.conversationService.conversationHistory(Number(id));
  }

  @Post('append-to-history')
  async appendItem(@Body() request: AppendHistoryDto): Promise<HistoryItem> {
    const historyItemData: Prisma.HistoryItemCreateInput = {
      ...request.historyItem,
      conversation: {
        connect: {
          id: request.conversationId,
        },
      },
    };
    return this.historyService.createHistoryItem(historyItemData);
  }
}

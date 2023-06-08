import { Module } from '@nestjs/common';
import { ConversationModule } from './conversation/conversation.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [ConversationModule, HistoryModule],
  exports: [ConversationModule, HistoryModule],
})
export class RepositoriesModule {}

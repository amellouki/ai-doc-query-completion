import { Module } from '@nestjs/common';
import { ConversationalRetrievalQaService } from './conversational-retrieval-qa.service';
import { ConversationalRetrievalQaController } from './conversational-retrieval-qa.controller';

@Module({
  providers: [ConversationalRetrievalQaService],
  controllers: [ConversationalRetrievalQaController]
})
export class ConversationalRetrievalQaModule {}

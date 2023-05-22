import { Module } from '@nestjs/common';
import { PineconeService } from './pinecone/pinecone.service';

@Module({
  providers: [PineconeService],
})
export class ServicesModule {}

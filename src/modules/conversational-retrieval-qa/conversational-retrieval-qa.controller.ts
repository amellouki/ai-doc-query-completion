import { Controller } from '@nestjs/common';
import { ConversationalRetrievalQaService } from './conversational-retrieval-qa.service';

@Controller('conversational-retrieval-qa')
export class ConversationalRetrievalQaController {
  constructor(private service: ConversationalRetrievalQaService) {}
}

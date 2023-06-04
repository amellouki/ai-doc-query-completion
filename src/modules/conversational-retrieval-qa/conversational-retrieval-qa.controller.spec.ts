import { Test, TestingModule } from '@nestjs/testing';
import { ConversationalRetrievalQaController } from './conversational-retrieval-qa.controller';

describe('ConversationalRetrievalQaController', () => {
  let controller: ConversationalRetrievalQaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConversationalRetrievalQaController],
    }).compile();

    controller = module.get<ConversationalRetrievalQaController>(ConversationalRetrievalQaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

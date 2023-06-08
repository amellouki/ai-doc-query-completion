import { Injectable } from '@nestjs/common';
import { ENV, QUERY_EMBEDDING_MODEL } from '../../constants';
import { PineconeStore } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { ConfigService } from '@nestjs/config';
import { PineconeService } from '../../services/pinecone/pinecone.service';
import { OpenAI } from 'langchain/llms';
import { CallbackManager } from 'langchain/callbacks';
import { BufferMemory, ChatMessageHistory } from 'langchain/memory';
import {
  AIChatMessage,
  HumanChatMessage,
  SystemChatMessage,
} from 'langchain/schema';
import { HistoryItem } from '../../dto/convo-retrieval-qa-request.dto';
import DocConversationalChain from '../../model/chains/doc-conversational-chain';

@Injectable()
export class ConversationalRetrievalQaService {
  constructor(
    private configService: ConfigService,
    private pinecone: PineconeService,
  ) {}

  private constructHistory(array: HistoryItem[]): ChatMessageHistory {
    const messages = array.map((message) => {
      switch (message.fromType) {
        case 'system':
          return new SystemChatMessage(message.content);
        case 'ai':
          return new AIChatMessage(message.content);
        case 'human':
          return new HumanChatMessage(message.content);
        default:
          throw new Error('message type not supported');
      }
    });
    return new ChatMessageHistory(messages);
  }

  async getCompletion(
    question: string,
    history: HistoryItem[],
    handleLLMNewToken?: (token: string, chainType: string) => Promise<void>,
  ) {
    const openAiApiKey = this.configService.get<string>(ENV.OPEN_AI_API_KEY);
    if (!openAiApiKey) {
      throw new Error(
        'Some environment variables are not set. Please check your .env.local file.',
      );
    }
    const pineconeIndex = await this.pinecone.getIndex();

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({
        openAIApiKey: openAiApiKey,
        modelName: QUERY_EMBEDDING_MODEL,
      }),
      { pineconeIndex },
    );

    const questionAnsweringModel = new OpenAI({
      openAIApiKey: openAiApiKey,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: (token) => {
          if (handleLLMNewToken) {
            return handleLLMNewToken(token, 'question-answering');
          }
        },
      }),
    });

    const questionGenerationModel = new OpenAI({
      openAIApiKey: openAiApiKey,
      streaming: true,
      // modelName: 'gpt-4',
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken: (token) => {
          if (handleLLMNewToken) {
            return handleLLMNewToken(token, 'question-generation');
          }
        },
      }),
    });

    const chain = DocConversationalChain.fromLLM(
      questionAnsweringModel,
      vectorStore.asRetriever(1),
      {
        returnSourceDocuments: true,
        memory: new BufferMemory({
          memoryKey: 'chat_history',
          inputKey: 'question', // The key for the input to the chain
          outputKey: 'text', // The key for the final conversational output of the chain
          returnMessages: true, // If using with a chat model
          chatHistory: this.constructHistory(history),
        }),
        questionGeneratorChainOptions: {
          llm: questionGenerationModel,
        },
      },
    );
    return await chain.call({
      question,
      chat_history: this.constructHistory(history),
    });
  }
}

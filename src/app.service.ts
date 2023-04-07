import { Injectable, Logger } from "@nestjs/common";
import { PineconeClient } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { OpenAI } from 'langchain/llms';
import { CallbackManager } from 'langchain/callbacks';
import { VectorDBQAChain } from 'langchain/chains';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

const environment = process.env.NEXT_PUBLIC_PINECONE_ENVIRONMENT;
const indexName = process.env.NEXT_PUBLIC_PINECONE_INDEX;
const apiKey = process.env.NEXT_PUBLIC_PINECONE_API_KEY;
const openAiApiKey = process.env.NEXT_PUBLIC_CHAT_GPT_API_KEY;

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  async getDocs(
    query: string,
    handleLLMNewToken: (text: string) => Promise<void>,
  ) {
    if (!environment || !indexName || !apiKey || !openAiApiKey) {
      throw new Error(
        'Pinecone environment, index, openAiApiKey, and Pinecone API key must be set in environment variables',
      );
    }
    const client = new PineconeClient();
    await client.init({
      apiKey: apiKey,
      environment: environment,
    });
    const pineconeIndex = client.Index(indexName);

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: openAiApiKey }),
      { pineconeIndex },
    );

    /* Search the vector DB independently with meta filters */
    const docs = await vectorStore.similaritySearch(query);

    const model = new OpenAI({
      openAIApiKey: openAiApiKey,
      streaming: true,
      callbackManager: CallbackManager.fromHandlers({
        handleLLMNewToken,
      }),
    });
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);

    const response = await chain.call({ query });
    return response;
  }
}

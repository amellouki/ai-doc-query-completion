import {
  Body,
  Controller,
  Get,
  Logger,
  MessageEvent,
  Post,
  Res,
  Sse,
} from '@nestjs/common';
import { ConversationalRetrievalQaService } from './conversational-retrieval-qa.service';
import { Observable } from 'rxjs';
import { END_COMPLETION } from '../../constants';
import { ConvoRetrievalQaRequestDto } from '../../dto/convo-retrieval-qa-request.dto';
import { Socket } from 'socket.io';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

function getData(type: string, content: unknown, params?: unknown) {
  return {
    type,
    content,
    params,
  };
}

@WebSocketGateway({
  namespace: 'conversational-retrieval-qa',
  cors: {
    origin: process.env.ALLOWED_DOMAINS?.split(','),
    methods: 'GET,HEAD',
  },
})
export class ConversationalRetrievalQaGateway {
  private readonly logger = new Logger(ConversationalRetrievalQaGateway.name);

  constructor(private service: ConversationalRetrievalQaService) {
    this.logger.log(process.env.ALLOWED_DOMAINS?.split(','));
  }

  @SubscribeMessage('getCompletion')
  getCompletion(
    @MessageBody() request: ConvoRetrievalQaRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { question, history } = request;
    const sendCompletion = async (token: string, chainType: string) => {
      client.emit(
        'data',
        getData('token', token, {
          chainType,
        }),
      );
    };
    this.service
      .getCompletion(question || '', history, sendCompletion)
      .then(({ text, sourceDocuments }) => {
        client.emit('data', getData('response', text));
        client.emit('data', getData('resources', sourceDocuments));
        client.emit('event', { state: END_COMPLETION });
        client.disconnect();
      })
      .catch((error) => {
        this.logger.error('Completion error', error);
        client.emit('error', JSON.stringify(error));
      });
  }
}

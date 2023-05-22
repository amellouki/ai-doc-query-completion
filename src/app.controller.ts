import { Controller, Get, Logger, Query, Sse } from '@nestjs/common';
import { AppService } from './app.service';
import { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import { END_COMPLETION } from './constants';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

function getData(type: string, content: unknown) {
  return JSON.stringify({
    type,
    content,
  });
}

@Controller('completion')
export class AppController {
  constructor(private readonly appService: AppService) {}

  private readonly logger = new Logger(AppController.name);

  @Sse()
  @Get()
  getCompletion(@Query('query') query: string): Observable<MessageEvent> {
    return new Observable<MessageEvent>((subscriber) => {
      let completion = '';
      const sendCompletion = async (token: string) => {
        completion += token;
        subscriber.next({ data: getData('response', completion) });
      };

      this.appService
        .getDocs(query || '', sendCompletion)
        .then(({ response, docs }) => {
          subscriber.next({
            data: getData('response', response.text),
          });
          subscriber.next({
            data: getData('debug', docs),
          });
          subscriber.next({ data: END_COMPLETION });
          subscriber.complete();
        })
        .catch((error) => {
          this.logger.error('Completion api error', error);
          subscriber.error(error);
        });
    });
  }
}

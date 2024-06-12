import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GptService } from '../gpt/gpt.service';
import { ParserService } from '../parser/parser.service';

@Injectable()
export class CopywriterService {
  constructor(
    private readonly configService: ConfigService,
    private readonly gptService: GptService,
    private readonly parserService: ParserService,
  ) {}

  async create(url: string, prompt?: string) {
    return await this.gptService.sendPrompt(`${prompt} ${url}`);
  }
}

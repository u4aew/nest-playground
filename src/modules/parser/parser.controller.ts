import { Controller, Post, Body } from '@nestjs/common';
import { ParserService } from './parser.service';

@Controller('proxy/parser')
export class ParserController {
  constructor(private readonly parserService: ParserService) {}

  @Post('create')
  async getPromptResponse(@Body('url') url: string): Promise<string> {
    return this.parserService.parsePage(url);
  }
}

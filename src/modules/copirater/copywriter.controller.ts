import { Controller, Post, Body } from '@nestjs/common';
import { CopywriterService } from './copywriter.service';

@Controller('proxy/copywriter')
export class CopywriterController {
  constructor(private readonly gptService: CopywriterService) {}

  @Post('create')
  async getPromptResponse(@Body() data: any): Promise<string> {
    return this.gptService.create(data.url, data.prompt);
  }
}

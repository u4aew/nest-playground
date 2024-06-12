import { Controller, Post, Body } from '@nestjs/common';
import { GptService } from './gpt.service';

@Controller('proxy/gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('prompt')
  async getPromptResponse(@Body('prompt') prompt: string): Promise<string> {
    return this.gptService.sendPrompt(prompt);
  }
}

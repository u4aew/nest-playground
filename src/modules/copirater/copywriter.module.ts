import { Module } from '@nestjs/common';
import { CopywriterService } from './copywriter.service';
import { CopywriterController } from './copywriter.controller';
import { GptService } from '../gpt/gpt.service';
import { ParserService } from '../parser/parser.service';

@Module({
  providers: [CopywriterService, GptService, ParserService],
  controllers: [CopywriterController],
})
export class CopywriterModule {}

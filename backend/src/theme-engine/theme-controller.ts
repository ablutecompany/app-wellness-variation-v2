import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ThemeEngineService } from './theme-engine.service';

@Controller('v1/themes')
export class ThemeController {
  constructor(private themeEngine: ThemeEngineService) {}

  @Get()
  async getThemes(@Body() body: { userId: string, requestedDomains?: string[] }) {
    return this.themeEngine.getUserThemes(body.userId, body.requestedDomains);
  }

  @Post(':code/calculate')
  async calculate(@Param('code') code: string, @Body() body: any) {
    return this.themeEngine.calculateScore(body.userId, code);
  }
}

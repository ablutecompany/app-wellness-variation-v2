import { Module } from '@nestjs/common';
import { ThemeEngineService } from './theme-engine.service';
import { ThemeController } from './theme-controller';

@Module({
  providers: [ThemeEngineService],
  controllers: [ThemeController],
  exports: [ThemeEngineService],
})
export class ThemeModule {}

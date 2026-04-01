import { Module } from '@nestjs/common';
import { ScoringService } from './scoring.service';
import { InsightComposerService } from './insight-composer.service';
import { RecommendationComposerService } from './recommendation-composer.service';
import { DomainEngineService } from './domain-engine.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    ScoringService,
    InsightComposerService,
    RecommendationComposerService,
    DomainEngineService
  ],
  exports: [DomainEngineService]
})
export class DomainEngineModule {}

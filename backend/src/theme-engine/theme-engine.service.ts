import { Injectable } from '@nestjs/common';
import { DomainEngineService } from '../domain-engine/domain-engine.service';
import { DomainType } from '../domain-engine/types';

@Injectable()
export class ThemeEngineService {
  constructor(private domainEngine: DomainEngineService) {}

  /**
   * Ponto de entrada para a Shell obter o rastro semântico consolidado.
   * Suporta recomputação parcial para: sleep, nutrition, general.
   */
  async getUserThemes(userId: string, requestedDomains?: string[]) {
    // 1. Sanitização de Domínios Operacionais (v1.2.0)
    // Apenas estes são suportados noutra intervenção.
    const validDomains: DomainType[] = ['sleep', 'nutrition', 'general'];
    
    const filtered = (requestedDomains || [])
      .filter(d => validDomains.includes(d as DomainType)) as DomainType[];

    // 2. Delegar ao Motor Determinístico com Refresh Seletivo
    return this.domainEngine.generateBundle(userId, filtered.length > 0 ? filtered : undefined);
  }

  async calculateScore(userId: string, code: string) {
    const domain = code as DomainType;
    const bundle = await this.domainEngine.generateBundle(userId, [domain]);
    return bundle.domains[domain];
  }
}

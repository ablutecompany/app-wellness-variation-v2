import { Injectable } from '@nestjs/common';
import { DomainEngineService } from '../domain-engine/domain-engine.service';
import { DomainType } from '../domain-engine/types';

@Injectable()
export class ThemeEngineService {
  constructor(private domainEngine: DomainEngineService) {}

  /**
   * Ponto de entrada para a Shell obter o rastro semântico.
   * Suporta recomputação parcial via requestedDomains (v1.2.0).
   */
  async getUserThemes(userId: string, requestedDomains?: string[]) {
    // 1. Sanitização de Domínios
    const validDomains: DomainType[] = ['sleep', 'nutrition', 'general', 'energy', 'recovery', 'performance'];
    const filtered = (requestedDomains || [])
      .filter(d => validDomains.includes(d as DomainType)) as DomainType[];

    // 2. Delegar ao Motor Determinístico
    return this.domainEngine.generateBundle(userId, filtered.length > 0 ? filtered : undefined);
  }

  async calculateScore(userId: string, code: string) {
    // Método legado ou para cálculos avulsos por domínio
    const domain = code as DomainType;
    const bundle = await this.domainEngine.generateBundle(userId, [domain]);
    return bundle.domains[domain];
  }
}

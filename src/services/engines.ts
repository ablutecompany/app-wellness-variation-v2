import { theme } from '../theme';

interface Insight {
  title: string;
  score: number;
  state: string;
  summary: string;
  explanation: string;
  optimizations: { type: string; description: string }[];
  potential: string;
}

const SUMMARIES = [
  "O teu corpo está a processar uma carga de stress físico elevada.",
  "Estado de alerta excelente com boa resiliência cognitiva.",
  "Níveis de energia estáveis, mas com sinais de fadiga latente.",
  "Recuperação metabólica em curso após o período de repouso.",
];

const EXPLANATIONS = [
  "Os biomarcadores indicam uma ligeira desidratação e um rácio de cortisol/DHEA acima da média. Sugerimos foco na recuperação.",
  "A variabilidade da frequência cardíaca (HRV) está estável e o sono profundo atingiu o objetivo. Estás num estado propício para performance.",
  "O pH urinário sugere uma ligeira acidez, possivelmente devido à dieta recente ou intensidade do treino. Impacto prático: menor frescura muscular.",
];

export const LanguageEngine = {
  getSummary: () => SUMMARIES[Math.floor(Math.random() * SUMMARIES.length)],
  getExplanation: () => EXPLANATIONS[Math.floor(Math.random() * EXPLANATIONS.length)],
  
  formatOptimization: (type: string, item: string) => {
    const variations = [
      `Reforçar ${item} através de fontes como...`,
      `Ajustar ${item} para otimizar o teu estado.`,
      `Considerar ${item} como prioridade hoje.`,
    ];
    return variations[Math.floor(Math.random() * variations.length)];
  }
};

export const DecisionEngine = {
  crossReference: (measurements: any[], profile: any): Insight[] => {
    // Mock logic to cross-reference data
    // In a real app, this would use complex algorithms
    return [
      {
        title: 'Recuperação Muscular',
        score: 64 + Math.floor(Math.random() * 10),
        state: 'stável',
        summary: LanguageEngine.getSummary(),
        explanation: LanguageEngine.getExplanation(),
        potential: '64 → 72',
        optimizations: [
          { type: 'HABITOS', description: 'Aumentar o repouso ativo hoje.' },
          { type: 'ALIMENTAÇÃO', description: LanguageEngine.formatOptimization('ALIMENTAÇÃO', 'magnésio') }
        ]
      }
    ];
  }
};

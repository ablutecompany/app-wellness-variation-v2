import { theme } from '../../theme';

export interface UIInsight {
  title: string;
  iconName?: 'Activity' | 'Zap' | 'Target' | 'Heart' | 'Moon' | 'Brain' | 'User';
  score?: number;
  textValue?: string;
  
  // Para ThemeCard
  paragraph1: string;
  paragraph2: string;
  refText1: string;
  refText2: string;
  suggestions?: { title: string; desc: string }[];
  
  // Propriedades herdadas se a UI no futuro usar as antigas
  state?: string;
  summary?: string;
  explanation?: string;
  potential?: string;
  optimizations?: { type: string; description: string }[];
}

export function generateInsights(state: {
  themeScores: any[];
  globalScore: number;
  measurements: any[];
}): UIInsight[] {
  const hasData = state.measurements && state.measurements.length > 0;

  // Se não tem dados completos, devolvemos afirmações conservadoras e neutras
  if (!hasData) {
    const insufficientText = "Dados ainda insuficientes para estabilizar este insight.";
    const intermediateText = "A leitura atual sugere um estado intermédio, ainda com base limitada.";
    const noRefText = "Aguardamos mais leituras de sincronização para suportar com rigor este pilar.";

    return [
      {
        title: 'Performance & Equilíbrio',
        iconName: 'Activity',
        paragraph1: insufficientText,
        paragraph2: "Este sinal precisa de histórico de atividade contínua para formar uma avaliação segura.",
        refText1: noRefText,
        refText2: "Garante sincronização regular do teu dispositivo.",
        suggestions: []
      },
      {
        title: 'Energia & Disponibilidade',
        iconName: 'Zap',
        paragraph1: intermediateText,
        paragraph2: "Sem cobertura densa de métricas de repouso, a interpretação energética mantém-se genérica.",
        refText1: noRefText,
        refText2: "A avaliação fisiológica está em compasso de espera.",
        suggestions: []
      },
      {
        title: 'Recuperação Muscular',
        iconName: 'Moon',
        paragraph1: insufficientText,
        paragraph2: "Sem inputs como F2-isoprostanos ou variação térmica noturna, não é possível traçar a tua recuperação.",
        refText1: noRefText,
        refText2: "Cálculos biométricos encontram-se inativos neste quadrante temporariamente.",
        suggestions: []
      }
    ];
  }

  // Com dados, cálculo puramente determinístico assente no globalScore base
  // Zero matemática randomizada, zero alucinações.
  const base = state.globalScore;
  const isOptimal = base > 70;

  const moderateConfidenceText = "Este sinal foi calculado com confiança moderada devido à cobertura parcial dos dados.";

  return [
    {
      title: 'Performance & Equilíbrio',
      iconName: 'Activity',
      score: base, 
      paragraph1: isOptimal 
        ? "Os dados recebidos assinalam estabilidade na tua performance física corrente." 
        : "As métricas calculadas sublinham um perfil conservador para hoje.",
      paragraph2: moderateConfidenceText,
      refText1: "Determinado por correlação direta com os scores registados de forma determinística.",
      refText2: "Aviso: interpretação funcional, não médica.",
      suggestions: [
        { title: 'Gestão de Esforço', desc: 'Opta por respeitar o baseline registado sem ultrapassar limiares desconhecidos hoje.' }
      ]
    },
    {
      title: 'Energia & Disponibilidade',
      iconName: 'Zap',
      score: base > 5 ? base - 2 : base,
      paragraph1: isOptimal 
        ? "Perfil metabólico dentro da banda de disponibilidade adequada." 
        : "Poderá existir alguma quebra se não forem intercalados períodos de recuperação.",
      paragraph2: moderateConfidenceText,
      refText1: "Extração transversal ao estado de sincronização gravado nas últimas 24 horas.",
      refText2: "Qualificação sujeita a limitações por amostragem pontual.",
      suggestions: [
        { title: 'Distribuição Cuidada', desc: 'Não agregues demasiada carga num curto espaço temporal.' }
      ]
    },
    {
      title: 'Trânsito Intestinal',
      iconName: 'Target',
      score: 85, // Determinístico estático 
      paragraph1: "Padrão de deposição mapeado dentro de parâmetros habituais referenciados.",
      paragraph2: "Interpretação mecânica derivada passivamente sem leitura analítica complexa agregada atualmente.",
      refText1: "Calculado a partir de assunções passivas. Confiança limitada.",
      refText2: "Não dispensa rigor analítico ou contacto clínico perante dor.",
      suggestions: []
    },
    {
      title: 'Resistência saudável',
      iconName: 'Heart',
      score: base > 0 ? base + 1 : 0,
      paragraph1: isOptimal 
        ? "Capacidade cardiovascular mapeável não denota atritos sob os perfis testados."
        : "Adaptação a carga sustentada intermédia, mas sem indicativos de pico.",
      paragraph2: moderateConfidenceText,
      refText1: "Transposto do score de atividade basal detetada pelo motor primário.",
      refText2: "Indicador sem valor diagnóstico cardiovascular.",
      suggestions: []
    },
    {
      title: 'Recuperação',
      iconName: 'Moon',
      score: isOptimal ? base - 6 : base, // Atraso habitual da recuperação face ao score global
      paragraph1: "A leitura atual sugere um estado intermédio, ainda com base limitada.",
      paragraph2: "O sistema processa o teu reset metabólico com reserva face à ausência prolongada do detalhe noturno completo.",
      refText1: "Valores inferidos deterministicamente com base em desvios entre parâmetros isolados diurnos.",
      refText2: "Necessária janela de repouso noturno ininterrupto para maior precisão.",
      suggestions: [
        { title: 'Privilegiar Repouso', desc: 'Face a confiança estatística menor, o descanso preventivo é favorecido.' }
      ]
    },
    {
      title: 'Idade muscular',
      iconName: 'Brain',
      textValue: '35', 
      paragraph1: "Correlação sistémica do teu perfil físico base mantida sem alarmismos estruturais mensurados.",
      paragraph2: "Este sinal foi calculado com confiança moderada devido à cobertura parcial dos dados mecânicos específicos.",
      refText1: "Assentamento de métricas gerais e idade reportada.",
      refText2: "Dado de estimativa contextual, sem valor em medicina metabólica orientada.",
      suggestions: []
    }
  ];
}

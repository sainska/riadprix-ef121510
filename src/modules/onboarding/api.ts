/**
 * Operational Simplicity Module
 * Guided onboarding, tooltips, and user-friendly explanations
 */

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector or component identifier
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  completed: boolean;
}

export interface TooltipDefinition {
  key: string;
  title: string;
  content: string;
  relatedLink?: string;
}

export interface QuickView {
  id: string;
  name: string;
  description: string;
  filters: Record<string, any>;
  isDefault: boolean;
}

export const onboardingApi = {
  /**
   * Get onboarding steps for a user
   */
  async getOnboardingSteps(userId: string): Promise<OnboardingStep[]> {
    // Check if user has completed onboarding
    const completedSteps = this.getCompletedSteps(userId);

    return [
      {
        id: 'welcome',
        title: 'Welcome to RiadPrix',
        description: 'Let\'s help you get started with pricing intelligence for your properties.',
        target: '[data-onboarding="welcome"]',
        position: 'center',
        completed: completedSteps.includes('welcome'),
      },
      {
        id: 'add-property',
        title: 'Add Your First Property',
        description: 'Start by adding your property to get personalized pricing recommendations.',
        target: '[data-onboarding="add-property"]',
        position: 'bottom',
        completed: completedSteps.includes('add-property'),
      },
      {
        id: 'dashboard',
        title: 'Explore Your Dashboard',
        description: 'View market benchmarks, trends, and recommendations for your properties.',
        target: '[data-onboarding="dashboard"]',
        position: 'bottom',
        completed: completedSteps.includes('dashboard'),
      },
      {
        id: 'recommendations',
        title: 'Review Recommendations',
        description: 'See AI-powered pricing recommendations based on market data.',
        target: '[data-onboarding="recommendations"]',
        position: 'bottom',
        completed: completedSteps.includes('recommendations'),
      },
    ];
  },

  /**
   * Mark onboarding step as completed
   */
  markStepCompleted(userId: string, stepId: string): void {
    const completed = this.getCompletedSteps(userId);
    if (!completed.includes(stepId)) {
      completed.push(stepId);
      localStorage.setItem(`riadprix-onboarding-${userId}`, JSON.stringify(completed));
    }
  },

  /**
   * Get completed steps from localStorage
   */
  getCompletedSteps(userId: string): string[] {
    const stored = localStorage.getItem(`riadprix-onboarding-${userId}`);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Check if user has completed onboarding
   */
  hasCompletedOnboarding(userId: string): boolean {
    const steps = this.getCompletedSteps(userId);
    const allSteps = ['welcome', 'add-property', 'dashboard', 'recommendations'];
    return allSteps.every((step) => steps.includes(step));
  },

  /**
   * Get tooltip definitions
   */
  getTooltipDefinitions(language: 'en' | 'fr' = 'en'): Record<string, TooltipDefinition> {
    const tooltips: Record<string, TooltipDefinition> = {
      'benchmark-price': {
        key: 'benchmark-price',
        title: language === 'en' ? 'Benchmark Price' : 'Prix de Référence',
        content:
          language === 'en'
            ? 'The median price for similar properties in your market. Use this as a reference point for your pricing strategy.'
            : 'Le prix médian pour des propriétés similaires sur votre marché. Utilisez-le comme point de référence pour votre stratégie tarifaire.',
      },
      'confidence-score': {
        key: 'confidence-score',
        title: language === 'en' ? 'Confidence Score' : 'Score de Confiance',
        content:
          language === 'en'
            ? 'Indicates how reliable the data is. Higher scores mean more data points and more recent updates.'
            : 'Indique la fiabilité des données. Des scores plus élevés signifient plus de points de données et des mises à jour plus récentes.',
      },
      'market-position': {
        key: 'market-position',
        title: language === 'en' ? 'Market Position' : 'Position sur le Marché',
        content:
          language === 'en'
            ? 'Your property\'s position relative to the market: Budget, Mid-Range, Premium, or Luxury.'
            : 'La position de votre propriété par rapport au marché : Budget, Milieu de gamme, Premium ou Luxe.',
      },
      'revenue-impact': {
        key: 'revenue-impact',
        title: language === 'en' ? 'Revenue Impact' : 'Impact sur les Revenus',
        content:
          language === 'en'
            ? 'Estimated annual revenue change if you adjust your price to the recommended amount.'
            : 'Estimation du changement de revenu annuel si vous ajustez votre prix au montant recommandé.',
      },
    };

    return tooltips;
  },

  /**
   * Get quick view presets
   */
  getQuickViews(): QuickView[] {
    return [
      {
        id: 'overview',
        name: 'Quick Overview',
        description: 'See key metrics and recent recommendations',
        filters: {
          view: 'overview',
          timeframe: '30d',
        },
        isDefault: true,
      },
      {
        id: 'detailed',
        name: 'Detailed Analysis',
        description: 'Deep dive into market trends and benchmarks',
        filters: {
          view: 'detailed',
          timeframe: '90d',
        },
        isDefault: false,
      },
    ];
  },

  /**
   * Show contextual help
   */
  getContextualHelp(context: string, language: 'en' | 'fr' = 'en'): string {
    const help: Record<string, Record<string, string>> = {
      en: {
        'dashboard-empty':
          'Add your first property to see personalized market insights and pricing recommendations.',
        'no-recommendations':
          'Recommendations will appear here once we have enough market data for your property type.',
        'price-comparison':
          'Compare your current price with market benchmarks. Green indicates you\'re competitive, orange suggests adjustment opportunities.',
      },
      fr: {
        'dashboard-empty':
          'Ajoutez votre première propriété pour voir des insights de marché personnalisés et des recommandations tarifaires.',
        'no-recommendations':
          'Les recommandations apparaîtront ici une fois que nous aurons suffisamment de données de marché pour votre type de propriété.',
        'price-comparison':
          'Comparez votre prix actuel avec les références du marché. Le vert indique que vous êtes compétitif, l\'orange suggère des opportunités d\'ajustement.',
      },
    };

    return help[language][context] || '';
  },
};


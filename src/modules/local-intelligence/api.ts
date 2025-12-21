/**
 * Local Market Intelligence (Morocco-Specific) Module
 * Provides Morocco-specific events, holidays, and seasonality
 */

export interface MoroccanHoliday {
  date: string;
  name: string;
  nameFr: string;
  nameAr?: string;
  type: 'national' | 'religious' | 'cultural';
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export interface TourismSeason {
  name: string;
  nameFr: string;
  startMonth: number;
  endMonth: number;
  demandLevel: 'peak' | 'high' | 'medium' | 'low';
  description: string;
}

export interface LocalEvent {
  name: string;
  nameFr: string;
  city: string;
  startDate: string;
  endDate: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
}

export const localIntelligenceApi = {
  /**
   * Get Moroccan holidays for a year
   */
  getMoroccanHolidays(year: number): MoroccanHoliday[] {
    // Fixed date holidays
    const holidays: MoroccanHoliday[] = [
      {
        date: `${year}-01-01`,
        name: 'New Year\'s Day',
        nameFr: 'Jour de l\'An',
        type: 'national',
        impact: 'medium',
        description: 'Public holiday, moderate tourism impact',
      },
      {
        date: `${year}-01-11`,
        name: 'Independence Manifesto Day',
        nameFr: 'Manifeste de l\'Indépendance',
        type: 'national',
        impact: 'low',
        description: 'National holiday',
      },
      {
        date: `${year}-05-01`,
        name: 'Labor Day',
        nameFr: 'Fête du Travail',
        type: 'national',
        impact: 'low',
        description: 'Public holiday',
      },
      {
        date: `${year}-07-30`,
        name: 'Throne Day',
        nameFr: 'Fête du Trône',
        type: 'national',
        impact: 'medium',
        description: 'Major national celebration',
      },
      {
        date: `${year}-08-14`,
        name: 'Oued Ed-Dahab Day',
        nameFr: 'Journée de Oued Ed-Dahab',
        type: 'national',
        impact: 'low',
        description: 'Regional holiday',
      },
      {
        date: `${year}-08-20`,
        name: 'Revolution Day',
        nameFr: 'Révolution du Roi et du Peuple',
        type: 'national',
        impact: 'low',
        description: 'National holiday',
      },
      {
        date: `${year}-08-21`,
        name: 'Youth Day',
        nameFr: 'Fête de la Jeunesse',
        type: 'national',
        impact: 'low',
        description: 'National holiday',
      },
      {
        date: `${year}-11-06`,
        name: 'Green March Day',
        nameFr: 'Marche Verte',
        type: 'national',
        impact: 'low',
        description: 'National holiday',
      },
      {
        date: `${year}-11-18`,
        name: 'Independence Day',
        nameFr: 'Fête de l\'Indépendance',
        type: 'national',
        impact: 'medium',
        description: 'Major national celebration',
      },
    ];

    // Add Islamic holidays (approximate dates, vary by year)
    // Ramadan and Eid dates need to be calculated based on Islamic calendar
    // For MVP, using approximate dates
    holidays.push({
      date: `${year}-03-10`, // Approximate Eid al-Fitr
      name: 'Eid al-Fitr',
      nameFr: 'Aïd el-Fitr',
      nameAr: 'عيد الفطر',
      type: 'religious',
      impact: 'high',
      description: 'End of Ramadan, major travel period',
    });

    holidays.push({
      date: `${year}-06-16`, // Approximate Eid al-Adha
      name: 'Eid al-Adha',
      nameFr: 'Aïd el-Adha',
      nameAr: 'عيد الأضحى',
      type: 'religious',
      impact: 'high',
      description: 'Feast of Sacrifice, high tourism impact',
    });

    // Add Ramadan period (month before Eid al-Fitr)
    holidays.push({
      date: `${year}-02-10`, // Approximate Ramadan start
      name: 'Ramadan',
      nameFr: 'Ramadan',
      nameAr: 'رمضان',
      type: 'religious',
      impact: 'high',
      description: 'Holy month of fasting, affects dining and activities',
    });

    return holidays.sort((a, b) => a.date.localeCompare(b.date));
  },

  /**
   * Get tourism seasons for Morocco
   */
  getTourismSeasons(): TourismSeason[] {
    return [
      {
        name: 'Peak Season',
        nameFr: 'Haute Saison',
        startMonth: 3,
        endMonth: 5,
        demandLevel: 'peak',
        description: 'Spring months with perfect weather, highest demand',
      },
      {
        name: 'Summer High Season',
        nameFr: 'Saison Estivale',
        startMonth: 6,
        endMonth: 8,
        demandLevel: 'high',
        description: 'Summer months, warm weather, high tourism',
      },
      {
        name: 'Autumn Shoulder Season',
        nameFr: 'Saison Intermédiaire d\'Automne',
        startMonth: 9,
        endMonth: 11,
        demandLevel: 'medium',
        description: 'Moderate demand, pleasant weather',
      },
      {
        name: 'Winter Low Season',
        nameFr: 'Basse Saison d\'Hiver',
        startMonth: 12,
        endMonth: 2,
        demandLevel: 'low',
        description: 'Cooler months, lower tourism demand',
      },
    ];
  },

  /**
   * Get local events for cities
   */
  getLocalEvents(city: string, year: number): LocalEvent[] {
    const events: LocalEvent[] = [];

    if (city.toLowerCase() === 'marrakech') {
      events.push({
        name: 'Marrakech International Film Festival',
        nameFr: 'Festival International du Film de Marrakech',
        city: 'Marrakech',
        startDate: `${year}-11-29`,
        endDate: `${year}-12-07`,
        impact: 'high',
        description: 'Major cultural event, high demand for accommodations',
      });

      events.push({
        name: 'Festival of Popular Arts',
        nameFr: 'Festival des Arts Populaires',
        city: 'Marrakech',
        startDate: `${year}-06-20`,
        endDate: `${year}-06-24`,
        impact: 'medium',
        description: 'Cultural festival, moderate tourism impact',
      });
    }

    if (city.toLowerCase() === 'fes' || city.toLowerCase() === 'fès') {
      events.push({
        name: 'Fes Festival of World Sacred Music',
        nameFr: 'Festival des Musiques Sacrées du Monde',
        city: 'Fes',
        startDate: `${year}-05-24`,
        endDate: `${year}-06-01`,
        impact: 'high',
        description: 'Major international festival, peak demand period',
      });
    }

    if (city.toLowerCase() === 'essouira') {
      events.push({
        name: 'Essaouira Gnaoua Festival',
        nameFr: 'Festival Gnaoua d\'Essaouira',
        city: 'Essaouira',
        startDate: `${year}-06-27`,
        endDate: `${year}-07-01`,
        impact: 'high',
        description: 'Music festival, high accommodation demand',
      });
    }

    return events;
  },

  /**
   * Get seasonality indicator for a date
   */
  getSeasonalityForDate(date: string): {
    season: TourismSeason;
    demandLevel: string;
    recommendation: string;
  } {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1; // 1-12

    const seasons = this.getTourismSeasons();
    const season = seasons.find(
      (s) => (month >= s.startMonth && month <= s.endMonth) || (s.startMonth > s.endMonth && (month >= s.startMonth || month <= s.endMonth))
    ) || seasons[0];

    let recommendation = '';
    if (season.demandLevel === 'peak') {
      recommendation = 'Consider premium pricing during peak demand';
    } else if (season.demandLevel === 'high') {
      recommendation = 'Strong demand expected, competitive pricing recommended';
    } else if (season.demandLevel === 'medium') {
      recommendation = 'Moderate demand, standard pricing';
    } else {
      recommendation = 'Lower demand period, consider competitive pricing to maintain occupancy';
    }

    return {
      season,
      demandLevel: season.demandLevel,
      recommendation,
    };
  },

  /**
   * Check if date falls during high-impact holiday
   */
  isHighImpactHoliday(date: string, year: number): {
    isHoliday: boolean;
    holiday?: MoroccanHoliday;
  } {
    const holidays = this.getMoroccanHolidays(year);
    const holiday = holidays.find((h) => h.date === date && h.impact === 'high');

    return {
      isHoliday: !!holiday,
      holiday,
    };
  },

  /**
   * Get Ramadan impact period
   */
  getRamadanPeriod(year: number): { start: string; end: string; impact: string } {
    // Approximate dates - in production would use Islamic calendar calculations
    return {
      start: `${year}-02-10`,
      end: `${year}-03-10`,
      impact: 'Ramadan affects dining patterns and activity schedules. Many restaurants close during day, evening activities increase.',
    };
  },
};


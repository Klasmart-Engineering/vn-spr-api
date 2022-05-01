export interface Performance {
  total_students: number;
  average_performance: number;
  today_total_classes: number;
  today_activities: number;
}

export interface PerformanceScore {
  name: string;
  above: number;
  meets: number;
  below: number;
  score?: {
    above: number;
    meets: number;
    below: number;
  };
}

export interface SkillScore {
  name: string; //'Cognitive Skill' | 'Subject Matter' | 'Speech & Language' | 'Personal Development' | 'Gross Motor Skills';
  achieved: number;
  notAchieved: number;
  total: number;
  score?: {
    achieved: number;
    notAchieved: number;
    total: number;
  };
}

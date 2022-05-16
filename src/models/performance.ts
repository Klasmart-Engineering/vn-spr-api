export interface Performance {
  total_students: number;
  average_performance: number;
  today_total_classes: number;
  today_activities: number;
}

export interface PerformanceScore {
  name: string;
  above?: number;
  meets?: number;
  below?: number;
  learningOutcome?: {
    above?: number;
    meets?: number;
    below?: number;
  };
}

export interface SkillLearningOutcome {
  achieved: number;
  notAchieved: number;
  total: number;
}

export interface PerformanceSubcategories {
  name: string;
  achieved: number;
  notAchieved: number;
  total: number;
  learningOutcome?: SkillLearningOutcome;
}

export interface PerformanceSkill {
  category: string;
  subcategories: PerformanceSubcategories[];
}

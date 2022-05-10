import { UUID } from "src/types";

export interface PerformanceData {
  total_students: number;
  average_performance: number;
  today_total_classes: number;
  today_activities: number;
}
export interface ClassData {
  class_id: UUID;
  class_name: string;
  performance: PerformanceData;
}

export interface ClassesResponse {
  total: number;
  classes: Array<ClassData>;
}

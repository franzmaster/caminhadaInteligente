export type FitnessLevel = 'Iniciante' | 'Intermediário' | 'Avançado';

export interface UserData {
  height: number;
  currentWeight: number;
  weightToLose: number;
  age: number;
  level: FitnessLevel;
}

export interface WalkingPlanResponse {
  markdown: string;
}

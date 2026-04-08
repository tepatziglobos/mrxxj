export interface Subject {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Task {
  id: string;
  name: string;
  subjectId: string;
  points: number;
  completed: boolean;
  date: string; // YYYY-MM-DD
  timeSpent: number; // in seconds
}

export interface UserStats {
  totalPoints: number;
  level: number;
  title: string;
}

export type ViewType = 'today' | 'calendar' | 'subjects';

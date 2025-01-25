export interface RemoteInfo {
  base: string;
  variant: string;
  dayCount: number;
  location: string;
}

export interface Salary {
  id: string;
  company: string;
  title: string;
  location: string;
  compensation: string;
  date: string;
  level: string;
  company_xp: number | null;
  total_xp: number | null;
  remote: RemoteInfo | null;
}

export interface Score {
  id: string;
  score: number;
}

export interface Stats {
  name: string;
  count: number;
  percentage: number;
  average: number;
  median: number;
}

export interface Datas {
  totalSalaries: number;
  averageCompensation: number;
  medianCompensation: number;
  lowestSalary: number;
  highestSalary: number;
}

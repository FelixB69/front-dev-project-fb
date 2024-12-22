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

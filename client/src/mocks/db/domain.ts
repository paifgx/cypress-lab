// Domänen-Typen (rein, ohne Infrastruktur)
export type UserRole = 'applicant' | 'officer';
export type ApplicationStatus = 'submitted' | 'review' | 'approved' | 'rejected';

export interface AuthenticatedUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  token: string;
}

export interface SeedProgram {
  id: string;
  name: string;
  summary: string;
  description: string;
  amountMin: number;
  amountMax: number;
  updatedAt: string;
  tags: string[];
}

export interface SeedComment {
  id: string;
  authorRole: UserRole;
  message: string;
  createdAt: string;
}

export interface SeedApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  programId: string;
  status: ApplicationStatus;
  amount: number;
  purpose: string;
  createdAt: string;
  updatedAt: string;
  comments: SeedComment[];
}

// nur intern für Seeds
export interface SeedUserRecord extends AuthenticatedUser {
  password: string;
}

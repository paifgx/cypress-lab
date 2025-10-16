import type {
  ApplicationStatus,
  AuthenticatedUser,
  SeedApplication,
  SeedComment,
  SeedProgram,
  UserRole
} from './domain';

export function toUserRole(value: string): UserRole {
  if (value === 'applicant' || value === 'officer') return value;
  throw new Error(`Unexpected user role "${value}" in mock database`);
}

export function toApplicationStatus(value: string): ApplicationStatus {
  if (value === 'submitted' || value === 'review' || value === 'approved' || value === 'rejected') {
    return value;
  }
  throw new Error(`Unexpected application status "${value}" in mock database`);
}

export function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((t): t is string => typeof t === 'string');
}

export function toAuthenticatedUser<T extends {
  id: string; username: string; displayName: string; role: string; token: string;
}>(user: T): AuthenticatedUser {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    role: toUserRole(user.role),
    token: user.token
  };
}

export function toProgram<T extends {
  id: string; name: string; summary: string; description: string;
  amountMin: number; amountMax: number; updatedAt: string; tags: unknown;
}>(program: T): SeedProgram {
  return {
    id: program.id,
    name: program.name,
    summary: program.summary,
    description: program.description,
    amountMin: program.amountMin,
    amountMax: program.amountMax,
    updatedAt: program.updatedAt,
    tags: normalizeTags(program.tags)
  };
}

export function toComment<T extends {
  id: string; authorRole: string; message: string; createdAt: string;
}>(comment: T): SeedComment {
  return {
    id: comment.id,
    authorRole: toUserRole(comment.authorRole),
    message: comment.message,
    createdAt: comment.createdAt
  };
}

export function toApplication<T extends {
  id: string; applicantName: string; applicantEmail: string; programId: string;
  status: string; amount: number; purpose: string; createdAt: string; updatedAt: string;
  comments: unknown;
}>(application: T): SeedApplication {
  const raw = Array.isArray(application.comments) ? application.comments : [];
  return {
    id: application.id,
    applicantName: application.applicantName,
    applicantEmail: application.applicantEmail,
    programId: application.programId,
    status: toApplicationStatus(application.status),
    amount: application.amount,
    purpose: application.purpose,
    createdAt: application.createdAt,
    updatedAt: application.updatedAt,
    comments: raw.map((c) =>
      toComment(c as { id: string; authorRole: string; message: string; createdAt: string })
    )
  };
}

import { drop } from '@mswjs/data';
import { getModels, db } from './db';
import type {
  AuthenticatedUser,
  SeedApplication,
  SeedComment,
  SeedProgram
} from './domain';
import {
  DEFAULT_USERS,
  DEFAULT_PROGRAMS,
  DEFAULT_APPLICATIONS
} from './seeds';
import {
  normalizeTags,
  toApplication,
  toAuthenticatedUser,
  toProgram
} from './mappers';

function omit<T extends object, K extends keyof T>(value: T, ...keys: K[]): Omit<T, K> {
  const clone = { ...value };
  keys.forEach((key) => {
    Reflect.deleteProperty(clone, key);
  });
  return clone as Omit<T, K>;
}

export function seedDb(): void {
  drop(db);

  const { userModel, programModel, commentModel, applicationModel } = getModels();

  DEFAULT_USERS.forEach((user) => {
    userModel.create({ ...user });
  });

  DEFAULT_PROGRAMS.forEach((program) => {
    programModel.create({ ...program, tags: normalizeTags(program.tags) });
  });

  DEFAULT_APPLICATIONS.forEach((application) => {
    const commentEntities = application.comments.map((c) => commentModel.create({ ...c }));
    applicationModel.create({ ...application, comments: commentEntities });
  });
}

export function resetDb(): void {
  seedDb();
}

export function authenticateUser(username: string, password: string): AuthenticatedUser | null {
  const { userModel } = getModels();
  const record = userModel.findFirst({ where: { username: { equals: username } } }) ?? null;
  if (!record || record.password !== password) return null;
  return toAuthenticatedUser(record);
}

export function listPrograms(): SeedProgram[] {
  const { programModel } = getModels();
  return programModel
    .getAll()
    .map((p) => toProgram(p))
    .sort((a, b) => a.name.localeCompare(b.name, 'de-DE'));
}

export function listApplications(): SeedApplication[] {
  const { applicationModel } = getModels();
  return applicationModel
    .getAll()
    .map((a) => toApplication(a))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function findApplication(id: string): SeedApplication | null {
  const { applicationModel } = getModels();
  const rec = applicationModel.findFirst({ where: { id: { equals: id } } }) ?? null;
  return rec ? toApplication(rec) : null;
}

export function createApplication(
  payload: Omit<SeedApplication, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'comments'>
): SeedApplication {
  const { applicationModel } = getModels();
  const now = new Date().toISOString();

  const created = applicationModel.create({
    ...payload,
    id: crypto.randomUUID(),
    status: 'submitted',
    createdAt: now,
    updatedAt: now,
    comments: []
  });

  return toApplication(created);
}

export function updateApplication(
  id: string,
  updates: Partial<Omit<SeedApplication, 'id' | 'createdAt' | 'comments'>> & { comments?: SeedComment[] }
): SeedApplication | null {
  const { applicationModel, commentModel } = getModels();

  const record = applicationModel.findFirst({ where: { id: { equals: id } } }) ?? null;
  if (!record) return null;

  const nextComments = (updates.comments ?? toApplication(record).comments)
    .map((c) => {
      const existing = commentModel.findFirst({
        where: { id: { equals: c.id } }
      });
      if (existing) {
        return commentModel.update({
          where: { id: { equals: c.id } },
          data: { authorRole: c.authorRole, message: c.message, createdAt: c.createdAt }
        })!;
      }
      return commentModel.create({ ...c });
    });

  const updated = applicationModel.update({
    where: { id: { equals: id } },
    data: {
      ...omit(updates, 'comments'),
      comments: nextComments,
      updatedAt: new Date().toISOString()
    }
  }) ?? null;

  if (!updated) throw new Error(`Failed to update application "${id}".`);
  return toApplication(updated);
}

export function updateProgram(
  id: string,
  updates: Partial<Omit<SeedProgram, 'id' | 'updatedAt'>>,
): SeedProgram | null {
  const { programModel } = getModels();
  const record = programModel.findFirst({ where: { id: { equals: id } } }) ?? null;
  if (!record) return null;

  const updatedRecord = programModel.update({
    where: { id: { equals: id } },
    data: {
      ...updates,
      updatedAt: new Date().toISOString(),
    },
  }) ?? null;

  if (!updatedRecord) throw new Error(`Failed to update program "${id}".`);
  return toProgram(updatedRecord);
}
export function snapshot() {
  const { userModel, programModel, applicationModel } = getModels();
  return {
    users: userModel.getAll().map((u) => toAuthenticatedUser(u)),
    programs: programModel.getAll().map((p) => toProgram(p)),
    applications: applicationModel.getAll().map((a) => toApplication(a))
  };
}

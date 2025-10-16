import { factory, primaryKey, manyOf } from '@mswjs/data';

export const db = factory({
  user: {
    id: primaryKey(String),
    username: String,
    password: String,
    role: String,
    displayName: String,
    token: String
  },
  program: {
    id: primaryKey(String),
    name: String,
    summary: String,
    description: String,
    amountMin: Number,
    amountMax: Number,
    updatedAt: String,
    tags: (): string[] => []
  },
  comment: {
    id: primaryKey(String),
    authorRole: String,
    message: String,
    createdAt: String
  },
  application: {
    id: primaryKey(String),
    applicantName: String,
    applicantEmail: String,
    programId: String,
    status: String,
    amount: Number,
    purpose: String,
    createdAt: String,
    updatedAt: String,
    comments: manyOf('comment')
  }
});

export type Model<K extends keyof typeof db> = NonNullable<(typeof db)[K]>;
export type UserModel = Model<'user'>;
export type ProgramModel = Model<'program'>;
export type CommentModel = Model<'comment'>;
export type ApplicationModel = Model<'application'>;

export type EntityOf<M> = M extends { create: (...args: unknown[]) => infer R } ? R : never;
export type UserEntity = EntityOf<UserModel>;
export type ProgramEntity = EntityOf<ProgramModel>;
export type CommentEntity = EntityOf<CommentModel>;
export type ApplicationEntity = EntityOf<ApplicationModel>;

export function getModels() {
  return {
    userModel: db.user,
    programModel: db.program,
    commentModel: db.comment,
    applicationModel: db.application
  };
}

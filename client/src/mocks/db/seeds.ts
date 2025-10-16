import type { SeedApplication, SeedProgram, SeedUserRecord } from './domain';
 // @ts-expect-error: allow JS module import without type declarations
import { BASELINE_ISO, addMinutesToBaseline, users, programs, applications } from '../../../../shared/fixtures.js';

export { BASELINE_ISO, addMinutesToBaseline };
export const DEFAULT_USERS: SeedUserRecord[] = users;
export const DEFAULT_PROGRAMS: SeedProgram[] = programs;
export const DEFAULT_APPLICATIONS: SeedApplication[] = applications;

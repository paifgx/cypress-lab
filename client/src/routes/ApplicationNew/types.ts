export interface ProgramOption {
  id: string;
  name: string;
  amountMin: number;
  amountMax: number;
}

export interface ApplicationFormState {
  applicantName: string;
  applicantEmail: string;
  programId: string;
  amount: string;
  purpose: string;
}

export type FieldKey = keyof ApplicationFormState | 'file';
export type SubmitStage = 'idle' | 'upload' | 'submit';

export interface CreateApplicationPayload {
  applicantName: string;
  applicantEmail: string;
  programId: string;
  amount: number;
  purpose: string;
}

export interface CreatedApplication {
  id: string;
}
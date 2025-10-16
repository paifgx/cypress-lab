export type AppStatus = 'submitted' | 'review' | 'approved' | 'rejected';

export const statusLabelDe: Record<AppStatus, string> = {
  submitted: 'EINGEREICHT',
  review: 'IN PRÜFUNG',
  approved: 'VORLÄUFIG GENEHMIGT',
  rejected: 'ABGELEHNT',
};

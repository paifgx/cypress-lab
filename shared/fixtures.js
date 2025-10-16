export const BASELINE_ISO = '2024-01-15T09:00:00.000Z';

export function addMinutesToBaseline(minutes) {
  const date = new Date(BASELINE_ISO);
  date.setMinutes(date.getMinutes() + minutes);
  return date.toISOString();
}

export const users = [
  {
    id: 'user-alice',
    username: 'alice',
    password: 'test123',
    role: 'applicant',
    displayName: 'Alice Applicant',
    token: 'token-applicant'
  },
  {
    id: 'user-officer',
    username: 'officer',
    password: 'test123',
    role: 'officer',
    displayName: 'Olaf Officer',
    token: 'token-officer'
  }
];

export const programs = [
  {
    id: 'program-energieeffizienz',
    name: 'Energieeffizienz Wohnen',
    summary: 'Förderung energetischer Sanierungen für Wohngebäude.',
    description:
      'Unterstützt energetische Sanierungen wie Dämmung, Heizungsmodernisierung oder Solaranlagen mit zinsgünstigen Darlehen sowie Tilgungszuschüssen.',
    amountMin: 5000,
    amountMax: 150000,
    updatedAt: addMinutesToBaseline(0),
    tags: ['wohnen', 'energie', 'sanierung']
  },
  {
    id: 'program-gruendung-innovation',
    name: 'Gründung & Innovation',
    summary: 'Förderprogramm für Start-ups und innovative KMU.',
    description:
      'Finanzierung technologischer Innovationen, Beratungskosten und Markteinführung innovativer Produkte für junge Unternehmen.',
    amountMin: 10000,
    amountMax: 500000,
    updatedAt: addMinutesToBaseline(15),
    tags: ['gründung', 'innovation', 'kmu']
  },
  {
    id: 'program-soziale-infrastruktur',
    name: 'Soziale Infrastruktur',
    summary: 'Fördert den Ausbau sozialer Einrichtungen in Kommunen.',
    description:
      'Investitionskostenzuschüsse für Kitas, Schulen und Pflegeeinrichtungen mit Fokus auf Barrierefreiheit und Klimaneutralität.',
    amountMin: 10000,
    amountMax: 400000,
    updatedAt: addMinutesToBaseline(30),
    tags: ['kommunen', 'bildung', 'pflege']
  }
];

export const applications = [
  {
    id: 'application-demo-001',
    applicantName: 'Energiestadt Altstadt GmbH',
    applicantEmail: 'kontakt@altstadt-gmbh.de',
    programId: 'program-energieeffizienz',
    status: 'review',
    amount: 180000,
    purpose:
      'Energetische Sanierung eines Mehrfamilienhauses inklusive Fassadendämmung und Wärmepumpeninstallation.',
    createdAt: addMinutesToBaseline(45),
    updatedAt: addMinutesToBaseline(120),
    comments: [
      {
        id: 'comment-001',
        authorRole: 'officer',
        message:
          'Bitte Nachweis zur geplanten CO₂-Einsparung ergänzen. Aktuell keine Bewertungsgrundlage.',
        createdAt: addMinutesToBaseline(120)
      }
    ]
  }
];
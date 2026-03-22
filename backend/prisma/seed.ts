import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding ablute_ wellness constants...');

  // 1. Theme Definitions
  const themes = [
    { code: 'energy', name: 'Energia', category: 'vitality', displayOrder: 1 },
    { code: 'recovery', name: 'Recuperação', category: 'structural', displayOrder: 2 },
    { code: 'performance', name: 'Performance', category: 'functional', displayOrder: 3 },
    { code: 'hydration', name: 'Hidratação', category: 'metabolic', displayOrder: 4 },
  ];

  for (const theme of themes) {
    await prisma.themeDefinition.upsert({
      where: { code: theme.code },
      update: {},
      create: {
        ...theme,
        active: true
      },
    });
  }

  // 2. Biomarker Definitions
  const biomarkers = [
    { code: 'glucose', displayName: 'Glicose Urinária', family: 'metabolic', sampleType: 'urine', unitDefault: 'mg/dL' },
    { code: 'urea', displayName: 'Ureia', family: 'recovery', sampleType: 'urine', unitDefault: 'g/24h' },
    { code: 'creatinine', displayName: 'Creatinina', family: 'kidney', sampleType: 'urine', unitDefault: 'mg/dL' },
    { code: 'specific_gravity', displayName: 'Densidade Urinária', family: 'hydration', sampleType: 'urine', unitDefault: 'sg' },
  ];

  for (const bio of biomarkers) {
    await prisma.biomarkerDefinition.upsert({
      where: { code: bio.code },
      update: {},
      create: {
        ...bio,
        active: true,
        isUserVisible: true,
        isThemeRelevant: true
      },
    });
  }

  // 3. System Entities & Scopes
  console.log('Seeding metadata scopes...');
  // Note: These are stored as strings in the records, but we define them here for reference/validation
  const consentTypes = ['health_data_access', 'motion_data_access', 'biometric_processing'];
  const permissionScopes = ['profile:read', 'measurements:read', 'recommendations:execute'];
  const recommendationTypes = ['nutrition', 'habit', 'hydration', 'activity'];
  const stateLabels = ['fraco', 'moderado', 'bom', 'excelente'];

  // 4. Initial User (Hyper Admin)
  await prisma.user.upsert({
    where: { email: 'admin@ablute.com' },
    update: {},
    create: {
      email: 'admin@ablute.com',
      passwordHash: 'SECURE_HASH_V1',
      name: 'Ablute Hyper Admin',
      dateOfBirth: new Date('1990-01-01'),
      sex: 'other',
      country: 'PT',
      timezone: 'Europe/Lisbon',
      role: UserRole.HYPER_ADMIN,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

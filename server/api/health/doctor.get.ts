export default defineEventHandler(async (event) => {
  if (await isSetupLocked()) await needAuth(event);

  const isInfisicalAvailable = await isSecuredVaultHealthy();
  let secretNames: string[] = [];

  if (isInfisicalAvailable) {
    await (await useInfisical()).listSecrets().then((secrets) => {
      secretNames = secrets.secrets.map((secret) => secret.secretKey);
    });
  }

  console.log('Doctor check: Infisical available vars:', secretNames);

  // Check for environment variables and services
  const doctorCheck: AvvySetupDoctorCheckObject = {
    servicesHealth: {
      database: await isDatabaseHealthy(),
      storage: await isStorageHealthy(),
      securedVault: isInfisicalAvailable,
    },
    variables: {
      turnstileSecured:
        secretNames.includes('TURNSTILE_SECRET_KEY') &&
        process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY !== undefined,
      storageSecured:
        secretNames.includes('S3_ACCESS') &&
        secretNames.includes('S3_SECRET') &&
        process.env.S3_ENDPOINT !== undefined &&
        process.env.S3_BUCKET_AVATARFILES !== undefined &&
        process.env.S3_BUCKET_AVATARFILES_TEMP !== undefined,
      geishaSecured: secretNames.includes('GEISHA_SECRET'),
      discordOauthSecured:
        secretNames.includes('DISCORD_CLIENT_ID') &&
        secretNames.includes('DISCORD_CLIENT_SECRET'),
      databaseSecured: process.env.NUXT_BACKOFFICE_MONGO !== undefined,
    },
  };

  return doctorCheck;
});

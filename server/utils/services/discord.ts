export async function getDiscordSecrets() {
  const infisical = await useInfisical();
  const { secretValue: clientSecret } = await infisical.getSecret('DISCORD_CLIENT_SECRET');
  const { secretValue: clientId } = await infisical.getSecret('DISCORD_CLIENT_ID');
  return { clientId, clientSecret };
}
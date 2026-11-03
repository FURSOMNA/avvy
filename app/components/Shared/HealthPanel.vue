<script setup lang="ts">
import _ from 'lodash';

const doctorStatus = reactive<Partial<AvvySetupDoctorCheckObject>>({});
const doctorDisplayCheckList = computed(() => [
  {
    label: 'Database Connection',
    ok: doctorStatus.servicesHealth?.database,
  },
  {
    label: 'Storage Connection',
    ok: doctorStatus.servicesHealth?.storage,
  },
  {
    label: 'Infisical Connection',
    ok: doctorStatus.servicesHealth?.securedVault,
  },
  {
    label: 'Turnstile Setup',
    keys: [
      {
        name: 'TURNSTILE_SITE_KEY',
        local: true,
      },
      {
        name: 'TURNSTILE_SECRET_KEY',
        local: false,
      },
    ],
    ok: doctorStatus.variables?.turnstileSecured,
  },
  {
    label: 'Storage Setup',
    keys: [
      {
        name: 'S3_ACCESS',
        local: false,
      },
      {
        name: 'S3_SECRET',
        local: false,
      },
      {
        name: 'S3_ENDPOINT',
        local: true,
      },
      {
        name: 'S3_BUCKET_AVATARFILES',
        local: true,
      },
      {
        name: 'S3_BUCKET_AVATARFILES_TEMP',
        local: true,
      },
    ],
    ok: doctorStatus.variables?.storageSecured,
  },
  {
    label: 'Geisha Setup',
    keys: [
      {
        name: 'GEISHA_API_KEY',
        local: true,
      },
    ],
    ok: doctorStatus.variables?.geishaSecured,
  },
  {
    label: 'Discord OAuth Setup',
    keys: [
      {
        name: 'DISCORD_CLIENT_ID',
        local: false,
      },
      {
        name: 'DISCORD_CLIENT_SECRET',
        local: false,
      },
    ],
    ok: doctorStatus.variables?.discordOauthSecured,
  },
  {
    label: 'Database Setup',
    keys: [
      {
        name: 'NUXT_BACKOFFICE_MONGO',
        local: true,
      },
    ],
    ok: doctorStatus.variables?.databaseSecured,
  },
]);
const isAllOk = computed(() =>
  doctorDisplayCheckList.value.every((check) => check.ok),
);
const { data: setupDoctor } = await useAsyncData('setup-doctor', () =>
  useAPI<AvvySetupDoctorCheckObject>('/api/health/doctor'),
);
_.merge(doctorStatus, setupDoctor.value);
defineExpose({ isAllOk });
</script>

<template>
  <div class="border border-neutral-700 p-6 rounded-lg text-left">
    <ul class="space-y-1">
      <li
        v-for="check in doctorDisplayCheckList"
        :key="check.label"
        class="flex items-center justify-start gap-2"
      >
        <div class="inline-flex">
          <UIcon
            name="i-lucide-circle-check"
            v-if="check.ok"
            class="text-success-500"
          />
          <UIcon name="i-lucide-circle-x" v-else class="text-error-500" />
        </div>
        <div>
          <div>{{ check.label }}</div>
          <div class="text-sm text-neutral-400" v-if="!check.ok">
            <p>Check if the following variables are set up correctly.</p>
            <ul>
              <li
                v-for="key in check.keys"
                :key="key.name"
                class="text-sm text-neutral-400"
              >
                <code>{{ key.name }}</code>
                - {{ key.local ? 'Local Environment' : 'Infisical Vault' }}
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@reference "~/assets/global.css";

h1 {
  @apply text-3xl font-bold;
}
</style>

<script setup lang="ts">
const route = useRoute();

const { data: setupStatus } = await useAsyncData('setup-page-status', () =>
  useAPI<{ locked: boolean }>('/api/auth/setup'),
);
if (setupStatus.value?.locked) {
  await navigateTo('/', { replace: true });
}

const steps = [
  { title: 'Prepare', value: 'doctor' },
  { title: 'Account', value: 'account' },
];
const activeStep = computed(() => route.path.split('/').at(-1));

definePageMeta({
  title: 'Set up Avvy',
});
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div class="space-y-6 max-w-2xl w-full bg-neutral-800/75 border border-neutral-700/50 p-12 rounded-lg shadow-xl">
      <div class="py-2 mx-auto text-center">
        <HeaderLogo size="lg" />
      </div>
      <UStepper
        :items="steps"
        :model-value="activeStep"
        disabled
        class="w-full"
      />
      <NuxtPage />
    </div>
  </div>
</template>

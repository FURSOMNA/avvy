<script setup lang="ts">
import SharedHealthPanel from '~/components/Shared/HealthPanel.vue';

const healthPanelRef = ref<InstanceType<typeof SharedHealthPanel> | null>(null);
</script>

<template>
  <div class="text-center space-y-4">
    <h1>Welcome to Avvy!</h1>
    <p>
      This setup wizard will guide you through the initial configuration of your
      Avvy instance. Please follow the steps below to complete the setup
      process.
    </p>
    <SharedHealthPanel ref="healthPanelRef" />
    <div v-if="healthPanelRef?.isAllOk" class="text-sm text-muted">
      <ULink to="/setup/account">
        <UButton>Continue to Account Setup</UButton>
      </ULink>
    </div>
    <div v-else class="text-sm text-muted">
      <p>
        Please resolve the above issues before proceeding to the next step.
        Check your console logs for more information.
      </p>
    </div>
  </div>
</template>

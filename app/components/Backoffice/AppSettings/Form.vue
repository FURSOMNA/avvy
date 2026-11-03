<script setup lang="ts">
</script>

<template>
  <div class="rf_settingsforms">
    <BackofficeAppSettingsFormGeneral />
    <BackofficeAppSettingsFormKnowledgeBase />
    <BackofficeAppSettingsFormEmail />
    <BackofficeAppSettingsFormLegal />
    <BackofficeAppSettingsFormHealth />
  </div>
</template>

<style scoped>
@reference "~/assets/global.css";

.rf_settingsforms {
  @apply flex flex-col max-w-4xl gap-4 items-start mx-auto;
}
</style>

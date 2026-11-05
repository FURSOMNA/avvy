<script setup lang="ts">
useHead({
  link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
});
</script>

<template>
  <main id="avvy_root">
    <NuxtLoadingIndicator color="#a684ff" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </main>
</template>

<script setup lang="ts">
import { BackofficeCommissionAddSlideover } from '#components';
import { commissionsQuery } from '~/queries/commissions';

const tableSorting = ref([{ id: 'created_at', desc: true }]);
const tablePage = ref(1);
const {
  data: commissions,
  refetch: refetchCommissions,
  asyncStatus,
} = useQuery(() => commissionsQuery({
    page: tablePage.value,
    sorting: tableSorting.value[0]
      ? {
          by: tableSorting.value[0].id,
          order: tableSorting.value[0].desc ? -1 : 1,
        }
      : undefined,
  })
);
// Overlays
const overlay = useOverlay();
const addSlideoverOverlay = overlay.create(BackofficeCommissionAddSlideover);

const actions: PageAction[] = [
  {
    label: 'Refresh',
    icon: 'i-heroicons-arrow-path-16-solid',
    color: 'neutral',
    variant: 'subtle',
    action: () => refetchCommissions(),
  },
  {
    label: 'New commission',
    icon: 'i-heroicons-plus-16-solid',
    action: () => {
      addSlideoverOverlay.open();
    },
  },
];

definePageMeta({
  title: 'Commissions',
  keepalive: true
});
</script>

<template>
  <div class="space-y-4">
    <BackofficeHeaderActions :actions="actions" />
    <div>
      <div v-if="asyncStatus === 'loading'" class="space-y-4">
        <USkeleton class="w-full h-12" v-for="_ in new Array(4)" :key="_" />
      </div>
      <div v-else-if="commissions?.data.length">
        <BackofficeCommissionTable
          :commissions="commissions.data"
          v-model:sorting="tableSorting"
        />
      </div>
      <div v-else-if="commissions && !commissions.data.length">
        No commissions found!
      </div>
      <div v-if="commissions" class="flex justify-center">
        <UPagination
          v-model:page="tablePage"
          :items-per-page="50"
          :total="commissions.total"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BackofficeCommissionAddSlideover } from '#components';
import { commissionsQuery } from '~/queries/commissions';
import type { CommissionStatusType } from '~~/shared/enums/Commissions';

const tableSorting = ref([{ id: 'created_at', desc: true }]);
const tablePage = ref(1);
const filtersStatusValue = ref<CommissionStatusType[]>([]);
const {
  data: commissions,
  refetch: refetchCommissions,
  asyncStatus,
} = useQuery(() =>
  commissionsQuery({
    page: tablePage.value,
    sorting: tableSorting.value[0]
      ? {
          by: tableSorting.value[0].id,
          order: tableSorting.value[0].desc ? -1 : 1,
        }
      : undefined,
    filters: {
      status: [...filtersStatusValue.value],
    },
  }),
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
  keepalive: true,
});
</script>

<template>
  <div class="space-y-4">
    <BackofficeHeaderActions :actions="actions" />
    <BackofficeCommissionTable
      :commissions="commissions?.data ?? []"
      :loading="asyncStatus === 'loading'"
      v-model:sorting="tableSorting"
      v-model:status-filter="filtersStatusValue"
    />
    <div v-if="commissions" class="flex justify-center">
      <UPagination
        v-model:page="tablePage"
        :items-per-page="50"
        :total="commissions.total"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { BackofficeCustomerAddSlideover } from '#components';
import { customersQuery } from '~/queries/customers';

const toast = useToast();
const overlay = useOverlay();
const tableSorting = ref([{ id: 'created_at', desc: true }]);
const tablePage = ref(1);
const search = ref<Partial<CustomerFilterOptions>>({});
const {
  data: customers,
  refresh,
  asyncStatus,
  state,
} = useQuery(() =>
  customersQuery({
    page: tablePage.value,
    filters: search.value,
    sorting: tableSorting.value[0]
      ? {
          by: tableSorting.value[0].id,
          order: tableSorting.value[0].desc ? -1 : 1,
        }
      : undefined,
  }),
);

watch(state, (newState) => {
  const isError = newState.status === 'error';
  if (isError)
    toast.add({
      color: 'error',
      title: 'Failed to fetch customers',
    });
});

watch(
  tableSorting,
  () => {
    refresh();
  },
  { immediate: true, deep: true },
);

watch(
  search,
  () => {
    tablePage.value = 1;
    refresh();
  },
  { deep: true },
);

const actions: PageAction[] = [
  {
    label: 'Refresh',
    icon: 'i-heroicons-arrow-path-16-solid',
    color: 'neutral',
    variant: 'subtle',
    action: refresh,
  },
  {
    label: 'Add customer',
    icon: 'i-heroicons-plus-16-solid',
    action: () => {
      overlay
        .create(BackofficeCustomerAddSlideover, { destroyOnClose: true })
        .open();
    },
    testid: 'add-customer-button',
  },
];

definePageMeta({
  title: 'Customers',
  keepalive: true,
});
</script>

<template>
  <div class="space-y-4">
    <BackofficeHeaderActions :actions="actions" />
    <BackofficeCustomerTable
      :customers="customers?.data ?? []"
      :loading="asyncStatus === 'loading'"
      v-model:sorting="tableSorting"
      v-model:filters="search"
    />
    <div v-if="customers" class="flex justify-between">
      <span
        class="inline-flex items-center gap-1 text-sm text-muted border border-muted py-1 px-2 rounded-lg pointer-events-none"
      >
        <UIcon name="i-lucide-user-round" size="sm" />
        {{ customers.total }}
      </span>
      <div>
        <UPagination
          v-model:page="tablePage"
          :items-per-page="20"
          :total="customers.total"
        />
      </div>
    </div>
  </div>
</template>

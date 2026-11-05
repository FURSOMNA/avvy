<script setup lang="ts">
import { BackofficeCustomerAddSlideover } from '#components';
import { customersQuery } from '~/queries/customers';

const toast = useToast();
const overlay = useOverlay();
const tableSorting = ref([{ id: 'created_at', desc: true }]);
const tablePage = ref(1);
const searchInputs = reactive({ name: '', discordId: '', vrcId: '' });
const search = reactive<{
  name?: string;
  discordId?: string;
  vrcId?: string;
}>({});
const {
  data: customers,
  refresh,
  asyncStatus,
  state,
} = useQuery(() =>
  customersQuery({
    page: tablePage.value,
    filters: {
      name: search.name,
      discord_id: search.discordId,
      vrc_id: search.vrcId,
    },
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

watch(searchInputs, (inputs, _oldValue, onCleanup) => {
  const timeout = setTimeout(() => {
    search.name = inputs.name.trim() || undefined;
    search.discordId = inputs.discordId.trim() || undefined;
    search.vrcId = inputs.vrcId.trim() || undefined;
  }, 500);
  onCleanup(() => clearTimeout(timeout));
});

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
    <div class="flex flex-wrap gap-2">
      <UInput
        v-model="searchInputs.name"
        placeholder="Search name"
        icon="i-lucide-search"
        class="w-full sm:w-64"
      />
      <UInput
        v-model="searchInputs.discordId"
        placeholder="Search Discord ID"
        icon="i-lucide-search"
        class="w-full sm:w-64"
      />
      <UInput
        v-model="searchInputs.vrcId"
        placeholder="Search VRChat ID"
        icon="i-lucide-search"
        class="w-full sm:w-64"
      />
    </div>
    <div v-if="asyncStatus === 'loading'" class="space-y-4">
      <USkeleton class="w-full h-12" v-for="_ in new Array(4)" :key="_" />
    </div>
    <div v-else-if="customers?.data.length">
      <BackofficeCustomerTable
        :customers="customers.data"
        v-model:sorting="tableSorting"
      />
    </div>
    <div v-else-if="customers && !customers.data.length">
      No customers found!
    </div>
    <div v-if="customers" class="flex justify-center">
      <UPagination
        v-model:page="tablePage"
        :items-per-page="20"
        :total="customers.total"
      />
    </div>
  </div>
</template>

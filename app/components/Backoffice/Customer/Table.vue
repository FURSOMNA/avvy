<script setup lang="ts">
import type { ContextMenuItem, TableColumn, TableRow } from '@nuxt/ui';
import _ from 'lodash';
import { BackofficeCustomerEditSlideover } from '#components';

const props = defineProps<{
  customers: DeserializedCustomerListItem[];
  loading: boolean;
}>();
const sorting = defineModel<{ id: string; desc: boolean }[]>('sorting', {
  default: () => [{ id: 'created_at', desc: true }],
});
const filters = defineModel<Partial<CustomerFilterOptions>>('filters', {
  default: () => ({}),
});
const filterInputs = reactive({
  name: filters.value.name ?? '',
  discord_id: filters.value.discord_id ?? '',
  vrc_id: filters.value.vrc_id ?? '',
  has_discord_id: filters.value.has_discord_id,
  has_vrchat_id: filters.value.has_vrchat_id,
});
const computedCustomers = computed(() => props.customers);
const overlay = useOverlay();
const customerFormStore = useCustomerFormStore();
const clipboard = useClipboard();
const toast = useToast();
const contextMenuItems = ref<ContextMenuItem[]>([]);

watch(filterInputs, (inputs, _oldValue, onCleanup) => {
  const timeout = setTimeout(() => {
    filters.value = {
      name: inputs.name.trim() || undefined,
      discord_id: inputs.discord_id.trim() || undefined,
      vrc_id: inputs.vrc_id.trim() || undefined,
      has_discord_id: inputs.has_discord_id,
      has_vrchat_id: inputs.has_vrchat_id,
    };
  }, 500);
  onCleanup(() => clearTimeout(timeout));
});

function idPresenceTabs(key: 'has_discord_id' | 'has_vrchat_id') {
  return {
    value:
      filterInputs[key] === undefined
        ? 'none'
        : filterInputs[key]
          ? 'has-value'
          : 'no-value',
    onUpdate: (value: string | number) => {
      filterInputs[key] = value === 'none' ? undefined : value === 'has-value';
    },
  };
}

function handleEditCustomer(customer: DeserializedCustomerListItem) {
  _.assign(
    customerFormStore.formState,
    _.pick(customer, Object.keys(customerFormStore.schema.shape)),
  );
  customerFormStore.additionalState.id = customer._id as string;
  overlay
    .create(BackofficeCustomerEditSlideover, {
      destroyOnClose: true,
    })
    .open();
}

const columns: TableColumn<DeserializedCustomerListItem>[] = [
  {
    accessorKey: 'name',
    sortingFn: 'alphanumeric',
    header: ({ column }) =>
      filterHeader(
        sortingHeader('Name', column),
        filterInputs.name,
        (value) => (filterInputs.name = value),
        'name',
      ),
  },
  {
    accessorKey: 'discord_id',
    header: () =>
      filterHeader(
        h('span', 'Discord ID'),
        filterInputs.discord_id,
        (value) => (filterInputs.discord_id = value),
        'Discord ID',
        idPresenceTabs('has_discord_id'),
      ),
  },
  {
    accessorKey: 'vrc_id',
    header: () =>
      filterHeader(
        h('span', 'VRChat ID'),
        filterInputs.vrc_id,
        (value) => (filterInputs.vrc_id = value),
        'VRChat ID',
        idPresenceTabs('has_vrchat_id'),
      ),
  },
  {
    accessorKey: 'commission_count',
    header: 'Commissions',
  },
  {
    accessorKey: 'created_at',
    sortingFn: 'datetime',
    header: ({ column }) => sortingHeader('Created at', column),
  },
  {
    accessorKey: 'updated_at',
    sortingFn: 'datetime',
    header: ({ column }) => sortingHeader('Updated at', column),
  },
];

function onRowSelect(
  _event: Event,
  row: TableRow<DeserializedCustomerListItem>,
) {
  handleEditCustomer(row.original);
}

function onRowContextMenu(
  _event: Event,
  row: TableRow<DeserializedCustomerListItem>,
) {
  const customer = row.original;
  contextMenuItems.value = [
    {
      label: 'Copy Customer ID',
      icon: 'i-lucide-copy',
      onSelect: () => copyCustomerId('Customer', customer._id),
    },
    {
      label: 'Copy VRChat User ID',
      icon: 'i-lucide-copy',
      disabled: !customer.vrc_id,
      onSelect: () => copyCustomerId('VRChat', customer.vrc_id),
    },
    {
      label: 'Copy Discord User ID',
      icon: 'i-lucide-copy',
      disabled: !customer.discord_id,
      onSelect: () => copyCustomerId('Discord', customer.discord_id),
    },
    { type: 'separator' },
    {
      label: 'Delete',
      icon: 'i-lucide-trash-2',
      color: 'error',
      onSelect: () => customerFormStore.safeDestroy(customer._id as string),
    },
  ];
}

function copyCustomerId(provider: string, id: string | null) {
  if (!id) return;

  clipboard.copy(id);
  toast.add({
    title: `Copied ${provider} User ID to clipboard.`,
    color: 'success',
  });
}
</script>

<template>
  <UContextMenu :items="contextMenuItems" size="sm">
    <UTable
      v-model:sorting="sorting"
      :columns="columns"
      :data="computedCustomers"
      :loading="loading"
      class="flex-1"
      @select="onRowSelect"
      @contextmenu="onRowContextMenu"
    >
      <template #name-cell="{ row }">
        <div class="inline-flex items-center gap-2">
          <span v-text="row.original.name" />
          <UTooltip v-if="row.original.note" :text="row.original.note">
            <UIcon name="i-lucide-sticky-note" />
          </UTooltip>
        </div>
      </template>
      <template #discord_id-cell="{ row }">
        <span v-if="row.original.discord_id" class="text-sm font-mono">
          {{ row.original.discord_id?.slice(0, 8) }}...
        </span>
      </template>
      <template #vrc_id-cell="{ row }">
        <span v-if="row.original.vrc_id" class="text-sm font-mono">
          {{ row.original.vrc_id?.slice(0, 8) }}...
        </span>
      </template>
      <template #created_at-cell="{ row }">
        {{
          new Date(row.original.created_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        }}
      </template>
      <template #updated_at-cell="{ row }">
        {{
          new Date(row.original.updated_at).toLocaleString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })
        }}
      </template>
      <template #loading>
        <div class="space-y-3 p-4">
          <USkeleton v-for="row in 4" :key="row" class="h-8 w-full" />
        </div>
      </template>
      <template #empty>No customers found!</template>
    </UTable>
  </UContextMenu>
</template>

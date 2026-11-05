<script setup lang="ts">
import type { ContextMenuItem, TableColumn, TableRow } from '@nuxt/ui';
import _ from 'lodash';
import { BackofficeCustomerEditSlideover } from '#components';

const props = defineProps<{
  customers: DeserializedCustomer[];
}>();
const sorting = defineModel<{ id: string; desc: boolean }[]>('sorting', {
  default: () => [{ id: 'created_at', desc: true }],
});
const computedCustomers = computed(() => props.customers);
const overlay = useOverlay();
const customerFormStore = useCustomerFormStore();
const clipboard = useClipboard();
const toast = useToast();
const contextMenuItems = ref<ContextMenuItem[]>([]);

function handleEditCustomer(customer: DeserializedCustomer) {
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

const columns: TableColumn<DeserializedCustomer>[] = [
  {
    accessorKey: 'name',
    sortingFn: 'alphanumeric',
    header: ({ column }) => sortingHeader('Name', column),
  },
  {
    accessorKey: 'socials',
    header: 'Socials',
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

function onRowSelect(_event: Event, row: TableRow<DeserializedCustomer>) {
  handleEditCustomer(row.original);
}

function onRowContextMenu(_event: Event, row: TableRow<DeserializedCustomer>) {
  const customer = row.original;
  contextMenuItems.value = [
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

function copyCustomerId(provider: 'VRChat' | 'Discord', id: string | null) {
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
      <template #socials-cell="{ row }">
        <div class="flex items-center gap-3">
          <UIcon v-if="row.original.vrc_id" name="i-bi-headset-vr" size="sm" />
          <UIcon v-if="row.original.discord_id" name="i-bi-discord" size="sm" />
        </div>
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
    </UTable>
  </UContextMenu>
</template>

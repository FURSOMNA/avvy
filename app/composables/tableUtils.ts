import type { Column } from '@tanstack/table-core';
import type { VNode } from 'vue';
import { UButton, UChip, UInput, UPopover, UTabs } from '#components';

function sortingHeader<T>(label: string, column: Column<T>) {
  const isSorted = column.getIsSorted();
  return h(UButton, {
    label,
    variant: 'soft',
    color: isSorted
      ? column.getIsSorted() === 'asc'
        ? 'primary'
        : 'secondary'
      : 'neutral',
    size: 'sm',
    icon: isSorted
      ? isSorted === 'asc'
        ? 'i-lucide-arrow-up-narrow-wide'
        : 'i-lucide-arrow-down-wide-narrow'
      : 'i-lucide-arrow-up-down',
    onClick: () => column.toggleSorting(),
  });
}

function filterHeader(
  title: VNode,
  value: string,
  onUpdate: (value: string) => void,
  label: string,
  tabs?: {
    value: string;
    onUpdate: (value: string | number) => void;
  },
) {
  const isFiltered = Boolean(value.trim()) || (tabs && tabs.value !== 'none');
  return h('div', { class: 'inline-flex items-center gap-1' }, [
    title,
    h(
      UPopover,
      {},
      {
        default: () =>
          h(
            UChip,
            { show: !!isFiltered, color: 'primary', size: 'sm' },
            {
              default: () =>
                h(UButton, {
                  icon: 'i-lucide-list-filter',
                  color: 'neutral',
                  variant: !isFiltered ? 'ghost' : 'subtle',
                  size: 'sm',
                  'aria-label': `Filter by ${label}`,
                }),
            },
          ),
        content: () =>
          h('div', { class: 'w-64 space-y-3 p-2' }, [
            h(UInput, {
              modelValue: value,
              placeholder: `Filter by ${label}`,
              icon: 'i-lucide-search',
              'onUpdate:modelValue': onUpdate,
            }),
            ...(tabs
              ? [
                  h(UTabs, {
                    modelValue: tabs.value,
                    'onUpdate:modelValue': tabs.onUpdate,
                    items: [
                      { value: 'none', icon: 'i-lucide-minus' },
                      { value: 'has-value', icon: 'i-lucide-circle-check' },
                      { value: 'no-value', icon: 'i-lucide-circle-x' },
                    ],
                    content: false,
                    size: 'xs',
                    ui: { list: 'w-full' },
                    color: {
                      'none': 'neutral',
                      'has-value': 'success',
                      'no-value': 'error'
                    }[tabs.value] as 'neutral' | 'success' | 'error'
                  }),
                ]
              : []),
          ]),
      },
    ),
  ]);
}

export { filterHeader, sortingHeader };

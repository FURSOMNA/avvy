type CommissionQueryParams = {
  page?: number;
  sorting?: { by: string; order: number };
  filters?: CommissionFilterOptions;
};
type CommissionsResponse = {
  data: WithCustomer<DeserializedCommission>[];
  total: number;
};

export const commissionsQuery = defineQueryOptions(
  ({
    page = 1,
    sorting = { by: 'created_at', order: -1 },
    filters = {},
  }: CommissionQueryParams) => ({
    key: ['commissions', { page, sorting, filters }],
    query: () => {
      const queryObject = {
        page,
        sort_by: sorting.by,
        sort_order: sorting.order,
        filters: JSON.stringify(filters),
      };
      return useAPI<CommissionsResponse>('/api/admin/commissions', {
        query: queryObject,
      }).then((res) => res);
    },
    refetchOnWindowFocus: false,
    enabled: typeof document !== 'undefined',
    staleTime: 0
  }),
);

export const avatarBasesQuery = defineQueryOptions({
  key: ['avatar_bases'],
  query: () => {
    return useAPI<DeserializedAvatarBase[]>(`/api/admin/commissions/bases`);
  },
  refetchOnWindowFocus: false,
  enabled: typeof document !== 'undefined',
});

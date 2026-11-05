import _ from 'lodash';

type CustomerQueryParams = {
  filters?: Partial<CustomerFilterOptions>;
  page?: number;
  sorting?: { by: string; order: number };
};
type CustomersResponse = {
  data: DeserializedCustomerListItem[];
  total: number;
};

export const customersQuery = defineQueryOptions(
  ({
    filters = {},
    page = 1,
    sorting = { by: 'created_at', order: -1 },
  }: CustomerQueryParams) => ({
    key: ['customers', { filters, page, sorting }],
    query: () => {
      const queryObject = {
        page,
        sort_by: sorting.by,
        sort_order: sorting.order,
        filters: JSON.stringify(filters),
      };
      // Delete undefined properties from the query object with lodash
      const cleanedQueryObject = _.omitBy(
        queryObject,
        _.isUndefined || _.isNull || _.isEmpty,
      );
      return useAPI<CustomersResponse>('/api/admin/customers', {
        query: cleanedQueryObject,
      }).then((res) => res);
    },
    refetchOnWindowFocus: false,
    enabled: typeof document !== 'undefined',
  }),
);

export const customerFilterQuery = defineQueryOptions(
  ({ name, page = 1 }: { name?: string; page?: number }) => ({
    key: ['customers', { filters: { name }, page }],
    query: () => {
      const queryObject = { filters: JSON.stringify({ name }), page };
      // Delete undefined properties from the query object with lodash
      const cleanedQueryObject = _.omitBy(
        queryObject,
        _.isUndefined || _.isNull || _.isEmpty,
      );
      return useAPI<CustomersResponse>('/api/admin/customers', {
        query: cleanedQueryObject,
      }).then((res) => res);
    },
    refetchOnWindowFocus: false,
    enabled: typeof document !== 'undefined',
  }),
);

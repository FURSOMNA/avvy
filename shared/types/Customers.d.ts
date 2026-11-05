import type { ObjectId, WithId } from 'mongodb';

export type CustomerRaw = WithId<{
  id: string;
  name: string;
  vrc_id: string | null;
  note: string | null;
  discord_id: string | null;
  created_at: string;
  updated_at: string;
}>;

export type Customer = CustomerRaw;

export type CustomerInsertOptions = Omit<
  Customer,
  'created_at' | 'updated_at'
> & {
  vrc_id?: string | null;
  discord_id?: string | null;
  note?: string | null;
};

export type CustomerUpdateOptions = Partial<CustomerInsertOptions>;

export type CustomerFilterOptions = {
  name?: string;
  discord_id?: string;
  vrc_id?: string;
  note?: string;
  has_discord_id?: boolean;
  has_vrchat_id?: boolean;
};

export type DeserializedCustomer = Deserialized<WithId<Customer>>;
export type DeserializedCustomerListItem = DeserializedCustomer & {
  readonly commission_count: number;
  readonly has_discord_id: boolean;
  readonly has_vrchat_id: boolean;
};

export type WithCustomer<T> = T & { customer: Customer };
export type WithExistingCustomer<T> = T & { customer: DeserializedCustomer };
export type WithCustomerId<T> = T & { customer: string };
export type WithCustomerOId<T> = T & { customer: typeof ObjectId };

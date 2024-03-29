-- Table: public.customers
create table
  public.customers (
    id bigint generated by default as identity,
    name text not null,
    phone text not null,
    address text null,
    is_active boolean not null default true,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone not null,
    constraint customers_pkey primary key (id)
  ) tablespace pg_default;
create index if not exists customers_name on public.customers using btree (name) tablespace pg_default;

comment on table public.customers is 'Customers of shop';
comment on column public.customers.id is 'The unique identifier of customer';
comment on column public.customers.name is 'The name of customer';
comment on column public.customers.phone is 'The phone of customer';
comment on column public.customers.address is 'The address of customer';
comment on column public.customers.is_active is 'The account status of customer';
comment on column public.customers.created_at is 'Date when customer was registered';
comment on column public.customers.updated_at is 'Last date when customer was updated';

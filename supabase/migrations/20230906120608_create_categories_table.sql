-- Table: public.categories
create table
  public.categories (
    id bigint generated by default as identity,
    name text not null,
    image text not null,
    is_active boolean not null default true,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone not null,
    constraint categories_pkey primary key (id)
  ) tablespace pg_default;
create index if not exists categories_name on public.categories using btree (name) tablespace pg_default;

comment on table public.categories is 'Categories of products';
comment on column public.categories.id is 'The unique identifier of category';
comment on column public.categories.name is 'The name of category';
comment on column public.categories.image is 'The image of category';
comment on column public.categories.is_active is 'The status of category';
comment on column public.categories.created_at is 'The date when category was created';
comment on column public.categories.updated_at is 'The last date when category was updated';
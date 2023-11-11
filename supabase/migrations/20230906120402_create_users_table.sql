-- Table: public.users
create table
  public.users (
    id uuid not null,
    email text not null,
    phone text not null,
    full_name text not null,
    is_admin boolean not null default false,
    is_active boolean not null default true,
    is_client boolean not null default true,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone null,
    constraint users_pkey primary key (id),
    constraint users_id foreign key (id) references auth.users (id) on delete cascade
  ) tablespace pg_default;

create unique index users_email_key on public.users using btree (email) tablespace pg_default;
create unique index users_phone_key on public.users using btree (phone) tablespace pg_default;

comment on table public.users is 'Users of shop';
comment on column public.users.id is 'The unique identifier of user';
comment on column public.users.email is 'The email of user';
comment on column public.users.phone is 'The phone of user';
comment on column public.users.full_name is 'The user full name';
comment on column public.users.is_admin is 'Is the admin user';
comment on column public.users.is_active is 'The account status of user';
comment on column public.users.is_client is 'This user is a client';
comment on column public.users.created_at is 'Date when user join us';
comment on column public.users.updated_at is 'Last date when user was updated';

drop type if exists public.order_status;
create type public.order_status as enum ('pending', 'paid', 'delivered', 'cancelled');

-- TABLES

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

-- Table: public.coupons
create table
  public.coupons (
    id bigint generated by default as identity,
    code text not null,
    discount double precision not null,
    customer_id integer not null,
    is_active boolean not null default true,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone not null,
    constraint coupons_pkey primary key (id),
    constraint coupons_customer_id_fkey foreign key (customer_id) references customers (id) on update cascade on delete restrict
  ) tablespace pg_default;
create unique index coupons_code_key on public.coupons using btree (code) tablespace pg_default;
create index if not exists coupons_code on public.coupons using btree (code) tablespace pg_default;
comment on table public.coupons is 'Coupons for customers';
comment on column public.coupons.id is 'The unique identifier of coupon';
comment on column public.coupons.code is 'The code of coupon';
comment on column public.coupons.discount is 'The amount of discount';
comment on column public.coupons.customer_id is 'The customer who owns the coupon';
comment on column public.coupons.is_active is 'The status of coupon';
comment on column public.coupons.created_at is 'Date when coupon was generated';
comment on column public.coupons.updated_at is 'Last date when coupon was updated';

-- Table: public.orders
create table
  public.orders (
    id bigint generated by default as identity,
    name text not null,
    customer_id integer not null default 1,
    sub_total double precision not null,
    total_amount double precision not null,
    seller_id uuid not null,
    last_editor_id uuid not null,
    status public.order_status not null default 'pending',
    discount double precision not null default 0,
    coupon_code text null,
    note text null,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone not null,
    constraint orders_pkey primary key (id),
    constraint orders_customer_id_fkey foreign key (customer_id) references customers (id) on update cascade on delete restrict,
    constraint orders_coupon_code_fkey foreign key (coupon_code) references coupons (code) on update cascade on delete set null,
    constraint orders_seller_id_fkey foreign key (seller_id) references users (id) on update cascade on delete restrict,
    constraint orders_last_editor_id_fkey foreign key (last_editor_id) references users (id) on update cascade on delete restrict
  ) tablespace pg_default;

create unique index orders_name_key on public.orders using btree (name) tablespace pg_default;
create unique index orders_coupon_code_key on public.orders using btree (coupon_code) tablespace pg_default;
create index if not exists orders_name_customer_id on public.orders using btree (name, customer_id) tablespace pg_default;

comment on table public.orders is 'Orders';
comment on column public.orders.id is 'The unique identifier of order';
comment on column public.orders.name is 'Order sequence like VT230902 means VT+currentYear+currentMonth+numberOfOrderInMonth';
comment on column public.orders.customer_id is 'The customer who made the order';
comment on column public.orders.sub_total is 'Sub total amount before discount';
comment on column public.orders.total_amount is 'Total amount paid by customer';
comment on column public.orders.seller_id is 'The seller who made the order';
comment on column public.orders.last_editor_id is 'Last editor id';
comment on column public.orders.status is 'The status of order (pending, paid, delivered, cancelled)';
comment on column public.orders.discount is 'Amount of discount';
comment on column public.orders.coupon_code is 'Coupon code used';
comment on column public.orders.note is 'Some note about order';
comment on column public.orders.created_at is 'Date when order was created';
comment on column public.orders.updated_at is 'Last date when order was updated';

-- Table: public.products
create table
  public.products (
    id bigint generated by default as identity,
    name text not null,
    price double precision not null,
    profit double precision not null,
    image text not null,
    quantity integer not null default 0,
    alert_threshold integer not null default 0,
    is_active boolean not null default true,
    category_id integer not null,
    created_at timestamp without time zone not null default current_timestamp,
    updated_at timestamp without time zone not null,
    constraint products_pkey primary key (id),
    constraint products_category_id_fkey foreign key (category_id) references categories (id) on update cascade on delete restrict
  ) tablespace pg_default;

create index if not exists products_name on public.products using btree (name) tablespace pg_default;
comment on table public.products is 'Products';
comment on column public.products.id is 'The unique identifier of product';
comment on column public.products.name is 'The name of product';
comment on column public.products.price is 'Price of product';
comment on column public.products.profit is 'The profit made by selling product';
comment on column public.products.image is 'The image of product';
comment on column public.products.quantity is 'Available quantity of product';
comment on column public.products.is_active is 'The status of product';
comment on column public.products.category_id is 'The category related to product';
comment on column public.products.created_at is 'Date when product was created';
comment on column public.products.updated_at is 'Last date when product was updated';

-- Table: public.order_items
create table
  public.order_items (
    id bigint generated by default as identity,
    order_id integer not null,
    product_id integer not null,
    quantity integer not null,
    price double precision not null,
    constraint order_items_pkey primary key (id),
    constraint order_items_order_id_fkey foreign key (order_id) references orders (id) on update cascade on delete cascade,
    constraint order_items_product_id_fkey foreign key (product_id) references products (id) on update cascade on delete cascade
  ) tablespace pg_default;

create unique index order_items_order_id_product_id_key on public.order_items using btree (order_id, product_id) tablespace pg_default;
comment on table public.order_items is 'Order items';
comment on column public.order_items.id is 'The unique identifier of order item';
comment on column public.order_items.order_id is 'The order related to order item';
comment on column public.order_items.product_id is 'The product related to order item';
comment on column public.order_items.quantity is 'Quantity of product added to order';
comment on column public.order_items.price is 'Price of product at the time of order';

-- Function to create user on signup
CREATE OR REPLACE FUNCTION public.create_user_on_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    insert into public.users (id, email, full_name, phone)
    -- values (new.id, new.email, 'full_name', coalesce(new.phone, ''));
    values (new.id, new.email, NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'phone');
    return new;
end;
$function$;


-- trigger to create user after insert into auth.users
create trigger create_user_on_signup
    after insert
    on auth.users
    for each row
execute procedure public.create_user_on_signup();

-- Function to help to get statistics
CREATE OR REPLACE FUNCTION public.get_statistics(from_date date, to_date date) returns json
    language plpgsql
as
$$
DECLARE
    best_sold_products JSON[];
    best_customers     JSON[];
    daily_profit       JSON;
    orders_quantity    INTEGER;
    hourly_data        JSON;
    daily_sales        JSON;
    daily_growth       JSON;
    combined_data      JSON;
BEGIN
    SELECT ARRAY(
                   SELECT json_build_object('id', p.id, 'name', p.name, 'quantity_sold', o.sale_quantity)
                   FROM (SELECT oi.product_id,
                                sum(oi.quantity) as sale_quantity
                         FROM order_items oi
                                  JOIN orders o ON oi.order_id = o.id
                         WHERE o.created_at BETWEEN date_trunc('day', from_date) AND date_trunc('day', to_date) + interval '1 day'
                         GROUP BY oi.product_id) o
                            JOIN products p ON o.product_id = p.id
                   ORDER BY sale_quantity DESC
               )
    INTO best_sold_products;

    SELECT ARRAY(
                   SELECT json_build_object('id', c.id, 'name', c.name, 'total_spend', o.total_spend)
                   FROM (SELECT o.customer_id,
                                sum(o.total_amount) as total_spend
                         FROM orders o
                         WHERE o.created_at BETWEEN date_trunc('day', from_date) AND date_trunc('day', to_date) + interval '1 day'
                         GROUP BY o.customer_id) o
                            JOIN customers c ON o.customer_id = c.id
                   ORDER BY total_spend DESC
               )
    INTO best_customers;

    SELECT json_build_object(
                   'from_date', from_date,
                   'to_date', to_date,
                   'profit', COALESCE(SUM(p.profit * oi.quantity), 0)
               )
    INTO daily_profit
    FROM orders o
             LEFT JOIN order_items oi ON o.id = oi.order_id
             LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.created_at BETWEEN date_trunc('day', from_date) AND date_trunc('day', to_date) + interval '1 day';

    SELECT count(*)
    INTO orders_quantity
    FROM orders
    WHERE created_at BETWEEN date_trunc('day', from_date) AND date_trunc('day', to_date) + interval '1 day';

    SELECT json_agg(q)
    INTO hourly_data
    FROM (SELECT hour,
                 sum(total_amount) as total_amount
          FROM (SELECT extract(hour from created_at) as hour,
                       total_amount
                FROM orders
                WHERE created_at BETWEEN date_trunc('day', from_date) AND date_trunc('day', to_date) + interval '1 day') as daily_orders
          GROUP BY hour
          ORDER BY hour) q;

    SELECT json_agg(q)
    INTO daily_sales
    FROM (SELECT created_at::date  as day,
                 sum(total_amount) as sale_value
          FROM orders
          WHERE created_at BETWEEN date_trunc('day', to_date - interval '7 day') AND date_trunc('day', to_date) + interval '1 day'
          GROUP BY day
          ORDER BY day) q;

    SELECT json_agg(q)
    INTO daily_growth
    FROM (SELECT day,
                 sale_value,
                 lag(sale_value) over (ORDER BY day)                                                      as last_day_sale_value,
                 (sale_value - lag(sale_value) over (ORDER BY day)) / lag(sale_value) over (ORDER BY day) as ratio
          FROM (SELECT created_at::date  as day,
                       sum(total_amount) as sale_value
                FROM orders
                WHERE created_at BETWEEN date_trunc('day', to_date - interval '7 day') AND date_trunc('day', to_date) + interval '1 day'
                GROUP BY day
                ORDER BY day) as daily_sales) q;

    combined_data := json_build_object(
            'best_sold_product', best_sold_products,
            'best_customer', best_customers,
            'daily_profit', daily_profit,
            'orders_quantity', orders_quantity,
            'hourly_data', hourly_data,
            'daily_sales', daily_sales,
            'daily_growth', daily_growth
        );

    RETURN combined_data;
END;
$$;
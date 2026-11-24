-- EcoSpin Counter — Supabase schema
-- Run once: Supabase dashboard → SQL Editor → New query → paste this file → Run.
-- Tables mirror src/admin/types.ts (camelCase in the app = snake_case here).

create extension if not exists pgcrypto;

-- ---------- Stores ----------
create table if not exists stores (
  slug            text primary key,            -- 'thane' | 'kharghar'
  name            text not null,
  order_prefix    text not null unique,        -- 'TH' | 'KH'
  turnaround_days int  not null,
  closed_weekday  int  not null default 5,     -- 0=Sun … 5=Fri
  next_order_no   int  not null default 1
);

insert into stores (slug, name, order_prefix, turnaround_days) values
  ('thane', 'Thane Store', 'TH', 5),
  ('kharghar', 'Kharghar Store', 'KH', 4)
on conflict (slug) do nothing;

-- ---------- Customers ----------
create table if not exists customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null unique check (phone ~ '^[6-9][0-9]{9}$'),
  address     text not null default '',
  notes       text not null default '',
  created_at  timestamptz not null default now()
);

-- ---------- Orders ----------
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  order_no         text not null unique,
  store_slug       text not null references stores(slug),
  customer_id      uuid not null references customers(id),
  customer_name    text not null,      -- snapshot for the receipt
  customer_phone   text not null,
  customer_address text not null default '',
  pieces           int  not null,
  speed            text not null check (speed in ('regular','next','same')),
  packing          text not null check (packing in ('fold','hanger')),
  home_delivery    boolean not null default false,
  subtotal         int not null,
  express_charge   int not null default 0,
  hanger_charge    int not null default 0,
  discount         int not null default 0,
  total            int not null,
  paid             int not null default 0,
  balance          int generated always as (total - paid) stored,
  status           text not null default 'received'
                   check (status in ('received','processing','ready','delivered','cancelled')),
  note             text not null default '',
  due_date         date not null,
  delivered_at     timestamptz,
  created_at       timestamptz not null default now(),
  created_by       uuid default auth.uid()
);
create index if not exists orders_store_status_idx on orders (store_slug, status);
create index if not exists orders_customer_idx on orders (customer_id);
create index if not exists orders_due_idx on orders (due_date);

create table if not exists order_items (
  id        uuid primary key default gen_random_uuid(),
  order_id  uuid not null references orders(id) on delete cascade,
  position  int  not null,                        -- keeps receipt order & tag numbers stable
  name      text not null,
  category  text not null,
  mode      text not null check (mode in ('dc','press')),
  price     int  not null check (price >= 0),
  qty       int  not null check (qty > 0),
  note      text not null default ''
);
create index if not exists order_items_order_idx on order_items (order_id);

create table if not exists payments (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders(id) on delete cascade,
  amount     int  not null check (amount > 0),
  mode       text not null check (mode in ('cash','upi','card')),
  at         timestamptz not null default now(),
  created_by uuid default auth.uid()
);
create index if not exists payments_order_idx on payments (order_id);
create index if not exists payments_at_idx on payments (at);

create table if not exists order_status_log (
  id         bigint generated always as identity primary key,
  order_id   uuid not null references orders(id) on delete cascade,
  status     text not null,
  at         timestamptz not null default now(),
  created_by uuid default auth.uid()
);

-- Keep orders.paid in sync with payments.
create or replace function sync_order_paid() returns trigger language plpgsql as $$
begin
  update orders set paid = coalesce((select sum(amount) from payments where order_id = coalesce(new.order_id, old.order_id)), 0)
  where id = coalesce(new.order_id, old.order_id);
  return null;
end $$;
drop trigger if exists payments_sync on payments;
create trigger payments_sync after insert or update or delete on payments
  for each row execute function sync_order_paid();

-- Log every status change automatically.
create or replace function log_order_status() returns trigger language plpgsql as $$
begin
  if tg_op = 'INSERT' or new.status is distinct from old.status then
    insert into order_status_log (order_id, status) values (new.id, new.status);
  end if;
  if new.status = 'delivered' and new.delivered_at is null then
    new.delivered_at := now();
  end if;
  return new;
end $$;
drop trigger if exists orders_status_log on orders;
create trigger orders_status_log before update on orders
  for each row execute function log_order_status();

-- ---------- create_order(): one call, one transaction ----------
-- Upserts the customer, takes the next order number for the store, inserts the order,
-- its items and the advance payment. Totals are recalculated here so the browser can't fake them.
create or replace function create_order(input jsonb) returns uuid
language plpgsql security invoker as $$
declare
  v_store      stores%rowtype;
  v_customer   uuid;
  v_order      uuid;
  v_no         int;
  v_subtotal   int;
  v_pieces     int;
  v_extra      numeric;
  v_express    int;
  v_hanger     int;
  v_discount   int;
  v_total      int;
  v_due        date := current_date;
  v_added      int := 0;
  v_days       int;
  v_advance    int := coalesce((input #>> '{advance,amount}')::int, 0);
  v_hanger_pc  int := coalesce((input ->> 'hangerChargePerPiece')::int, 0);
begin
  select * into v_store from stores where slug = input ->> 'storeSlug' for update;
  if not found then raise exception 'Unknown store'; end if;

  insert into customers (name, phone, address)
  values (input #>> '{customer,name}', input #>> '{customer,phone}', coalesce(input #>> '{customer,address}', ''))
  on conflict (phone) do update
    set name = excluded.name,
        address = case when excluded.address <> '' then excluded.address else customers.address end
  returning id into v_customer;

  v_no := v_store.next_order_no;
  update stores set next_order_no = next_order_no + 1 where slug = v_store.slug;

  select coalesce(sum((i->>'price')::int * (i->>'qty')::int), 0), coalesce(sum((i->>'qty')::int), 0)
    into v_subtotal, v_pieces
  from jsonb_array_elements(input -> 'items') i;
  if v_pieces = 0 then raise exception 'Order has no items'; end if;

  v_extra   := case input ->> 'speed' when 'same' then 1 when 'next' then 0.5 else 0 end;
  v_express := round(v_subtotal * v_extra);
  v_hanger  := case when input ->> 'packing' = 'hanger' then v_pieces * v_hanger_pc else 0 end;
  v_discount := least(greatest(coalesce((input ->> 'discount')::int, 0), 0), v_subtotal + v_express + v_hanger);
  v_total   := v_subtotal + v_express + v_hanger - v_discount;

  v_days := case input ->> 'speed' when 'same' then 0 when 'next' then 1 else v_store.turnaround_days end;
  while v_added < v_days loop
    v_due := v_due + 1;
    if extract(dow from v_due) <> v_store.closed_weekday then v_added := v_added + 1; end if;
  end loop;

  insert into orders (order_no, store_slug, customer_id, customer_name, customer_phone, customer_address,
                      pieces, speed, packing, home_delivery, subtotal, express_charge, hanger_charge,
                      discount, total, note, due_date)
  values (v_store.order_prefix || '-' || lpad(v_no::text, 4, '0'), v_store.slug, v_customer,
          input #>> '{customer,name}', input #>> '{customer,phone}', coalesce(input #>> '{customer,address}', ''),
          v_pieces, input ->> 'speed', input ->> 'packing', coalesce((input ->> 'homeDelivery')::boolean, false),
          v_subtotal, v_express, v_hanger, v_discount, v_total, coalesce(input ->> 'note', ''), v_due)
  returning id into v_order;

  insert into order_status_log (order_id, status) values (v_order, 'received');

  insert into order_items (order_id, position, name, category, mode, price, qty, note)
  select v_order, ord::int, i->>'name', i->>'category', i->>'mode', (i->>'price')::int, (i->>'qty')::int, coalesce(i->>'note', '')
  from jsonb_array_elements(input -> 'items') with ordinality as t(i, ord);

  if v_advance > 0 then
    insert into payments (order_id, amount, mode)
    values (v_order, least(v_advance, v_total), input #>> '{advance,mode}');
  end if;

  return v_order;
end $$;

-- ---------- Customer summary for the Customers screen ----------
create or replace view customer_summary with (security_invoker = true) as
select c.*,
       count(o.id) filter (where o.status <> 'cancelled')                  as orders,
       coalesce(sum(o.total)   filter (where o.status <> 'cancelled'), 0)  as spent,
       coalesce(sum(o.balance) filter (where o.status <> 'cancelled'), 0)  as due,
       max(o.created_at)                                                   as last_order_at
from customers c
left join orders o on o.customer_id = c.id
group by c.id;

-- ---------- Security ----------
-- One role for now: any signed-in counter user can do everything; nobody else can read anything.
-- Create counter logins in Supabase → Authentication → Users → Add user. Turn OFF public sign-ups.
alter table stores           enable row level security;
alter table customers        enable row level security;
alter table orders           enable row level security;
alter table order_items      enable row level security;
alter table payments         enable row level security;
alter table order_status_log enable row level security;

do $$
declare t text;
begin
  foreach t in array array['stores','customers','orders','order_items','payments','order_status_log'] loop
    execute format('drop policy if exists counter_all on %I', t);
    execute format('create policy counter_all on %I for all to authenticated using (true) with check (true)', t);
  end loop;
end $$;

-- Live updates on other counters/tabs.
alter publication supabase_realtime add table orders, payments;

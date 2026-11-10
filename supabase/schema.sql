-- ==============================================================================
-- SMART SPEND AI - SUPABASE POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text default 'Smart Spender',
  avatar_url text,
  currency text default 'USD',
  monthly_income numeric(12,2) default 4500.00,
  points integer default 150,
  streak_count integer default 7,
  level integer default 2,
  telegram_chat_id text,
  telegram_alerts_enabled boolean default false,
  whatsapp_number text,
  whatsapp_alerts_enabled boolean default false,
  alert_threshold_80 boolean default true,
  alert_threshold_100 boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

create policy "Users can insert own profile" 
  on public.profiles for insert 
  with check (auth.uid() = id);

-- Trigger to auto-create profile on Supabase auth user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- 2. CATEGORIES TABLE
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(id) on delete cascade,
  name text not null,
  icon text not null default 'tag',
  color text not null default '#3b82f6',
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.categories enable row level security;

create policy "Allow read on system default categories or own categories"
  on public.categories for select
  using (is_default = true or auth.uid() = user_id);

create policy "Allow insert on own categories"
  on public.categories for insert
  with check (auth.uid() = user_id);

create policy "Allow update on own categories"
  on public.categories for update
  using (auth.uid() = user_id and is_default = false);

create policy "Allow delete on own categories"
  on public.categories for delete
  using (auth.uid() = user_id and is_default = false);


-- 3. TRANSACTIONS TABLE
create table if not exists public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  category_name text not null,
  type text not null check (type in ('expense', 'income')),
  amount numeric(12,2) not null,
  date date not null default current_date,
  description text not null,
  payment_method text default 'Credit Card',
  receipt_url text,
  raw_ocr_text text,
  ai_suggested_category text,
  is_recurring boolean default false,
  recurring_frequency text check (recurring_frequency in ('daily', 'weekly', 'monthly', 'yearly', null)),
  shared_group_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.transactions enable row level security;

create policy "Users can manage own transactions"
  on public.transactions for all
  using (auth.uid() = user_id);


-- 4. BUDGETS TABLE (With Iterative Learning Engine Fields)
create table if not exists public.budgets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete cascade,
  category_name text not null,
  month text not null, -- Format: YYYY-MM
  planned_amount numeric(12,2) not null,
  ai_recommended_amount numeric(12,2),
  learning_rate_adjustment numeric(6,2) default 0.00,
  confidence_score numeric(4,2) default 0.85,
  is_iterative_applied boolean default false,
  alert_sent_80 boolean default false,
  alert_sent_100 boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, category_name, month)
);

alter table public.budgets enable row level security;

create policy "Users can manage own budgets"
  on public.budgets for all
  using (auth.uid() = user_id);


-- 5. BUDGET LEARNING CURVE & HISTORICAL VARIANCE
create table if not exists public.budget_history_learning (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  month text not null, -- Format: YYYY-MM
  category_name text not null,
  planned numeric(12,2) not null,
  actual numeric(12,2) not null,
  variance numeric(12,2) not null,
  accuracy_score numeric(5,2) not null, -- e.g. 92.5%
  ai_insight text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.budget_history_learning enable row level security;

create policy "Users can view own budget learning history"
  on public.budget_history_learning for all
  using (auth.uid() = user_id);


-- 6. SAVINGS GOALS TABLE
create table if not exists public.savings_goals (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  target_amount numeric(12,2) not null,
  current_amount numeric(12,2) not null default 0.00,
  target_date date not null,
  icon text default 'target',
  color text default '#10b981',
  status text not null default 'active' check (status in ('active', 'completed', 'paused')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.savings_goals enable row level security;

create policy "Users can manage own savings goals"
  on public.savings_goals for all
  using (auth.uid() = user_id);


-- 7. RECURRING RULES & AUTOMATION (Detected subscriptions, recharges, bills)
create table if not exists public.recurring_rules (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  merchant_name text not null,
  estimated_amount numeric(12,2) not null,
  category_name text not null,
  frequency text default 'monthly' check (frequency in ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  due_day integer check (due_day between 1 and 31),
  auto_add boolean default false,
  is_confirmed boolean default true,
  last_detected_date date default current_date,
  next_due_date date,
  confidence_score numeric(4,2) default 0.95,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.recurring_rules enable row level security;

create policy "Users can manage own recurring rules"
  on public.recurring_rules for all
  using (auth.uid() = user_id);


-- 8. SHARED BUDGET GROUPS & MEMBERS
create table if not exists public.shared_groups (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  created_by uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.shared_group_members (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references public.shared_groups(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text default 'member' check (role in ('admin', 'member')),
  split_percentage numeric(5,2) default 50.00,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (group_id, user_id)
);

create table if not exists public.shared_expenses (
  id uuid primary key default uuid_generate_v4(),
  group_id uuid not null references public.shared_groups(id) on delete cascade,
  paid_by uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  amount numeric(12,2) not null,
  category text not null,
  split_type text default 'equal' check (split_type in ('equal', 'percentage', 'exact')),
  date date not null default current_date,
  is_settled boolean default false,
  splits jsonb not null default '[]'::jsonb, -- array of { user_id, user_name, amount, is_paid }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.shared_groups enable row level security;
alter table public.shared_group_members enable row level security;
alter table public.shared_expenses enable row level security;

create policy "Users can view groups they belong to"
  on public.shared_groups for select
  using (
    created_by = auth.uid() or 
    exists (
      select 1 from public.shared_group_members 
      where group_id = public.shared_groups.id and user_id = auth.uid()
    )
  );

create policy "Users can create groups"
  on public.shared_groups for insert
  with check (created_by = auth.uid());

create policy "Group members can view members"
  on public.shared_group_members for select
  using (
    exists (
      select 1 from public.shared_group_members m2
      where m2.group_id = public.shared_group_members.group_id and m2.user_id = auth.uid()
    ) or exists (
      select 1 from public.shared_groups g
      where g.id = public.shared_group_members.group_id and g.created_by = auth.uid()
    )
  );

create policy "Group creators can add members"
  on public.shared_group_members for insert
  with check (
    exists (
      select 1 from public.shared_groups g
      where g.id = public.shared_group_members.group_id and g.created_by = auth.uid()
    )
  );

create policy "Group members can view expenses"
  on public.shared_expenses for select
  using (
    exists (
      select 1 from public.shared_group_members m
      where m.group_id = public.shared_expenses.group_id and m.user_id = auth.uid()
    ) or exists (
      select 1 from public.shared_groups g
      where g.id = public.shared_expenses.group_id and g.created_by = auth.uid()
    )
  );

create policy "Group members can insert expenses"
  on public.shared_expenses for insert
  with check (
    paid_by = auth.uid() and (
      exists (
        select 1 from public.shared_group_members m
        where m.group_id = public.shared_expenses.group_id and m.user_id = auth.uid()
      ) or exists (
        select 1 from public.shared_groups g
        where g.id = public.shared_expenses.group_id and g.created_by = auth.uid()
      )
    )
  );

create policy "Group members can update expenses"
  on public.shared_expenses for update
  using (
    exists (
      select 1 from public.shared_group_members m
      where m.group_id = public.shared_expenses.group_id and m.user_id = auth.uid()
    ) or exists (
      select 1 from public.shared_groups g
      where g.id = public.shared_expenses.group_id and g.created_by = auth.uid()
    )
  );


-- 9. GAMIFICATION BADGES
create table if not exists public.gamification_badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  badge_key text not null,
  badge_name text not null,
  description text not null,
  icon text not null,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, badge_key)
);

alter table public.gamification_badges enable row level security;

create policy "Users can view own badges"
  on public.gamification_badges for select
  using (auth.uid() = user_id);

create policy "Users can earn badges"
  on public.gamification_badges for insert
  with check (auth.uid() = user_id);


-- 10. NOTIFICATIONS TABLE
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text default 'alert' check (type in ('alert', 'warning', 'streak', 'ai_suggestion', 'system')),
  is_read boolean default false,
  channel text default 'app' check (channel in ('app', 'telegram', 'whatsapp')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

create policy "Users can view and manage own notifications"
  on public.notifications for all
  using (auth.uid() = user_id);


-- 11. DEFAULT CATEGORIES SEED DATA
insert into public.categories (name, icon, color, is_default) values
  ('Food & Dining', 'utensils', '#f59e0b', true),
  ('Housing & Rent', 'home', '#3b82f6', true),
  ('Utilities & Bills', 'zap', '#8b5cf6', true),
  ('Transportation', 'car', '#06b6d4', true),
  ('Entertainment', 'film', '#ec4899', true),
  ('Healthcare', 'heart-pulse', '#ef4444', true),
  ('Shopping', 'shopping-bag', '#10b981', true),
  ('Investment & Savings', 'trending-up', '#6366f1', true),
  ('Education', 'book-open', '#14b8a6', true),
  ('Income & Salary', 'wallet', '#22c55e', true)
on conflict do nothing;

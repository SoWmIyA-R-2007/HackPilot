-- ============================================================
-- Hackathon Automation Tracker — Initial Schema
-- ============================================================

-- PROFILES (extends Supabase Auth users)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- HACKATHONS
create table if not exists hackathons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  location text,
  mode text check (mode in ('online','offline','hybrid')),
  domain text,
  ps_id text,
  ps_description text,
  website_link text,
  registration_deadline timestamptz,
  submission_deadline timestamptz,
  shortlisting_date timestamptz,
  final_presentation_date timestamptz,
  priority text check (priority in ('high','medium','low')) default 'medium',
  status text check (status in ('not_started','in_progress','submitted','completed')) default 'not_started',
  progress_percent int default 0,
  google_calendar_event_id text,
  created_at timestamptz default now()
);

-- TEAMS
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade not null,
  team_name text not null
);

-- TEAM MEMBERS
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams(id) on delete cascade not null,
  user_id uuid references profiles(id),
  role text check (role in ('leader','member')) default 'member',
  invited_email text,
  joined_at timestamptz default now()
);

-- TASKS
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade not null,
  task_name text not null,
  status text check (status in ('pending','in_progress','done')) default 'pending',
  weight int default 1,
  assigned_to uuid references profiles(id),
  order_index int default 0,
  created_at timestamptz default now()
);

-- NOTIFICATIONS
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  hackathon_id uuid references hackathons(id) on delete set null,
  type text check (type in ('early','important','urgent','final','custom')),
  channel text check (channel in ('email','in_app','both')) default 'both',
  message text,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- REMINDER RULES
create table if not exists reminder_rules (
  id uuid primary key default gen_random_uuid(),
  hackathon_id uuid references hackathons(id) on delete cascade not null,
  days_before int not null,
  label text
);

-- Indexes for performance
create index if not exists idx_hackathons_owner on hackathons(owner_id);
create index if not exists idx_hackathons_status on hackathons(status);
create index if not exists idx_teams_hackathon on teams(hackathon_id);
create index if not exists idx_team_members_team on team_members(team_id);
create index if not exists idx_team_members_user on team_members(user_id);
create index if not exists idx_tasks_hackathon on tasks(hackathon_id);
create index if not exists idx_tasks_assigned on tasks(assigned_to);
create index if not exists idx_notifications_user on notifications(user_id);
create index if not exists idx_notifications_hackathon on notifications(hackathon_id);
create index if not exists idx_reminder_rules_hackathon on reminder_rules(hackathon_id);

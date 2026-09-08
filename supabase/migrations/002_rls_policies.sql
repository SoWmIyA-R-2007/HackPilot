-- ============================================================
-- Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table hackathons enable row level security;
alter table teams enable row level security;
alter table team_members enable row level security;
alter table tasks enable row level security;
alter table notifications enable row level security;
alter table reminder_rules enable row level security;

-- PROFILES: users can read any profile, update only their own
create policy "Profiles are viewable by everyone" on profiles
  for select using (true);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- HACKATHONS: owner or team member can see; owner can modify
create policy "Hackathons viewable by owner or team member" on hackathons
  for select using (
    owner_id = auth.uid()
    or exists (
      select 1 from teams t
      join team_members tm on tm.team_id = t.id
      where t.hackathon_id = hackathons.id
      and tm.user_id = auth.uid()
    )
  );

create policy "Hackathons insertable by authenticated users" on hackathons
  for insert with check (owner_id = auth.uid());

create policy "Hackathons updatable by owner" on hackathons
  for update using (owner_id = auth.uid());

create policy "Hackathons deletable by owner" on hackathons
  for delete using (owner_id = auth.uid());

-- TEAMS: visible to hackathon owner or team members
create policy "Teams viewable by related users" on teams
  for select using (
    exists (
      select 1 from hackathons h where h.id = teams.hackathon_id
      and (h.owner_id = auth.uid()
        or exists (
          select 1 from team_members tm where tm.team_id = teams.id and tm.user_id = auth.uid()
        ))
    )
  );

create policy "Teams insertable by hackathon owner" on teams
  for insert with check (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

create policy "Teams updatable by hackathon owner" on teams
  for update using (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

create policy "Teams deletable by hackathon owner" on teams
  for delete using (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

-- TEAM MEMBERS: visible to team members and hackathon owner
create policy "Team members viewable by related users" on team_members
  for select using (
    user_id = auth.uid()
    or exists (
      select 1 from teams t
      join hackathons h on h.id = t.hackathon_id
      where t.id = team_members.team_id
      and h.owner_id = auth.uid()
    )
  );

create policy "Team members insertable by hackathon owner or leader" on team_members
  for insert with check (
    exists (
      select 1 from teams t
      join hackathons h on h.id = t.hackathon_id
      where t.id = team_id
      and h.owner_id = auth.uid()
    )
  );

create policy "Team members deletable by hackathon owner" on team_members
  for delete using (
    exists (
      select 1 from teams t
      join hackathons h on h.id = t.hackathon_id
      where t.id = team_members.team_id
      and h.owner_id = auth.uid()
    )
  );

-- TASKS: accessible by hackathon owner or team members
create policy "Tasks viewable by related users" on tasks
  for select using (
    exists (
      select 1 from hackathons h where h.id = tasks.hackathon_id
      and (h.owner_id = auth.uid()
        or exists (
          select 1 from teams t
          join team_members tm on tm.team_id = t.id
          where t.hackathon_id = h.id and tm.user_id = auth.uid()
        ))
    )
  );

create policy "Tasks insertable by hackathon owner" on tasks
  for insert with check (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

create policy "Tasks updatable by hackathon owner or assignee" on tasks
  for update using (
    assigned_to = auth.uid()
    or exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

create policy "Tasks deletable by hackathon owner" on tasks
  for delete using (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

-- NOTIFICATIONS: users can only see their own
create policy "Notifications viewable by recipient" on notifications
  for select using (user_id = auth.uid());

create policy "Notifications updatable by recipient" on notifications
  for update using (user_id = auth.uid());

-- REMINDER RULES: accessible by hackathon owner
create policy "Reminder rules viewable by hackathon owner" on reminder_rules
  for select using (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

create policy "Reminder rules insertable by hackathon owner" on reminder_rules
  for insert with check (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

create policy "Reminder rules updatable by hackathon owner" on reminder_rules
  for update using (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

create policy "Reminder rules deletable by hackathon owner" on reminder_rules
  for delete using (
    exists (select 1 from hackathons h where h.id = hackathon_id and h.owner_id = auth.uid())
  );

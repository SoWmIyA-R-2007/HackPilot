-- ============================================================
-- Database Functions & Triggers
-- ============================================================

-- Function to recalculate hackathon progress from tasks
create or replace function public.update_hackathon_progress()
returns trigger as $$
declare
  v_hackathon_id uuid;
  v_total_weight int;
  v_completed_weight int;
  v_progress int;
begin
  -- Get the hackathon_id from the affected row
  if TG_OP = 'DELETE' then
    v_hackathon_id := OLD.hackathon_id;
  else
    v_hackathon_id := NEW.hackathon_id;
  end if;

  -- Calculate weighted progress
  select
    coalesce(sum(weight), 0),
    coalesce(sum(case when status = 'done' then weight else 0 end), 0)
  into v_total_weight, v_completed_weight
  from tasks
  where hackathon_id = v_hackathon_id;

  -- Compute percentage
  if v_total_weight > 0 then
    v_progress := round((v_completed_weight::numeric / v_total_weight::numeric) * 100);
  else
    v_progress := 0;
  end if;

  -- Update the hackathon
  update hackathons
  set progress_percent = v_progress
  where id = v_hackathon_id;

  if TG_OP = 'DELETE' then
    return OLD;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

-- Trigger on task changes
create or replace trigger on_task_change
  after insert or update or delete on tasks
  for each row execute procedure public.update_hackathon_progress();

-- Function to auto-create default reminder rules for a new hackathon
create or replace function public.create_default_reminder_rules()
returns trigger as $$
begin
  insert into reminder_rules (hackathon_id, days_before, label) values
    (NEW.id, 7, 'Early'),
    (NEW.id, 3, 'Important'),
    (NEW.id, 1, 'Urgent'),
    (NEW.id, 0, 'Final');
  return NEW;
end;
$$ language plpgsql security definer;

create or replace trigger on_hackathon_created
  after insert on hackathons
  for each row execute procedure public.create_default_reminder_rules();

// Database types for Supabase — matches the schema in supabase/migrations/001_initial_schema.sql

export type HackathonStatus = 'not_started' | 'in_progress' | 'submitted' | 'completed';
export type HackathonPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'done';
export type TeamRole = 'leader' | 'member';
export type NotificationType = 'early' | 'important' | 'urgent' | 'final' | 'custom';
export type NotificationChannel = 'email' | 'in_app' | 'both';
export type HackathonMode = 'online' | 'offline' | 'hybrid';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Hackathon {
  id: string;
  owner_id: string;
  name: string;
  location: string | null;
  mode: HackathonMode | null;
  domain: string | null;
  ps_id: string | null;
  ps_description: string | null;
  website_link: string | null;
  registration_deadline: string | null;
  submission_deadline: string | null;
  shortlisting_date: string | null;
  final_presentation_date: string | null;
  priority: HackathonPriority;
  status: HackathonStatus;
  progress_percent: number;
  google_calendar_event_id: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  hackathon_id: string;
  team_name: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string | null;
  role: TeamRole;
  invited_email: string | null;
  joined_at: string;
  // Joined profile data
  profile?: Profile;
}

export interface Task {
  id: string;
  hackathon_id: string;
  task_name: string;
  status: TaskStatus;
  weight: number;
  assigned_to: string | null;
  order_index: number;
  created_at: string;
  // Joined profile data
  assignee?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  hackathon_id: string | null;
  type: NotificationType;
  channel: NotificationChannel;
  message: string | null;
  sent_at: string | null;
  read_at: string | null;
  created_at: string;
  // Joined data
  hackathon?: Hackathon;
}

export interface ReminderRule {
  id: string;
  hackathon_id: string;
  days_before: number;
  label: string | null;
}

// Convenience types for the UI (combining DB relations)
export interface HackathonWithRelations extends Hackathon {
  team?: Team & { members: (TeamMember & { profile?: Profile })[] };
  tasks: Task[];
  reminder_rules: ReminderRule[];
}

// Client-side view model (used by components, mapped from DB types)
export interface HackathonView {
  id: string;
  code: string;
  title: string;
  teamName: string;
  domain: string;
  psId: string;
  problemStatement: string;
  status: HackathonStatus;
  priority: HackathonPriority;
  completion: number;
  timeRemaining: string;
  kickoffDate: string;
  submissionDeadline: string | null;
  bannerImage: string;
  mode: HackathonMode | null;
  websiteLink: string | null;
  operatives: OperativeView[];
  tasks: TaskView[];
  notifications: NotificationView[];
  rules: RuleView[];
}

export interface OperativeView {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface TaskView {
  id: string;
  title: string;
  completed: boolean;
  weight: number;
  assigneeName: string;
  assigneeAvatar: string;
}

export interface NotificationView {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  type: 'email' | 'system' | 'alert';
}

export interface RuleView {
  id: string;
  timeframe: string;
  description: string;
  active: boolean;
}

export interface MissionAlert {
  id: string;
  dayGroup: 'Day 01' | 'Day 00' | 'Past';
  type: 'urgent' | 'team' | 'system';
  time: string;
  title: string;
  description: string;
  unread: boolean;
  hackathonId?: string;
  targetOperatives?: string[];
  suggestedSubject?: string;
  suggestedBody?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'info';
  title: string;
  message: string;
}

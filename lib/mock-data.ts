import { HackathonView, MissionAlert } from './types';

export const INITIAL_MOCK_HACKATHONS: HackathonView[] = [
  {
    id: 'hck-1',
    code: '#HCK-9021',
    title: 'AI Innovators Global Hackathon 2026',
    teamName: 'CyberSpectres',
    domain: 'Artificial Intelligence & Agents',
    psId: 'PS-AI-04',
    problemStatement:
      'Build an autonomous agentic framework that streamlines multi-step developer workflows, automates code review, and deploys verified fixes.',
    status: 'in_progress',
    priority: 'high',
    completion: 65,
    timeRemaining: '4 DAYS',
    kickoffDate: '2026-08-20T09:00:00Z',
    submissionDeadline: '2026-09-01T23:59:00Z',
    bannerImage:
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    mode: 'online',
    websiteLink: 'https://ai-innovators-2026.devpost.com',
    operatives: [
      {
        id: 'op-1',
        name: 'Alex Vance',
        email: 'alex.vance@hacktrack.dev',
        role: 'Team Lead / Full Stack',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 'op-2',
        name: 'Sowmiya R',
        email: 'sowmiya@hacktrack.dev',
        role: 'Backend & DB Architect',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 'op-3',
        name: 'Devon Miles',
        email: 'devon@hacktrack.dev',
        role: 'AI / Prompt Engineer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      },
    ],
    tasks: [
      {
        id: 't-1',
        title: 'Draft System Architecture & High-Level Design Doc',
        completed: true,
        weight: 1,
        assigneeName: 'Alex Vance',
        assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 't-2',
        title: 'Configure Supabase Schema, Migrations & RLS Policies',
        completed: true,
        weight: 2,
        assigneeName: 'Sowmiya R',
        assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 't-3',
        title: 'Implement Multi-Agent Orchestrator Loop in Python',
        completed: true,
        weight: 3,
        assigneeName: 'Devon Miles',
        assigneeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 't-4',
        title: 'Build Neo-Brutalist Dashboard UI & Mission Control',
        completed: false,
        weight: 2,
        assigneeName: 'Alex Vance',
        assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 't-5',
        title: 'Record 3-Minute Demo Video & Draft Pitch Deck',
        completed: false,
        weight: 3,
        assigneeName: 'Sowmiya R',
        assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      },
    ],
    notifications: [
      {
        id: 'n-1',
        timestamp: '2026-08-27 18:30',
        title: 'Phase 2 Database Schema Deployed',
        description: 'Supabase tables and RLS security policies successfully pushed.',
        type: 'system',
      },
      {
        id: 'n-2',
        timestamp: '2026-08-26 10:00',
        title: 'Submission Reminder Dispatched',
        description: 'Email sent to team: 5 days remaining until final project cutoff.',
        type: 'email',
      },
    ],
    rules: [
      {
        id: 'r-1',
        timeframe: '7 Days Before',
        description: 'Send early reminder email to team lead and members.',
        active: true,
      },
      {
        id: 'r-2',
        timeframe: '24 Hours Before',
        description: 'Send urgent alert for submission URL & video check.',
        active: true,
      },
      {
        id: 'r-3',
        timeframe: '2 Hours Before',
        description: 'Final emergency ping across all communication channels.',
        active: true,
      },
    ],
  },
  {
    id: 'hck-2',
    code: '#HCK-4410',
    title: 'Web3 & CyberOps Security Summit',
    teamName: 'ZeroDay Protocol',
    domain: 'Cybersecurity & Smart Contracts',
    psId: 'PS-SEC-12',
    problemStatement:
      'Develop a automated vulnerability scanner for decentralized smart contracts that flags potential re-entrancy vectors in real time.',
    status: 'in_progress',
    priority: 'medium',
    completion: 40,
    timeRemaining: '12 DAYS',
    kickoffDate: '2026-08-22T10:00:00Z',
    submissionDeadline: '2026-09-09T20:00:00Z',
    bannerImage:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    mode: 'hybrid',
    websiteLink: 'https://cyberops-hackathon.org',
    operatives: [
      {
        id: 'op-1',
        name: 'Alex Vance',
        email: 'alex.vance@hacktrack.dev',
        role: 'Team Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 'op-4',
        name: 'Kavya Sharma',
        email: 'kavya@hacktrack.dev',
        role: 'Security Researcher',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      },
    ],
    tasks: [
      {
        id: 't-201',
        title: 'Static Analysis Parser Engine for Solidity',
        completed: true,
        weight: 3,
        assigneeName: 'Kavya Sharma',
        assigneeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 't-202',
        title: 'Real-time WebSocket Alert Feed Component',
        completed: false,
        weight: 2,
        assigneeName: 'Alex Vance',
        assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 't-203',
        title: 'Benchmarking & Test Case Suite against Ethernaut',
        completed: false,
        weight: 2,
        assigneeName: 'Kavya Sharma',
        assigneeAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
      },
    ],
    notifications: [
      {
        id: 'n-201',
        timestamp: '2026-08-25 14:20',
        title: 'Team Operative Joined',
        description: 'Kavya Sharma accepted invite to ZeroDay Protocol team.',
        type: 'system',
      },
    ],
    rules: [
      {
        id: 'r-201',
        timeframe: '3 Days Before',
        description: 'Send milestone status check-in.',
        active: true,
      },
    ],
  },
  {
    id: 'hck-3',
    code: '#HCK-1189',
    title: 'ClimateTech & Sustainability Challenge',
    teamName: 'EcoPulse',
    domain: 'Clean Energy & Green Tech',
    psId: 'PS-ECO-01',
    problemStatement:
      'Build an IoT sensor telemetry platform forecasting urban carbon offset scores using predictive ML models.',
    status: 'completed',
    priority: 'low',
    completion: 100,
    timeRemaining: 'COMPLETED',
    kickoffDate: '2026-08-01T08:00:00Z',
    submissionDeadline: '2026-08-15T18:00:00Z',
    bannerImage:
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    mode: 'offline',
    websiteLink: 'https://climatetech-2026.com',
    operatives: [
      {
        id: 'op-1',
        name: 'Alex Vance',
        email: 'alex.vance@hacktrack.dev',
        role: 'Team Lead',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 'op-2',
        name: 'Sowmiya R',
        email: 'sowmiya@hacktrack.dev',
        role: 'Data Scientist',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      },
    ],
    tasks: [
      {
        id: 't-301',
        title: 'Sensor Data Ingestion Pipeline',
        completed: true,
        weight: 2,
        assigneeName: 'Alex Vance',
        assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 't-302',
        title: 'Carbon Score Machine Learning Model',
        completed: true,
        weight: 3,
        assigneeName: 'Sowmiya R',
        assigneeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      },
      {
        id: 't-303',
        title: 'Final Presentation & Jury Pitch Submitted',
        completed: true,
        weight: 3,
        assigneeName: 'Alex Vance',
        assigneeAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      },
    ],
    notifications: [
      {
        id: 'n-301',
        timestamp: '2026-08-15 17:45',
        title: 'Project Submission Verified',
        description: 'Submission confirmation #ECO-9921 received from jury portal.',
        type: 'alert',
      },
    ],
    rules: [],
  },
];

export const INITIAL_MISSION_ALERTS: MissionAlert[] = [
  {
    id: 'alt-1',
    dayGroup: 'Day 01',
    type: 'urgent',
    time: '10 MINS AGO',
    title: 'CRITICAL: Submission Window Closing Soon',
    description: 'AI Innovators 2026 submission deadline is approaching in 4 days. 2 high-weight tasks remain pending.',
    unread: true,
    hackathonId: 'hck-1',
    targetOperatives: ['Alex Vance', 'Sowmiya R', 'Devon Miles'],
    suggestedSubject: '[URGENT] AI Innovators 2026 — Task Checklist & Demo Video Check',
    suggestedBody: 'Team,\n\nWe have 4 days remaining before the final submission deadline for AI Innovators 2026.\n\nPlease review your assigned tasks on Mission Control and record the video walkthrough by tomorrow.\n\nBest,\nMission Control',
  },
  {
    id: 'alt-2',
    dayGroup: 'Day 01',
    type: 'team',
    time: '2 HOURS AGO',
    title: 'OPERATIVE DISPATCH: Task Weight Completed',
    description: 'Devon Miles completed high-weight task: "Implement Multi-Agent Orchestrator Loop". Completion score updated to 65%.',
    unread: true,
    hackathonId: 'hck-1',
  },
  {
    id: 'alt-3',
    dayGroup: 'Day 00',
    type: 'system',
    time: 'YESTERDAY',
    title: 'SYSTEM DISPATCH: Supabase Auth & RLS Online',
    description: 'Phase 2 Supabase authentication, database triggers, and security policies successfully synchronized.',
    unread: false,
  },
];

const STORAGE_KEY = 'hacktrack_hackathons_v1';

export function getStoredHackathons(): HackathonView[] {
  if (typeof window === 'undefined') return INITIAL_MOCK_HACKATHONS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return INITIAL_MOCK_HACKATHONS;
}

export function saveStoredHackathons(hackathons: HackathonView[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hackathons));
  } catch {
    // Ignore storage write errors
  }
}

export function getHackathonById(id: string): HackathonView | undefined {
  const list = getStoredHackathons();
  return list.find((h) => h.id === id);
}


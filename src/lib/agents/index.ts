export { aria } from './aria';
export { samir } from './samir';
export { maya } from './maya';
export { omar } from './omar';
export { karim } from './karim';
export { lina } from './lina';
export { nadia } from './nadia';
export { rafi } from './rafi';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  languages: string[];
  execute: (context: AgentContext) => Promise<AgentResult>;
}

export interface AgentContext {
  leadId?: string;
  leadName?: string;
  leadEmail?: string;
  leadPhone?: string;
  leadCompany?: string;
  leadMessage?: string;
  locale?: 'en' | 'ar' | 'ru';
  plan?: string;
  data?: Record<string, any>;
}

export interface AgentResult {
  success: boolean;
  action: string;
  message?: string;
  data?: Record<string, any>;
}

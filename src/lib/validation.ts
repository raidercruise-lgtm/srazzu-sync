import { z } from 'zod';

export const demoRequestSchema = z.object({
  full_name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional().refine(
    (val) => !val || /^\+[1-9]\d{1,14}$/.test(val),
    { message: 'Phone must be in E.164 format (e.g., +971501234567)' }
  ),
  team_size: z.string().optional(),
  message: z.string().max(1000).optional(),
  locale: z.enum(['en', 'ar', 'ru']).default('en'),
});

export type DemoRequest = z.infer<typeof demoRequestSchema>;

export function validateDemoRequest(data: unknown) {
  return demoRequestSchema.safeParse(data);
}

export const leadUpdateSchema = z.object({
  full_name: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  company: z.string().max(100).optional(),
  phone: z.string().max(20).optional().refine(
    (val) => !val || /^\+[1-9]\d{1,14}$/.test(val),
    { message: 'Phone must be in E.164 format' }
  ),
  team_size: z.string().optional(),
  message: z.string().max(1000).optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'closed']).optional(),
  locale: z.enum(['en', 'ar', 'ru']).optional(),
});

export type LeadUpdate = z.infer<typeof leadUpdateSchema>;

export function validateLeadUpdate(data: unknown) {
  return leadUpdateSchema.safeParse(data);
}

export const voiceCallSchema = z.object({
  lead_id: z.string().uuid(),
  phone: z.string().min(1, 'Phone number is required'),
  language: z.enum(['en', 'ar', 'ru']).default('en'),
  agent_id: z.string().optional(),
});

export type VoiceCallRequest = z.infer<typeof voiceCallSchema>;

export function validateVoiceCall(data: unknown) {
  return voiceCallSchema.safeParse(data);
}

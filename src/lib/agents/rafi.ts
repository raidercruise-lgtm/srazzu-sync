import { Agent, AgentContext, AgentResult } from './index';
import { start_outbound_call } from '../voice';

export const rafi: Agent = {
  id: 'rafi',
  name: 'Rafi',
  role: 'Voice Caller',
  description: 'Handles outbound voice calls for qualified leads (Pro plan only)',
  languages: ['en', 'ar', 'ru'],

  async execute(context: AgentContext): Promise<AgentResult> {
    const { leadPhone, locale = 'en' } = context;

    if (!leadPhone) {
      return {
        success: false,
        action: 'no_phone',
        message: 'No phone number available for this lead',
      };
    }

    try {
      // Make outbound voice call via Vapi
      const callResult = await start_outbound_call({
        phoneNumber: leadPhone,
        language: locale,
      });

      if (callResult.success) {
        return {
          success: true,
          action: 'voice_call_initiated',
          message: `Voice call initiated to ${leadPhone}`,
          data: {
            callId: callResult.callId,
            voiceCallId: callResult.voiceCallId,
            mock: callResult.mock || false,
          },
        };
      } else {
        return {
          success: false,
          action: 'voice_call_failed',
          message: callResult.error || 'Failed to initiate voice call',
        };
      }

    } catch (error) {
      console.error('[Rafi] Voice call error:', error);
      return { success: false, action: 'voice_call_failed', message: (error as Error).message };
    }
  },
};
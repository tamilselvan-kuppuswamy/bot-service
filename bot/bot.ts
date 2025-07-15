// File: bot/bot.ts
import { ActivityHandler, TurnContext } from 'botbuilder';
import { conversationState, userStateAccessor } from '../state/storage';
import { processMessage } from '../services/technical/processMessage';
import { Messages } from '../utils/messages';

export class CustomVoiceBot extends ActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context: TurnContext, next) => {
      const userText = context.activity.text;
      const userId = context.activity.from.id;
      const conversationId = context.activity.conversation?.id;

      if (!userText?.trim()) {
        await context.sendActivity('Sorry, I could not hear anything.');
        return await next();
      }

      try {
        const { textReply } = await processMessage(userId, userText, conversationId);
        await context.sendActivity(textReply);
        await conversationState.saveChanges(context);
      } catch (err: any) {
        console.error('[Bot] Error in onMessage:', err);
        await context.sendActivity('Oops, something went wrong.');
      }

      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded ?? [];

      for (const member of membersAdded) {
        if (member.id !== context.activity.recipient.id) {
          await context.sendActivity(Messages.Welcome);
        }
      }

      await next();
    });
  }
}

export const bot = new CustomVoiceBot();

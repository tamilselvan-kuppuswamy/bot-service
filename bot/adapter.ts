// File: bot/adapter.ts
import {
  CloudAdapter,
  ConfigurationBotFrameworkAuthentication,
  ConfigurationServiceClientCredentialFactory
} from 'botbuilder';

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
  MicrosoftAppId: process.env.MICROSOFT_APP_ID || '',
  MicrosoftAppPassword: process.env.MICROSOFT_APP_PASSWORD || '',
  MicrosoftAppType:'MultiTenant'
});

const botFrameworkAuth = new ConfigurationBotFrameworkAuthentication({}, credentialsFactory);

export const adapter = new CloudAdapter(botFrameworkAuth);

adapter.onTurnError = async (context, error) => {
  console.error(`[onTurnError] Unhandled error: ${error.message}`);
  await context.sendActivity('The bot encountered an unexpected error. Please try again later.');
};

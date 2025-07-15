import * as Technical from '.';
import * as Business from '../business';
import { conversationState, userStateAccessor } from '../../state/storage';
import { Messages } from '../../utils/messages';
import { isYes, isNo } from '../../utils/confirmationUtils';
import { stripEmojis } from '../../utils/ttsUtils';
import { logInfo, logError } from '../../utils/logger';

export async function processMessage(
  userId: string,
  userText: string,
  conversationId: string
): Promise<{ textReply: string; audioReply: string | Buffer }> {
  const dummyContext = {
    activity: {
      type: 'message',
      text: userText,
      from: { id: userId },
      channelId: 'custom-channel',
      conversation: { id: conversationId || `conv-${userId}` }
    },
    sendActivity: async () => {},
    turnState: new Map()
  };
  dummyContext.turnState.set(conversationState, conversationState);

  const userState = await userStateAccessor.get(dummyContext as any, () => ({
    lastIntent: null,
    lastEntities: {},
    missingFields: [],
    awaitingConfirmation: false
  }));

  logInfo('User message received', { userId, text: userText });

  // 🔄 Step 1: Confirmation Handling
  if (userState.awaitingConfirmation) {
    const confirm = await Technical.detectIntent(userText);
    const confirmation = userText.trim().toLowerCase();
    let textReply = '';

    const isConfirmed = confirm.intent === 'ConfirmIntent' || isYes(confirmation);
    const isCancelled = confirm.intent === 'CancelIntent' || isNo(confirmation);

    if (isConfirmed) {
      switch (userState.lastIntent) {
        case 'CreateShipment': {
          const result = await Business.createShipment(userState.lastEntities);
          textReply = `✅ Shipment created.\nTracking #: ${result.trackingNumber}`;
          break;
        }
        case 'ReturnShipment': {
          const result = await Business.returnShipment(
            userState.lastEntities.orderId,
            userState.lastEntities.reason
          );
          textReply = `🔁 Return created for ${result.orderId} at ${result.timestamp}`;
          break;
        }
        case 'RescheduleDelivery': {
          const result = await Business.rescheduleDelivery(
            userState.lastEntities.shipmentId,
            userState.lastEntities.newDate
          );
          textReply = `📅 Delivery rescheduled: ${result.trackingNumber}`;
          break;
        }
        case 'UpdateShipment': {
          const result = await Business.updateShipment(
            userState.lastEntities.trackingNumber,
            userState.lastEntities
          );
          textReply = `✏️ Shipment updated: ${result}`;
          break;
        }
        default:
          textReply = Messages.Confirmed.default;
      }
      userState.awaitingConfirmation = false;
    } else if (isCancelled) {
      textReply = Messages.Cancellations.default;
      userState.awaitingConfirmation = false;
    } else {
      textReply = Messages.UnknownConfirm;
    }

    await conversationState.saveChanges(dummyContext as any);
    const audioReply = await Technical.synthesizeSpeech(stripEmojis(textReply), true);
    return { textReply, audioReply };
  }

  // 🔍 Step 2: Intent Detection
  const intentResult = await Technical.detectIntent(userText);
  if (!intentResult.intent || intentResult.intent === 'Unknown' || intentResult.confidence < 60) {
    const fallback = Messages.Fallback;
    const audio = await Technical.synthesizeSpeech(stripEmojis(fallback), true);
    logError('Unknown/low confidence intent', {
      userId,
      intent: intentResult.intent,
      confidence: intentResult.confidence,
      text: userText
    });
    return { textReply: fallback, audioReply: audio };
  }

  const intent = intentResult.intent;

  // 🧠 Step 3: Merge Entities (patching)
  const newEntities = await Technical.extractEntities(userText, intent);
  const mergedEntities = {
    ...userState.lastEntities,
    ...newEntities
  };

  const { missingFields, fieldPrompts, dialogAct } = await Technical.checkMissingFields(intent, mergedEntities);

  userState.lastIntent = intent;
  userState.lastEntities = mergedEntities;
  userState.missingFields = missingFields;

  let textReply = '';

  // 🧾 Step 4: Re-prompt or Confirm or Execute
  if (missingFields.length > 0) {
    const promptList = Object.values(fieldPrompts || {}).join(' ');
    textReply = promptList || `Please provide: ${missingFields.join(', ')}`;
    logInfo('🔄 Missing fields prompt', { userId, intent, missingFields, dialogAct });
  } else {
    switch (intent) {
      case 'CreateShipment':
        textReply = Messages.Confirmations.CreateShipment(mergedEntities);
        userState.awaitingConfirmation = true;
        break;
      case 'ReturnShipment':
        textReply = Messages.Confirmations.ReturnShipment(mergedEntities);
        userState.awaitingConfirmation = true;
        break;
      case 'RescheduleDelivery':
        textReply = Messages.Confirmations.RescheduleDelivery(mergedEntities);
        userState.awaitingConfirmation = true;
        break;
      case 'UpdateShipment':
        textReply = `Are you sure you want to update shipment ${mergedEntities.trackingNumber}? (yes/no)`;
        userState.awaitingConfirmation = true;
        break;
      case 'TrackShipment': {
        const result = await Business.trackShipment(mergedEntities.trackingId);
        textReply = `📦 Status: ${result.status} at ${result.eventTime}`;
        break;
      }
      default:
        textReply = `Detected intent: ${intent}`;
    }
  }

  await conversationState.saveChanges(dummyContext as any);
  const audioReply = await Technical.synthesizeSpeech(stripEmojis(textReply), true);
  return { textReply, audioReply };
}
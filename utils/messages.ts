export const Messages = {
  Welcome: `👋 Hello! I'm your Voice + Text Shipment Assistant.

You can say:
📦 "Send a package to Delhi"
🔁 "Return my order 54321"
⏳ "Reschedule delivery to Tuesday"
🔍 "Track shipment 12345"

What would you like to do today?`,

  Fallback: 'Sorry, I could not understand your request. Please rephrase.',
  UnknownConfirm: '❓ Please reply with "yes" or "no".',

  Confirmations: {
    CreateShipment: (entities: any) =>
      `📦 From: ${entities.from}\n📍 To: ${entities.to}\n⚖️ Weight: ${entities.weight}\n📝 Desc: ${entities.description}\n\nConfirm? (yes/no)`,

    ReturnShipment: (entities: any) =>
      `🔁 Return order ${entities.orderId} for reason: "${entities.reason}"?\nConfirm? (yes/no)`,

    RescheduleDelivery: (entities: any) =>
      `📅 Reschedule shipment ${entities.shipmentId} to ${entities.newDate}?\nConfirm? (yes/no)`
  },

  Cancellations: {
    default: '❌ Cancelled. You can start a new request.'
  },

  Confirmed: {
    default: '✅ Confirmed.'
  }
};

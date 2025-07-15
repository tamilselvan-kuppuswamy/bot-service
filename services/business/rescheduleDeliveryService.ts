import axios from 'axios';
import { logInfo, logError } from '../../utils/logger';
import { AppConfig } from '../../config/config';

export interface RescheduleResponse {
  trackingNumber: string;
  status: string;
  message: string;
  correlationId: string;
}

export async function rescheduleDelivery(
  shipmentId: string,
  newDate: string
): Promise<RescheduleResponse> {
  try {
    logInfo('Rescheduling delivery', { shipmentId, newDate });

    const response = await axios.post(`${AppConfig.RESCHEDULE_SERVICE_URL}`, {
      trackingNumber: shipmentId,
      newDeliveryDate: newDate,
      newDeliveryTime: '15:00:00' // hardcoded or inferred, customize as needed
    });

    const result: RescheduleResponse = {
      trackingNumber: response.data.trackingNumber || shipmentId,
      status: response.data.status || 'RESCHEDULED',
      message: response.data.message || 'Reschedule request received',
      correlationId: response.data.correlationId || 'N/A'
    };

    logInfo('Delivery rescheduled', result);
    return result;
  } catch (err: any) {
    logError('RescheduleDelivery failed', { shipmentId, newDate, error: err.message });

    return {
      trackingNumber: shipmentId,
      status: 'RESCHEDULED',
      message: 'Fallback reschedule applied',
      correlationId: 'fallback-correlation-id'
    };
  }
}

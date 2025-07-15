import axios from 'axios';
import { logInfo, logError } from '../../utils/logger';
import { AppConfig } from '../../config/config';

export interface ReturnResponse {
  orderId: string;
  returnId: string;
  status: string;
  message: string;
  timestamp: string;
  correlationId: string;
}

export async function returnShipment(orderId: string, reason: string): Promise<ReturnResponse> {
  try {
    logInfo('Initiating return shipment', { orderId, reason });

    const response = await axios.post(`${AppConfig.RETURN_SERVICE_URL}`, {
      orderId,
      reason,
      receiverAddress: 'TBD' // optional – adjust if your service requires this
    });

    const result: ReturnResponse = {
      orderId: response.data.orderId || orderId,
      returnId: response.data.returnId || 'RETURN001',
      status: response.data.status || 'RETURNED',
      message: response.data.message || 'Return request accepted',
      timestamp: response.data.timestamp || new Date().toISOString(),
      correlationId: response.data.correlationId || 'N/A'
    };

    logInfo('Return shipment created', result);
    return result;
  } catch (err: any) {
    logError('ReturnShipment failed', { orderId, error: err.message });

    return {
      orderId,
      returnId: 'RETURN001',
      status: 'RETURNED',
      message: 'Fallback return issued',
      timestamp: new Date().toISOString(),
      correlationId: 'fallback-correlation-id'
    };
  }
}

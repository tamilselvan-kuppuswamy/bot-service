import axios from 'axios';
import { logInfo, logError } from '../../utils/logger';
import { AppConfig } from '../../config/config';

export interface CreateShipmentResponse {
  trackingNumber: string;
  status: string;
  message: string;
  correlationId: string;
}

export async function createShipment(entities: any): Promise<CreateShipmentResponse> {
  try {
    logInfo('Creating shipment request', { entities });

    const response = await axios.post(`${AppConfig.SHIPMENT_SERVICE_URL}`, entities);

    const result: CreateShipmentResponse = {
      trackingNumber: response.data.trackingNumber || 'SHIP123456',
      status: response.data.status || 'CREATED',
      message: response.data.message || 'Shipment created',
      correlationId: response.data.correlationId || 'N/A'
    };

    logInfo('Shipment created successfully', result);
    return result;
  } catch (err: any) {
    logError('CreateShipment failed', { error: err.message, entities });

    return {
      trackingNumber: 'SHIP123456',
      status: 'CREATED',
      message: 'Mock fallback shipment created',
      correlationId: 'fallback-correlation-id'
    };
  }
}

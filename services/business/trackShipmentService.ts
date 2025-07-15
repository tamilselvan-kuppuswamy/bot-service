import axios from 'axios';
import { logInfo, logError } from '../../utils/logger';
import { AppConfig } from '../../config/config';

export interface TrackingResponse {
  trackingNumber: string;
  status: string;
  eventTime: string;
  correlationId: string;
}

export async function trackShipment(trackingId: string): Promise<TrackingResponse> {
  try {
    logInfo('Tracking shipment', { trackingId });

    const response = await axios.get(`${AppConfig.TRACK_SERVICE_URL}/${trackingId}`);

    const result: TrackingResponse = {
      trackingNumber: response.data.trackingNumber || trackingId,
      status: response.data.status || 'In Transit',
      eventTime: response.data.eventTime || new Date().toISOString(),
      correlationId: response.data.correlationId || 'N/A'
    };

    logInfo('Tracking info fetched', result);
    return result;
  } catch (err: any) {
    logError('TrackShipment failed', { trackingId, error: err.message });

    return {
      trackingNumber: trackingId,
      status: 'Unknown',
      eventTime: new Date().toISOString(),
      correlationId: 'fallback-correlation-id'
    };
  }
}

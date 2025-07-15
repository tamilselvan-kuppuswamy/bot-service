import axios from 'axios';
import { logInfo, logError } from '../../utils/logger';
import { AppConfig } from '../../config/config';

export async function updateShipment(trackingNumber: string, updates: any): Promise<string> {
  try {
    logInfo('Updating shipment', { trackingNumber, updates });

    await axios.patch(`${AppConfig.SHIPMENT_SERVICE_URL}/${trackingNumber}`, updates);

    return 'Shipment update accepted';
  } catch (err: any) {
    logError('UpdateShipment failed', { trackingNumber, error: err.message });
    return 'Failed to update shipment';
  }
}

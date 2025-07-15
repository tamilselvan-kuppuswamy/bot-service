import { MemoryStorage, ConversationState } from 'botbuilder';
import { CosmosDbPartitionedStorage } from 'botbuilder-azure';
import { logInfo } from '../utils/logger';

const useMockDb = process.env.USE_MOCK_DB === 'true';

let storage;

if (useMockDb) {
  logInfo('🧪 Using in-memory storage (MemoryStorage) for state.');
  storage = new MemoryStorage();
} else {
  logInfo('🌐 Using Cosmos DB storage for state.', {
    endpoint: process.env.COSMOS_DB_ENDPOINT,
    db: process.env.COSMOS_DB_DATABASE,
    container: process.env.COSMOS_DB_CONTAINER
  });
  storage = new CosmosDbPartitionedStorage({
    cosmosDbEndpoint: process.env.COSMOS_DB_ENDPOINT!,
    authKey: process.env.COSMOS_DB_KEY!,
    databaseId: process.env.COSMOS_DB_DATABASE!,
    containerId: process.env.COSMOS_DB_CONTAINER!
  });
}

export const conversationState = new ConversationState(storage);
export const userStateAccessor = conversationState.createProperty<any>('UserConversationState');

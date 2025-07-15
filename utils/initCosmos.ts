import { CosmosClient } from '@azure/cosmos';

const endpoint = process.env.COSMOS_DB_ENDPOINT!;
const key = process.env.COSMOS_DB_KEY!;
const databaseId = process.env.COSMOS_DB_DATABASE!;
const containerId = process.env.COSMOS_DB_CONTAINER!;

export const initializeCosmosDb = async () => {
  try {
    console.log('🌍 Cosmos DB Endpoint:', endpoint);

    const client = new CosmosClient({ endpoint, key });

    await client.databases.createIfNotExists({ id: databaseId });
    console.log(`✅ Cosmos DB: Database "${databaseId}" ensured`);

    await client.database(databaseId).containers.createIfNotExists({
      id: containerId,
      partitionKey: { paths: ['/userId'] },
    });
    console.log(`✅ Cosmos DB: Container "${containerId}" ensured`);
  } catch (err) {
    if (err instanceof Error) {
      console.error('❌ Failed to initialize Cosmos DB:', err.message);
    } else {
      console.error('❌ Unknown error during Cosmos DB init:', err);
    }
    throw err;
  }
};
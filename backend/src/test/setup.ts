import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll } from 'vitest';

let mongoServer: MongoMemoryServer | undefined;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';

  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '7.0.14',
    },
  });

  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
}, 300000);

afterEach(async () => {
  const collections = mongoose.connection.collections;

  for (const collection of Object.values(collections)) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
}, 300000);
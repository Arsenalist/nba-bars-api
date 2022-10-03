import { createClient } from 'redis';

export let redisClient = undefined
export async function createRedisClient() {
  redisClient = createClient(
    {
      url: 'redis://redis-13376.c265.us-east-1-2.ec2.cloud.redislabs.com:13376',
      password: 'Vwpbgjx4W2ry8rz8JEuJfz9zttrOf0Ea'
    }
  );

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}


import { createClient } from 'redis';

export let redisClient = undefined
export async function createRedisClient() {
  redisClient = createClient(
    {
      url: 'redis://redis-17834.c232.us-east-1-2.ec2.cloud.redislabs.com:17834',
      password: '85wzmmNPEuFnmfLAcLuIQde7LXFGZRh2'
    }
  );

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}


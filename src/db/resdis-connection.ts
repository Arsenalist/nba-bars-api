import { createClient } from 'redis';

export let redisClient = undefined
export async function createRedisClient() {
  redisClient = createClient(
    {
      url: 'redis://redis-19886.c9.us-east-1-2.ec2.cloud.redislabs.com:19886',
      password: 'BlyGohE1AtxntXTZjLjZN4BZ67ysfMvx'
    }
  );

  redisClient.on('error', (err) => console.log('Redis Client Error', err));
  await redisClient.connect();
}


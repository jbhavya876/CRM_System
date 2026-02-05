import { Queue } from "bullmq";
import dotenv from 'dotenv';

dotenv.config();

export const notificationQueue = new Queue("lead-notifications", {
  connection: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379
  },
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 1000
    },
    removeOnComplete: true,
    removeOnFail: false
  }
});

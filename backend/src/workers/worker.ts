import { Worker } from 'bullmq';
import dotenv from 'dotenv';

dotenv.config();

const worker = new Worker(
  "lead-notifications",
  async job => {
    // Simulate flaky provider
    if (Math.random() < 0.2) {
      throw new Error("SMS Gateway Timeout");
    }

    console.log(`Processed job ${job.id}`);
  },
  {
    connection: {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT) || 6379
    }
  }
);

worker.on("failed", (job, err) => {
  console.error(
    `DLQ: Job ${job?.id} permanently failed → ${err.message}`
  );
});

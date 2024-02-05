import { parseEnv } from "znv";
import { z } from "zod";

export const { DISCORD_WEBHOOK_URL, DISCORD_CHANNEL_ID, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_ENDPOINT, CDN_HOSTNAME } =
  parseEnv(process.env, {
    // discord for notification/alert
    DISCORD_CHANNEL_ID: z.string().min(1),
    DISCORD_WEBHOOK_URL: z.string().min(1),

    // AWS S3 or Cloudflare R2
    AWS_ACCESS_KEY_ID: z.string().min(1),
    AWS_SECRET_ACCESS_KEY: z.string().min(1),
    AWS_ENDPOINT: z.string().min(1),

    // CDN hostname for the uploaded images
    CDN_HOSTNAME: z.string().min(1),
  });

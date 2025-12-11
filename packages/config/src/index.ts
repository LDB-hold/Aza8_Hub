import { z } from 'zod';

const nodeEnvSchema = z.enum(['development', 'test', 'production']);

export type NodeEnv = z.infer<typeof nodeEnvSchema>;

const apiConfigSchema = z.object({
  NODE_ENV: nodeEnvSchema.default('development'),
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().min(1),
  AUTH_SECRET: z.string().min(32, 'AUTH_SECRET must be at least 32 characters')
});

const webConfigSchema = z.object({
  NODE_ENV: nodeEnvSchema.default('development'),
  NEXT_PUBLIC_API_URL: z.string().url()
});

export interface ApiConfig {
  env: NodeEnv;
  port: number;
  databaseUrl: string;
  authSecret: string;
}

export interface WebConfig {
  env: NodeEnv;
  apiUrl: string;
}

const normalize = (record: Record<string, string | undefined>): Record<string, string> => {
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === 'string') {
      normalized[key] = value;
    }
  }
  return normalized;
};

export const loadApiConfig = (env: NodeJS.ProcessEnv = process.env): ApiConfig => {
  const parsed = apiConfigSchema.parse(normalize(env));
  return {
    env: parsed.NODE_ENV,
    port: Number(parsed.PORT),
    databaseUrl: parsed.DATABASE_URL,
    authSecret: parsed.AUTH_SECRET
  };
};

export const loadWebConfig = (env: NodeJS.ProcessEnv = process.env): WebConfig => {
  const parsed = webConfigSchema.parse(normalize(env));
  return {
    env: parsed.NODE_ENV,
    apiUrl: parsed.NEXT_PUBLIC_API_URL
  };
};

export const isProduction = (env: NodeEnv): boolean => env === 'production';

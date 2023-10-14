import { createClient } from '@libsql/client';

export const client = createClient({
  url: process.env.DB_URL!!,
  authToken: process.env.DB_AUTH_TOKEN
});

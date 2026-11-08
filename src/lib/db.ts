import { neon } from "@neondatabase/serverless";

export type Row = Record<string, any>;
type SqlTag = <T = Row>(strings: TemplateStringsArray, ...values: any[]) => Promise<T[]>;

let client: SqlTag | null = null;

export function db() {
  if (!client) {
    client = neon(process.env.DATABASE_URL!) as unknown as SqlTag;
  }
  return client;
}

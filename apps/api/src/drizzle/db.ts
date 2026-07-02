import { drizzle } from "drizzle-orm/d1";

export const getDb = (cf: CloudflareBindings) => {
  return drizzle(cf.sinkDB);
};

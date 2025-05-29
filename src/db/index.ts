import {drizzle} from "drizzle-orm/postgres-js";
import * as schema from "./schema.js";

import postgres from "postgres";
import {config} from "../config.js";

const conn = postgres(config.db.url);
export const db = drizzle(conn, {schema});
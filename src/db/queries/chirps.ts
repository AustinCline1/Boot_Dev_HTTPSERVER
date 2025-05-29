import {chirps, NewChirp} from "../schema.js";
import {db} from "../index.js";
import {asc, eq} from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}

export async function getAllChirps() {
    const results = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return results;
}

export async function getChirp(id:string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    return result;
}
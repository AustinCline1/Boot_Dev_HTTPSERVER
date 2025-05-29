import {chirps, NewChirp} from "../schema.js";
import {db} from "../index.js";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}
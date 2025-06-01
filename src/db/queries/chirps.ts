import {chirps, NewChirp} from "../schema.js";
import {db} from "../index.js";
import {asc, desc, eq} from "drizzle-orm";

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}

export async function getAllChirps(order:string = "asc") {
    if(order === "desc") {
        const results = await db.select().from(chirps).orderBy(desc(chirps.createdAt));
        return results;
    }
    const results = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return results;
}

export async function getChirp(id:string) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, id));
    if(!result) {
        return;
    }
    return result;
}

export async function deleteChirp(id:string){
    const result = await db.delete(chirps).where(eq(chirps.id, id));
    return result.length == 0;
}

export async function getChirpsByAuthor(authorId: string) {
    const results = await db.select().from(chirps).where(eq(chirps.userId, authorId)).orderBy(asc(chirps.createdAt));
    return results;
}
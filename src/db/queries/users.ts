import {db} from "../index.js";
import {NewUser, refreshTokens, users} from "../schema.js";
import {and, eq, isNull} from "drizzle-orm";
import {config} from "../../config.js";


export async function createUser(user: NewUser) {
    const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
    return result;
}

export async function updateUser(email: string, password:string, userId: string) {
    const [result] = await db.update(users).set({email: email, password: password,updatedAt: new Date(Date.now())}).where(eq(users.id, userId)).returning();
    return result;
}

export async function deleteUser() {
        await db.delete(users);
}

export async function getUserPassword(email: string) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}

export async function upgradeUser(userId: string) {
    const [result]= await db.update(users).set({isChirpyRed: true}).where(eq(users.id, userId)).returning();
    return result;

}
export async function setRefreshToken(userId: string, refreshToken: string) {
    const expirationDate = new Date(Date.now() + config.jwt.refreshDuration);
    const result = await db.insert(refreshTokens).values({token: refreshToken, userId: userId, expiresAt:expirationDate,revokedAt:null}).returning()
    return result.length > 0;
}

export async function getUserFromRefreshToken(refreshToken: string) {
    const [result] = await db.select().from(refreshTokens).where(and(eq(refreshTokens.token, refreshToken),isNull(refreshTokens.revokedAt))).limit(1);
    return result;
}

export async function revokeRefreshToken(refreshToken: string) {
    await db.update(refreshTokens).set({revokedAt: new Date(), updatedAt: new Date()}).where(eq(refreshTokens.token, refreshToken));
}



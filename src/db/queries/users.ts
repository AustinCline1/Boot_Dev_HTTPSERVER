import {db} from "../index.js";
import {NewUser, refreshTokens, users} from "../schema.js";
import {eq} from "drizzle-orm";


export async function createUser(user: NewUser) {
    const [result] = await db.insert(users).values(user).onConflictDoNothing().returning();
    return result;
}

export async function deleteUser() {
        await db.delete(users);
}

export async function getUserPassword(email: string) {
    const [result] = await db.select().from(users).where(eq(users.email, email));
    return result;
}

export async function setRefreshToken(userId: string, refreshToken: string) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 60);
    const [result] = await db.insert(refreshTokens).values({token: refreshToken, userId: userId, expiresAt:expirationDate,revokedAt:null}).onConflictDoNothing().returning();
    return result;
}

export async function getUserFromRefreshToken(refreshToken: string) {
    const [result] = await db.select().from(refreshTokens).where(eq(refreshTokens.token, refreshToken));
    return result;
}

export async function revokeRefreshToken(refreshToken: string) {
    await db.update(refreshTokens).set({revokedAt: new Date(), updatedAt: new Date()}).where(eq(refreshTokens.token, refreshToken));
}

import { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

type Config = {
    api: APIConfig;
    db: DBConfig;
    jwt: jwt;
}

type jwt = {
    defaultDuration: number;
    refreshDuration: number;
    secret: string;
}
type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
    polka: string;
}

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

function envORThrow(key: string) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing env variable ${key}`);
    }
    return value;
}

const migrationConfig: MigrationConfig = {
    migrationsFolder: "./src/db/migrations",
}

export const config:Config = {
    api: {
      fileserverHits: 0,
      port: Number(envORThrow("PORT")),
        platform: envORThrow("PLATFORM"),
        polka: envORThrow("POLKA_KEY"),
    },
    db: {
        url: envORThrow("DB_URL"),
        migrationConfig: migrationConfig
    },
    jwt: {
        defaultDuration: 60* 60,
        refreshDuration: 60*60*24*60*1000,
        secret: envORThrow("SECRET"),
    }

};
import { config } from "dotenv";
config();

import { DataSource, EntityTarget, ObjectLiteral, Repository } from "typeorm"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? "3533"),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: false,
    logging: false,
    entities: [`${__dirname}/../entities/**/*.{ts,js}`],
    migrations: [`${__dirname}/../migrations/*.{ts,js}`],
    ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
    connectTimeoutMS: 30000,

    poolSize: 10,

    extra: {
        max: 10,
        min: 2,

        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        keepAlive: true,

        keepAliveInitialDelayMillis: 10000,
    },
})


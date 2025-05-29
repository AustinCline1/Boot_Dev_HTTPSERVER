import express from 'express';
import {handlerReadiness} from "./api/readiness.js";
import {middlewareLogResponses, middlewareMetricsInc,middlewareError} from "./api/middleware.js";
import {handlerMetrics,handlerReset} from "./api/metrics.js";
import {handlerChirpsValidate} from "./api/validate_chirp.js";
import {config} from "./config.js";
import postgres from 'postgres';
import {migrate} from "drizzle-orm/postgres-js/migrator";
import {drizzle} from "drizzle-orm/postgres-js";
import {handlerCreateUser} from "./api/users.js";




const migrationClient = postgres(config.db.url, {max:1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();
app.use("/app",middlewareMetricsInc,express.static('./src/app'));
app.use(middlewareLogResponses);
app.use(express.json());

/* Routes */
app.get("/api/healthz", (req,res,next)=> {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics",(req,res,next)=>{
    Promise.resolve(handlerMetrics(req,res)).catch(next);
});
app.post("/admin/reset",(req,res,next)=>{
    Promise.resolve(handlerReset(req,res)).catch(next);
});
app.post("/api/validate_chirp",async (req,res,next)=> {
    Promise.resolve(handlerChirpsValidate(req,res)).catch(next);
});

app.post("/api/users",async (req,res,next)=> {
    Promise.resolve(handlerCreateUser(req,res)).catch(next);
} )

app.use(middlewareError);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});
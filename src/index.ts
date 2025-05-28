import express from 'express';
import {handlerReadiness} from "./api/readiness.js";
import {middlewareLogResponses, middlewareMetricsInc} from "./api/middleware.js";
import {handlerMetrics, handlerMetricsReset} from "./api/metrics.js";
import {handlerChirpsValidate} from "./api/validate_chirp.js";

const app = express();
const PORT = 8080;

app.use("/app",middlewareMetricsInc,express.static('./src/app'));
app.use(middlewareLogResponses);
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics",handlerMetrics);
app.post("/admin/reset",handlerMetricsReset);
app.post("/api/validate_chirp",handlerChirpsValidate);

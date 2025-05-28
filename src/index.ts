import express from 'express';
import {handlerReadiness} from "./api/readiness.js";
import {middlewareLogResponses, middlewareMetricsInc} from "./api/middleware.js";
import {handlerMetrics, handlerMetricsReset} from "./api/metrics.js";

const app = express();
const PORT = 8080;

app.use("/app",middlewareMetricsInc,express.static('./src/app'));
app.use(middlewareLogResponses);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

app.get("/healthz", handlerReadiness);
app.get("/metrics",handlerMetrics);
app.get("/reset",handlerMetricsReset);

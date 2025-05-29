import express from 'express';
import {handlerReadiness} from "./api/readiness.js";
import {middlewareLogResponses, middlewareMetricsInc,middlewareError} from "./api/middleware.js";
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

app.get("/api/healthz", (req,res,next)=> {
    Promise.resolve(handlerReadiness(req, res)).catch(next);
});
app.get("/admin/metrics",(req,res,next)=>{
    Promise.resolve(handlerMetrics(req,res)).catch(next);
});
app.post("/admin/reset",(req,res,next)=>{
    Promise.resolve(handlerMetricsReset(req,res)).catch(next);
});
app.post("/api/validate_chirp",async (req,res,next)=> {
    Promise.resolve(handlerChirpsValidate(req,res)).catch(next);
});

app.use(middlewareError);

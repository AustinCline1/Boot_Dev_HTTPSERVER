import express from "express";
import {config} from "../config.js";

export function handlerMetrics(req: express.Request, res: express.Response){
    res.send(`Hits: ${config.fileserverHits}`);
}

export function handlerMetricsReset(req: express.Request, res: express.Response){
    config.fileserverHits = 0;
    res.send(`Reset`);
}
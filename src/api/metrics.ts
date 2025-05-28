import express from "express";
import {config} from "../config.js";

export function handlerMetrics(req: express.Request, res: express.Response){
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
}

export function handlerMetricsReset(req: express.Request, res: express.Response){
    config.fileserverHits = 0;
    res.send(`Reset`);
}
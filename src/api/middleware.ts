import {NextFunction, Response, Request} from "express";
import {config} from "../config.js";


export function middlewareLogResponses(req: Request, res: Response, next: NextFunction):void {
    next();
    res.on("finish", ()=> {
        if(res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    })
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction):void {
    config.fileserverHits++;
    next();
}
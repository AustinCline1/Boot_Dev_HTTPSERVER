import {NextFunction, Response, Request} from "express";
import {config} from "../config.js";
import {respondWithError} from "./json.js";
import {BadRequestError, NotFoundError, UserForbiddenError, UserNotAuthenticatedError} from "./errors.js";


export function middlewareLogResponses(req: Request, res: Response, next: NextFunction):void {
    next();
    res.on("finish", ()=> {
        if(res.statusCode >= 300) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
    })
}

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction):void {
    config.api.fileserverHits++;
    next();
}

export function middlewareError(err: Error, req: Request, res: Response, next: NextFunction) {
    let statusCode = 500;
    let message = "Something went wrong on our end";
    console.error(err);
    if(err instanceof BadRequestError) {
        statusCode = 400;
        message = err.message;
    } else if (err instanceof UserNotAuthenticatedError) {
        statusCode = 401;
        message = err.message;
    } else if (err instanceof UserForbiddenError) {
        statusCode = 403;
        message = err.message;
    } else if (err instanceof NotFoundError) {
        statusCode = 404;
        message = err.message;
    }
    if (statusCode >= 500) {
        console.error(err.message);
    }
    respondWithError(res, statusCode,message);
}
import {Request,Response} from "express";
import {config} from "../config.js";
import {UserForbiddenError} from "./errors.js";
import {deleteUser} from "../db/queries/users.js";

export function handlerMetrics(req: Request, res: Response){
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
  </body>
</html>`);
}


export async function handlerReset(req: Request,res: Response) {
    if (config.api.platform !== "dev"){
        throw new UserForbiddenError("Forbidden");
    }
    config.api.fileserverHits = 0;
    await deleteUser();
    res.send(`Reset DB and Hits to 0`);
    res.end();
}
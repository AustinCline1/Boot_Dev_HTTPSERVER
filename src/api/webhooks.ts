import {Request, Response} from "express";
import {respondWithError} from "./json.js";
import {upgradeUser} from "../db/queries/users.js";
import {NotFoundError} from "./errors.js";
import {getAPIKey} from "./auth.js";
import {config} from "../config.js";

export async function handlerUpgradeUser(req: Request, res: Response) {
    type parameters = {
        event: string,
        data: {
            userId: string;
        }
    }
    const apiKey = getAPIKey(req);
    if(apiKey !== config.api.polka){
        res.sendStatus(401);
    }
    const params: parameters = req.body;
    if(params.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    if(!params.data) {
        respondWithError(res, 400, "Missing required parameters, Need userId");
        return;
    }
    const userId = params.data.userId;
    try{
        const success =  await upgradeUser(userId);
        if(success.isChirpyRed === true){
            res.sendStatus(204);
            return;
        }else {
            res.sendStatus(404);
            return;
        }
    }catch (e) {
        console.log(`Failed try catch`);
        throw new NotFoundError("User not found");
    }
}


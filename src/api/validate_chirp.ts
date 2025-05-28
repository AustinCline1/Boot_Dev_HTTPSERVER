import {Request,Response} from "express";
import {respondWithError, respondWithJSON} from "./json.js";

export async function handlerChirpsValidate(req: Request,res: Response) {
    type paramaters = {
        body: string;
    };

    const params: paramaters = req.body;

    const maxChirpLength = 140;
    if(params.body.length > maxChirpLength) {
        respondWithError(res, 400, `Chirp is too long`);
        return
    }
    const censor = '****';
    const chirp = params.body.split(" ");
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    for(const index in chirp) {
        if(badWords.includes(chirp[index].toLowerCase())) {
            chirp[index] = censor;
            continue;
        }
        chirp[index] = chirp[index];
    }

    const finalChirpString = chirp.join(" ");
    respondWithJSON(res, 200, {cleanedBody : finalChirpString});
}
import {Request, Response} from "express";
import {BadRequestError} from "./errors.js";
import {createChirp} from "../db/queries/chirps.js";
import {respondWithJSON} from "./json.js";

export async function handlerCreateChirps(req: Request, res: Response) {
    type paramaters = {
        body: string;
        userId: string;
    };
    const params: paramaters = req.body;
    const userId = params.userId;
    if(!params.body || !userId) {
        throw new BadRequestError("Missing required parameters");
    }
    const cleanedBody = validateChirp(params.body);
    const chirp = await createChirp({body: cleanedBody, userId: userId});
    if(!chirp) {
        throw new Error("Failed to create chirp");
    }
    respondWithJSON(res, 201,chirp);
}

function validateChirp(body: string){
    const maxChirpLength = 140;
    if (body.length > maxChirpLength) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const censor = '****';
    const bodyChirp = body.split(" ");
    const badWords = ["kerfuffle", "sharbert", "fornax"];
    for(const index in bodyChirp) {
        if(badWords.includes(bodyChirp[index].toLowerCase())) {
            bodyChirp[index] = censor;
            continue;
        }
        bodyChirp[index] = bodyChirp[index];
    }

    return bodyChirp.join(" ");
}
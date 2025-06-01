import {Request, Response} from "express";
import {BadRequestError, NotFoundError, UserForbiddenError} from "./errors.js";
import {createChirp, deleteChirp, getAllChirps, getChirp, getChirpsByAuthor} from "../db/queries/chirps.js";
import {respondWithJSON} from "./json.js";
import {getBearerToken, verifyJWT} from "../auth.js";
import {config} from "../config.js";

export async function handlerCreateChirps(req: Request, res: Response) {
    type parameters = {
        body: string;
    };
    const params: parameters = req.body;
    const token =  getBearerToken(req);
    const userId = verifyJWT(token, config.jwt.secret);
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

export async function handlerGetAllChirps(req: Request, res: Response) {
    /* Get chirps using an optional parameter authorId */
    let authorId = "";
    let authorIdQuery = req.query.authorId;
    console.log(`Author ID Query ${authorIdQuery}`);
    if(typeof authorIdQuery === "string") {
        authorId = authorIdQuery;
    }
    if(authorId) {
        const chirp = await getChirpsByAuthor(authorId);
        if(!chirp){
            throw new NotFoundError("Failed to get chirp");
        }
        respondWithJSON(res, 200, chirp);
        return;
    }
    /* Sort chirps by and optional parameter sort=asc or sort=desc */
    let sort = "asc";
    let sortQuery = req.query.sort;
    if(typeof sortQuery === "string") {
        sort = sortQuery;
    }
    if(sort !== "asc" && sort !== "desc") {
        throw new BadRequestError("Invalid sort parameter");
    }
    if(sort === "desc") {
        const chirps = await getAllChirps("desc");
        respondWithJSON(res,200, chirps);
        return
    }
    const chirps = await getAllChirps();
    if(!chirps) {
        throw new Error("Failed to get chirps");
    }
    respondWithJSON(res, 200, chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
    const chirp = await getChirp(req.params.chirpID);
    if(!chirp) {
        throw new NotFoundError("Failed to get chirp");
    }
    respondWithJSON(res, 200, chirp);

}


export async function handlerDeleteChirp(req: Request, res: Response) {
    const chirp = await getChirp(req.params.chirpID);
    if(!chirp) {
        console.log("FAILED TO GET CHIRP");
        throw new NotFoundError("Failed to get chirp");
    }
    const token =  getBearerToken(req);
    if(!token) {
        throw new UserForbiddenError("Forbidden");
    }
    const userId = verifyJWT(token, config.jwt.secret);
    console.log(`USER ID ${userId}`);
    console.log(`CHIRP USER ID ${chirp.userId}`);
    if(userId !== chirp.userId) {
        throw new UserForbiddenError("Forbidden");
    }
        const success = await deleteChirp(chirp.id);
        if (success) {
            res.status(204).send();
        }
}
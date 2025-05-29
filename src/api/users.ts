import {Request, Response} from "express";
import {createUser} from "../db/queries/users.js";
import {respondWithJSON} from "./json.js";
import {BadRequestError} from "./errors.js";

export async function handlerCreateUser(req: Request, res: Response) {
    type paramaters = {
        email: string;
    }
    const params: paramaters = req.body;
    const email = params.email;

    if(!email) {
        throw new BadRequestError("Missing required parameter: email");
    }

    const user = await createUser({email});
    if (user) respondWithJSON(res, 201 , user);
    else respondWithJSON(res, 400, {error: "User already exists"});


}
import { paramMissingError } from '@shared/constants';
import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import { storage } from '../index';

const { BAD_REQUEST, CREATED, INTERNAL_SERVER_ERROR } = StatusCodes;

export async function addData(req: Request, res: Response) {
    const { text, image }: { text: string, image: Buffer } = req.body;
    if (!text && !image) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    let result = undefined;
    if (text) {
        result = await storage.addText(text);
    } else if(image) {
        result = await storage.addImage(image);
    }

    if(!result) {
        return res.status(INTERNAL_SERVER_ERROR).json({
            error: result,
        });
    }
    
    return res.status(CREATED).json(result).end();
}

export async function get(req: Request, res: Response) {
    const cid = req.params.cid;
    if (!cid) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const result = await storage.get(cid);
    return res.status(CREATED).json(result).end();
}


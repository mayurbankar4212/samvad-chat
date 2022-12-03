import express from 'express';
import { ApiError } from '../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class BaseController {

    setContext = async (
        context: string,
        request: express.Request) => {

        if (context === undefined || context === null) {
            throw new ApiError(500, 'Invalid request context');
        }
        const tokens = context.split('.');
        if (tokens.length < 2) {
            throw new ApiError(500, 'Invalid request context');
        }
        const resourceType = tokens[0];
        request.context = context;
        request.resourceType = resourceType;
        if (request.params.id !== undefined && request.params.id !== null) {
            request.resourceId = request.params.id;
        }
    };

}

import express from "express";
import { Logger } from "../common/logger";
import { register as registerClientRoutes } from "./api.client/api.client.routes";
import { register as registerFileResourceRoutes } from './file.resource/file.resource.routes';
import { register as registerChatRoutes } from './chat/chat.routes';

////////////////////////////////////////////////////////////////////////////////////

export class Router {

    private _app = null;

    constructor(app: express.Application) {
        this._app = app;
    }

    public init = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {

                //Handling the base route
                this._app.get('/api/v1/', (req, res) => {
                    res.send({
                        message : `REANCare API [Version ${process.env.API_VERSION}]`,
                    });
                });

                registerClientRoutes(this._app);
                registerFileResourceRoutes(this._app);
                registerChatRoutes(this._app);

                resolve(true);

            } catch (error) {
                Logger.instance().log('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}

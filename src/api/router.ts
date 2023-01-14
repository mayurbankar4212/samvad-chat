import express from "express";
import { Logger } from "../common/logger";
// import { register as registerClientRoutes } from "./api.client/api.client.routes";
// import { register as registerFileResourceRoutes } from './file.resource/file.resource.routes';
//import { register as registerChatRoutes } from './chat/chat.routes';
import {register as registerChatUserRoutes } from './user/chat.user.routes';

////////////////////////////////////////////////////////////////////////////////////

export class Router {

    private _app = null;

    constructor(app: express.Application) {
        this._app = app;
    }

    public init = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {
                console.log("Hiiiiiiiiii");
                //Handling the base route
                this._app.get('/api/v1/', (req, res) => {
                    res.send({
                        message : `Samvad Chat API [Version ${process.env.API_VERSION}]`,
                    });
                });
                console.log("Bye");
                // registerClientRoutes(this._app);
                // registerFileResourceRoutes(this._app);
                //registerChatRoutes(this._app);
                registerChatUserRoutes(this._app);
                resolve(true);

            } catch (error) {
                Logger.instance().log('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}

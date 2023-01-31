import express from "express";
import { Logger } from "../common/logger";
// import { register as registerClientRoutes } from "./api.client/api.client.routes";
// import { register as registerFileResourceRoutes } from './file.resource/file.resource.routes';
import { register as registerChatRoutes } from './peer.chat/peer.chat.routes';
import { register as registerChatUserRoutes } from './user/chat.user.routes';
import { register as registerBannedUserRoutes } from './banned.user/banned.user.routes';
import { register as registerGroupChatRoutes } from './group.chat/group.chat.routes';
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
                        message : `Samvad Chat API [Version ${process.env.API_VERSION}]`,
                    });
                });
                // registerClientRoutes(this._app);
                // registerFileResourceRoutes(this._app);
                registerChatRoutes(this._app);
                registerChatUserRoutes(this._app);
                registerBannedUserRoutes(this._app);
                registerGroupChatRoutes(this._app);
                resolve(true);

            } catch (error) {
                Logger.instance().log('Error initializing the router: ' + error.message);
                reject(false);
            }
        });
    };

}

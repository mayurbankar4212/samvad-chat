import express from 'express';

import { BannedUserService } from '../../services/banned.user.service';
import { ResponseHandler } from '../../common/response.handler';
import { Loader } from '../../startup/loader';
import { BannedUserValidator } from './banned.user.validator';
import { ApiError } from '../../common/api.error';

///////////////////////////////////////////////////////////////////////////////////////

export class BannedUserController {

    //#region member variables and constructors

    _service: BannedUserService = null;

    constructor() {
        this._service = Loader.container.resolve(BannedUserService);
    }

    //#endregion

    create = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.Ban';

            const BannedUserDomainModel = await BannedUserValidator.create(request);

            const user = await this._service.create(BannedUserDomainModel);
            if (user == null) {
                throw new ApiError(400, 'Unable to Ban user.');
            }
            ResponseHandler.success(request, response, 'User Banned successfully!', 201, {
                User : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    // getById = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
    //         request.context = 'User.GetById';

    //         const id: string = await ChatUserValidator.getById(request);

    //         const user = await this._service.getById(id);
    //         if (user == null) {
    //             throw new ApiError(404, 'User not found.');
    //         }
    //         ResponseHandler.success(request, response, 'Chat user retrieved successfully!', 200, {
    //             User : user,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    getAllUsers = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.GetAllUsers';

            //const id: string = await ChatUserValidator.getById(request);

            const user = await this._service.getAllUsers();
            if (user == null) {
                throw new ApiError(404, 'User not found.');
            }
            ResponseHandler.success(request, response, 'Banned user retrieved successfully!', 200, {
                User : user,
            });
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    // search = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
    //         request.context = 'User.Search';

    //         const filters = await ChatUserValidator.search(request);

    //         const searchResults = await this._service.search(filters);
    //         const count = searchResults.Items.length;
    //         const message =
    //             count === 0 ? 'No records found!' : `Total ${count} api client records retrieved successfully!`;

    //         ResponseHandler.success(request, response, message, 200, {
    //             ApiClientRecords : searchResults,
    //         });

    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    // update = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
    //         request.context = 'User.Update';

    //         const id: string = await ChatUserValidator.getById(request);
    //         const domainModel = await ChatUserValidator.update(request);
    //         const client = await this._service.update(id, domainModel);
    //         if (client == null) {
    //             throw new ApiError(404, 'Chat User not found.');
    //         }
    //         ResponseHandler.success(request, response, 'Chat User updated successfully!', 200, {
    //             Client : client,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    delete = async (request: express.Request, response: express.Response): Promise<void> => {
        try {
            request.context = 'User.Delete';

            const id: string = await BannedUserValidator.getById(request);
            const result = await this._service.delete(id);
            if (result === false){
                throw new ApiError(404, 'User not found.');
            }
            ResponseHandler.success(request, response, 'User Unbanned successfully!', 200, null);
        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    // getCurrentApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
    //         request.context = 'Client.GetApiKey';

    //         //await this._authorizer.authorize(request, response);

    //         const verificationModel = await ApiClientValidator.getOrRenewApiKey(request);

    //         const apiKeyDto = await this._service.getApiKey(verificationModel);
    //         if (apiKeyDto == null) {
    //             throw new ApiError(400, 'Unable to retrieve client api key.');
    //         }
    //         ResponseHandler.success(request, response, 'Client api keys retrieved successfully!', 200, {
    //             ApiKeyDetails : apiKeyDto,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

    // renewApiKey = async (request: express.Request, response: express.Response): Promise<void> => {
    //     try {
    //         request.context = 'Client.RenewApiKey';

    //         //await this._authorizer.authorize(request, response);

    //         const verificationModel = await ApiClientValidator.getOrRenewApiKey(request);
    //         if (verificationModel.ValidFrom == null) {
    //             verificationModel.ValidFrom = new Date();
    //         }
    //         if (verificationModel.ValidTill == null) {
    //             const d = new Date();
    //             d.setFullYear(d.getFullYear() + 1);
    //             verificationModel.ValidTill = d;
    //         }
    //         const apiKeyDto = await this._service.renewApiKey(verificationModel);
    //         if (apiKeyDto == null) {
    //             throw new ApiError(400, 'Unable to renew client api key.');
    //         }
    //         ResponseHandler.success(request, response, 'Client api keys renewed successfully!', 200, {
    //             ApiKeyDetails : apiKeyDto,
    //         });
    //     } catch (error) {
    //         ResponseHandler.handleError(request, response, error);
    //     }
    // };

}

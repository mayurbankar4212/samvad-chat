import express from 'express';
import { ApiError } from '../../common/api.error';
import { ResponseHandler } from '../../common/response.handler';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { GroupChatService } from '../../services/group.chat.service';
import { Loader } from '../../startup/loader';
import { GroupChatValidator } from './group.chat.validator';
import { BaseController } from '../base.controller';
import { PeerConversationDomainModel } from '../../domain.types/chat/conversation.domain.model';
import { request } from 'http';
import { bool } from 'aws-sdk/clients/signer';

///////////////////////////////////////////////////////////////////////////////////////

export class GroupChatController extends BaseController {

    //#region member variables and constructors

    _service: GroupChatService = null;

    _validator = new GroupChatValidator();

    constructor() {
        super();
        this._service = Loader.container.resolve(GroupChatService);
    }

    //#endregion

    //#region Action methods
    createGroup = async (request: express.Request, response: express.Response): Promise<void> => {
        try {

            await this.setContext('Chat.CreateGroup', request);

            const domainModel = await this._validator.createGroup(request);
            const conversation = await this._service.createGroup(domainModel);
            if (conversation == null) {
                throw new ApiError(400, 'Cannot start conversation!');
            }

            ResponseHandler.success(request, response, 'Conversation started successfully!', 201, {
                Conversation : conversation,
            });

        } catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    };

    sendGroupMessage = async (request: express.Request, response: express.Response): Promise<void>=>{
        try {
            await this.setContext('Chat.SendGroupMessage', request);

            const domainModel = await this._validator.sendGroupMessage(request);
            const ChatMessage = await this._service.sendGroupMessage(domainModel);

            if (ChatMessage === null){
                throw new ApiError(500,'Error sending group message');
            }
            ResponseHandler.success(request, response,'Message send successfully!', 201, ChatMessage);
        }
        catch (error) {
            ResponseHandler.handleError(request, response, error);
        }
    }

    getGroupConversationMessages = async (request: express.Request, response: express.Response):Promise<void>=>{
        try {
            await this.setContext('Chat.GetGroupConversationMessages',request);

            const conversationId = await this._validator.getParamUuid(request,'conversationId');
            const messages = await this._service.getGroupConversationMessages(conversationId);
            if (messages === null){
                throw new ApiError(500,'Conversation not found');
            }
            ResponseHandler.success(request,response,'Conversation retrieved successfully!',200,messages);
        }
        catch (error){
            ResponseHandler.handleError(request, response, error);
        }
    }

    getGroupConversationById = async (request: express.Request,response:express.Response): Promise<void>=>{
        try {
            await this.setContext('Chat.GetGroupConversation',request);
            const conversationId = await this._validator.getParamUuid(request,'conversationId');
            const conversation = await this._service.getGroupConversationById(conversationId);
            if (conversation == null){
                throw new ApiError(404,'Group Conversation not found');
            }
            ResponseHandler.success(request,response,'Conversation retrieved successfully!', 200,conversation);
        }
        catch (error){
            ResponseHandler.handleError(request, response, error);
        }
    }

    updateGroupConversation =async (request: express.Request,response:express.Response):Promise<void>=>{
        try {
            await this.setContext('Chat.UpdateGroupConversation',request);

            const conversationId = await this._validator.getParamUuid(request,'conversationId');
            const userId = await this._validator.getParamUuid(request,'userId');
            const domainModel = await this._validator.updateGroupConversation(request);
            const isGroupAdmin : boolean = await this._service.isGroupAdmin(conversationId,userId);
            if (isGroupAdmin === false) {
                throw new ApiError(404,'Only group admin are allowed');
            }
            const conversation = await this._service.updateGroupConversation(conversationId,userId,domainModel);
            if (conversation == null){
                throw new ApiError(404,'Group Conversation not found');
            }
            ResponseHandler.success(request,response,'Group Conversation updated successfully',200,conversation);

        }
        catch (error){
            ResponseHandler.handleError(request, response, error);
        }

    };

    deleteGroupConversation = async(request: express.Request,response:express.Response): Promise<void>=>{
        try {
            await this.setContext('Chat.DeleteGroupConversation',request);

            const conversationId = await this._validator.getParamUuid(request,'conversationId');
            const deteted = await this._service.deleteGroupConversation(conversationId);
            if (!deteted){
                throw new ApiError(400,'Group Conversation cannot be deleted.');
            }
            ResponseHandler.success(request,response,'Group conversation record deleted successfully',200,{ Deleted: true });
        }
        catch (error){
            ResponseHandler.handleError(request, response, error);
        }
    }

    addUsersToGroupConversation= async (request:express.Request,respose:express.Response): Promise<void>=>{
        try {
            await this.setContext('Chat.AddUsersToGroupConversation',request);

            const conversationId = await this._validator.getParamUuid(request,'conversationId');
            const userId = await this._validator.getParamUuid(request,'userId');
            const isGroupAdmin : boolean = await this._service.isGroupAdmin(conversationId,userId);
            if (isGroupAdmin === false) {
                throw new ApiError(404,'Only group admin can add users to groups');
            }
            
            const domainModel = await this._validator.addUsersToGroupConversation(request);
            const conversation = await this._service.addUsersToGroupConversation(domainModel,conversationId,userId);

            if (conversation == null){
                throw new ApiError(400, 'Cannot add users!');
            }
            ResponseHandler.success(request,respose,'Users added successfully',200,{
                Conversation : conversation,
            });
        }
        catch (error){
            ResponseHandler.handleError(request,respose,error);
        }
    }

    getGroupMessage = async (request:express.Request, response:express.Response):Promise<void>=>{
        try {
            await this.setContext('Chat.GetGroupMessage',request);

            const messageId = await this._validator.getParamUuid(request,'messageId');
            const message = await this._service.getGroupMessage(messageId);
            if (message == null){
                throw new ApiError(500,'Message not found');
            }
            ResponseHandler.success(request,response,'Message retrieved successfully',200,{
                Message : message
            });
        }
        catch (error){
            ResponseHandler.handleError(request,response,error);
        }
    }

    updateGroupMessage = async (request:express.Request, response:express.Response):Promise<void>=>{
        try {
            await this.setContext('Chat.GetGroupMessage',request);

            const messageId = await this._validator.getParamUuid(request,'messageId');
            const domainModel = await this._validator.UpdateGroupMessage(request);
            const updatedMessage = await this._service.updateGroupMessage(messageId,domainModel);
            if (updatedMessage == null){
                throw new ApiError(500,'Message not found');
            }
            ResponseHandler.success(request,response,"Message updated successfully",200,{
                Message : updatedMessage
            });
        }
        catch (error){
            ResponseHandler.handleError(request,response,error);
        }
    }

    deteteGroupMessage = async (request:express.Request, response:express.Response):Promise<void> =>{
        try {
            await this.setContext('Chat.deleteGroupMessage',request);

            const messageId = await this._validator.getParamUuid(request,'messageId');
            const deleted:boolean = await this._service.deleteGroupMessage(messageId);

            if (!deleted){
                throw new ApiError(500,'Error in deleting group message');
            }
            ResponseHandler.success(request, response, 'Message deleted successfully',200,{
                Deleted : deleted } );
        }
        catch (error) {
            ResponseHandler.handleError(request,response,error);
        }
    };

    getRecentConversationsForUser = async (request:express.Request, response:express.Response):Promise<void>=>{
        try {
            await this.setContext('Chat.GetRecentConversationsForUser',request);

            const userId = await this._validator.getParamUuid(request,'userId');
            const recentConversation = await this._service.getRecentConversationForUser(userId);
            if (recentConversation == null){
                throw new ApiError(500,'No recent conversation');
            }
            ResponseHandler.success(request, response, 'Recent conversation retrieved successfully',200,{
                RecentConversation : recentConversation
            });
        }
        catch (error){
            ResponseHandler.handleError(request, response, error);
        }
    }

    makeGroupAdmin = async (request:express.Request, response:express.Response):Promise<void> =>{
        try {
            await this.setContext('Chat.MakeGroupAdmin',request);

            const adminId = await this._validator.getParamUuid(request,'adminId');
            const conversationId = await this._validator.getParamUuid(request,'conversationId');
            const userId = await this._validator.getParamUuid(request,'userId');

            let isGroupAdmin : boolean = await this._service.isGroupAdmin(conversationId,adminId);
            if (isGroupAdmin === false) {
                throw new ApiError(404,'You are not a group admin, only Admin can set group admin');
            }
            isGroupAdmin = await this._service.isGroupAdmin(conversationId,userId);
            if (isGroupAdmin === true) {
                throw new ApiError(404,'You are already group admin');
            }
            const updateAdmin = await this._service.makeGroupAdmin(conversationId,userId);
            if (updateAdmin === false) {
                throw new ApiError(404,'Error creating group admin');
            }
            ResponseHandler.success(request,response,'Set Admin successfully',200,{
                UpdaedAdmin : updateAdmin
            });
        }
        catch (error) {
            ResponseHandler.handleError(request,response,error);
        }
    }
}


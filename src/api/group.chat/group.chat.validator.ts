import express from 'express';
import { GroupConversationDomainModel, AddUsersToGroupDomainModel } from '../../domain.types/chat/conversation.domain.model';
import { ChatMessageDomainModel } from '../../domain.types/chat/chat.message.domain.model';
import { BaseValidator, Where } from '../base.validator';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { ConversationSearchFilters } from '../../domain.types/chat/conversation.search.types';
import { ParticipantDomainModel } from '../../domain.types/chat/participant.domain.model';
import { Group } from 'aws-sdk/clients/budgets';
import { ExperiencesSummary } from 'aws-sdk/clients/kendra';
// import PeerConversation from 'src/database/sql/sequelize/models/chat/peer.conversation.model';
///////////////////////////////////////////////////////////////////////////////////////

export class GroupChatValidator extends BaseValidator {

    constructor() {
        super();
    }
    
    private validateGroupCreateBody = async (request:express.Request)=>{
        await this.validateString(request,'GroupName',Where.Body,true,true);
        await this.validateUuid(request,'InitiatingUserId',Where.Body,true,false);
        //await this.validateString(request,'ListOfUsers',Where.Body,true,false);
        await this.validateObject(request,'ListOfUsers',Where.Body,true,false);
        await this.validateString(request,'GroupIcon',Where.Body,false,true);
        await this.validateString(request,'Description',Where.Body,false,true);
        await this.validateString(request,'GroupType',Where.Body,true,false);
        await this.validateRequest(request);
    }

    validateGroupConversationUpdateBody = async (request:any) => {
        await this.validateString(request,'GroupName',Where.Body,false,true);
        await this.validateString(request,'GroupIcon',Where.Body,false,true);
        await this.validateString(request,'Description',Where.Body,false,true);
        await this.validateString(request,'GroupType',Where.Body,false,false);
        await this.validateRequest(request);
    }

    validateGroupMessageCreateBody = async (request:express.Request)=>{
        await this.validateUuid(request,'conversationId',Where.Param,true,false);
        await this.validateUuid(request,'SenderId',Where.Body,true,false);
        await this.validateString(request,'Message',Where.Body,true,false);
        await this.validateUuid(request,'FileResourceId',Where.Body,false,true);
        await this.validateString(request,'MessageType',Where.Body,true,false);
        await this.validateString(request,'ConversationType',Where.Body,true,false);
        await this.validateUuid(request,'BaseMessageThreadId',Where.Body,false,true);
        await this.validateRequest(request);

    }

    validateAddUsersCreateBody = async(request:express.Request)=>{
        await this.validateObject(request,'ListOfUsers',Where.Body,true,false);
        await this.validateRequest(request);
    }

    validateUpdateGroupMessageCreateBody =async(request)=>{
        await this.validateString(request,'Message',Where.Body,true,false);
        await this.validateRequest(request);
    }

    private getCreateConversationDomainModel(requestBody:any):GroupConversationDomainModel{
        const createModel : GroupConversationDomainModel = {
            GroupName            : requestBody.GroupName,
            InitiatingUserId     : requestBody.InitiatingUserId,
            ListOfUsers          : JSON.stringify(requestBody.ListOfUsers),
            GroupIcon            : requestBody.GroupIcon ?? null,
            Description          : requestBody.Description ?? null,
            GroupType            : requestBody.GroupType ?? null,
            LastMessageTimestamp : requestBody.LastMessageTimestamp ?? null,
        };
        return createModel;
    }

    private getUpdateConversationDomainModel(requestBody:any):GroupConversationDomainModel{
        const createModel : GroupConversationDomainModel = {
            GroupName   : requestBody.GroupName ?? null,
            GroupIcon   : requestBody.GroupIcon ?? null,
            Description : requestBody.Description ?? null,
            GroupType   : requestBody.GroupType ?? null,
        };
        return createModel;
    }

    getCreateGroupMessageDomainModel =async (requestBody:any, conversationId:uuid): Promise<ChatMessageDomainModel> => {
        const model : ChatMessageDomainModel = {
            SenderId            : requestBody.SenderId,
            Message             : requestBody.Message,
            PeerConversationId  : requestBody.PeerConversationId ?? null,
            GroupConversationId : conversationId,
            FileResourceId      : requestBody.FileResourceId ?? null,
            MessageType         : requestBody.MessageType,
            ConversationType    : requestBody.ConversationType,
            BaseMessageThreadId : requestBody.BaseMessageThreadId ?? null,
        };
        return model;
    }

    getAddUsersToGroupDomainModel = async (requestBody:any):Promise<AddUsersToGroupDomainModel>=>{
        const model : AddUsersToGroupDomainModel = {
            ListOfUsers : JSON.stringify(requestBody.ListOfUsers),
        };

        return model;
    }

    getUpdateGroupMessageDomainModel = async (requestBody:any):Promise<ChatMessageDomainModel>=>{
        const model : ChatMessageDomainModel = {
            Message : requestBody.Message,
        };
        return model;
    }

    createGroup = async (request: express.Request): Promise<GroupConversationDomainModel> => {
        await this.validateGroupCreateBody(request);
        return this.getCreateConversationDomainModel(request.body);
    };

    sendGroupMessage = async (request: express.Request): Promise<ChatMessageDomainModel> => {
        await this.validateGroupMessageCreateBody(request);
        return this.getCreateGroupMessageDomainModel(request.body,request.params.conversationId);
    }

    updateGroupConversation = async (request:express.Request):Promise<GroupConversationDomainModel> => {
        await this.validateGroupConversationUpdateBody(request);
        return this.getUpdateConversationDomainModel(request.body);
    }

    addUsersToGroupConversation = async (request:express.Request):Promise<AddUsersToGroupDomainModel>=>{
        await this.validateAddUsersCreateBody(request);
        return this.getAddUsersToGroupDomainModel(request.body);
    }
    
    UpdateGroupMessage =async(request:express.Request):Promise<ChatMessageDomainModel>=>{
        await this.validateUpdateGroupMessageCreateBody(request);
        return this.getUpdateGroupMessageDomainModel(request.body);
    }

}

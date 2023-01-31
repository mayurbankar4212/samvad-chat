import express from 'express';
import { PeerConversationDomainModel } from '../../domain.types/chat/conversation.domain.model';
import { ChatMessageDomainModel } from '../../domain.types/chat/chat.message.domain.model';
import { BaseValidator, Where } from '../base.validator';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { ConversationSearchFilters } from '../../domain.types/chat/conversation.search.types';
import { ParticipantDomainModel } from '../../domain.types/chat/participant.domain.model';
///////////////////////////////////////////////////////////////////////////////////////

export class ChatValidator extends BaseValidator {

    constructor() {
        super();
    }

    getCreateConversationDomainModel = (requestBody: any): PeerConversationDomainModel => {

        const createModel: PeerConversationDomainModel = {
            //IsGroupConversation : requestBody.IsGroupConversation ?? false,
            Topic            : requestBody.Topic ?? null,
            //Marked           : requestBody.Marked ?? false,
            InitiatingUserId : requestBody.InitiatingUserId,
            OtherUserId      : requestBody.OtherUserId,
            //Users               : requestBody.Users ?? null,
        };

        return createModel;
    };

    getUpdateConversationDomainModel = (requestBody: any): PeerConversationDomainModel => {

        const updateModel: PeerConversationDomainModel = {
            Topic  : requestBody.Topic ?? null,
            Marked : requestBody.Marked ?? null,
        };

        return updateModel;
    };

    getCreateParticipantDomainModel = (requestBody: any): ParticipantDomainModel => {
        const participant:ParticipantDomainModel = {
            ConversationType : requestBody.ConversationType,
            IsAdmin          : requestBody.IsAdmin
        };

        return participant;
    }

    private async validatePeerConversationCreateBody(request) {
        //await this.validateBoolean(request, 'IsGroupConversation', Where.Body, false, false);
        await this.validateString(request, 'Topic', Where.Body, false, true);
        //await this.validateBoolean(request, 'Marked', Where.Body, false, false);
        await this.validateUuid(request, 'OtherUserId', Where.Body, true, false);
        //await this.validateArray(request, 'Users', Where.Body, false, false);
        await this.validateRequest(request);
    }

    private async validateConversationUpdateBody(request) {
        await this.validateString(request, 'Topic', Where.Body, false, false);
        await this.validateBoolean(request, 'Marked', Where.Body, false, false);
        await this.validateRequest(request);
    }

    startConversation = async (request: express.Request): Promise<PeerConversationDomainModel> => {
        await this.validatePeerConversationCreateBody(request);
        return this.getCreateConversationDomainModel(request.body);
    };

    updateConversation = async (request: express.Request): Promise<PeerConversationDomainModel> => {
        await this.validateConversationUpdateBody(request);
        const domainModel = this.getUpdateConversationDomainModel(request.body);
        domainModel.id = await this.getParamUuid(request, 'conversationId');
        return domainModel;
    };

    addUserToConversation = async (request: express.Request): Promise<ParticipantDomainModel>=>{
        await this.validateParticipantCreateBody(request);
        const domainModel = await this.getCreateParticipantDomainModel(request.body);
        return domainModel;
    }

    validateParticipantCreateBody = async (request: express.Request)=>{
        await this.validateString(request, 'ConversationType', Where.Body, true, false);
        await this.validateBoolean(request, 'IsAdmin', Where.Body, false, false);
        await this.validateRequest(request);
    }

    getCreateMessageDomainModel =
        (requestBody: any, conversationId: uuid): ChatMessageDomainModel => {

            const createModel: ChatMessageDomainModel = {
                PeerConversationId  : conversationId ?? null,
                GroupConversationId : requestBody.GroupConversationId ?? null,
                FileResourceId      : requestBody.FileResourceId ?? null,
                SenderId            : requestBody.SenderId,
                Message             : requestBody.Message ?? null,
                MessageType         : requestBody.MessageType,
                ConversationType    : requestBody.ConversationType,
                BaseMessageThreadId : requestBody.BaseMessageThreadId ?? null
            };

            return createModel;
        };

    getUpdateMessageDomainModel = (requestBody: any): ChatMessageDomainModel => {

        const updateModel: ChatMessageDomainModel = {
            Message : requestBody.Message ?? null,
        };

        return updateModel;
    };

    private async validateMessageCreateBody(request) {
        await this.validateUuid(request, 'SenderId', Where.Body, true, false);
        await this.validateString(request, 'Message', Where.Body, true, false);
        await this.validateUuid(request, 'PeerConversationId', Where.Body, false, true);
        await this.validateUuid(request, 'GroupConversationId', Where.Body, false, true);
        await this.validateUuid(request, 'FileConversationId', Where.Body, false, true);
        await this.validateString(request,'MessageType', Where.Body, true, false);
        await this.validateString(request,'ConversationType', Where.Body, true, false);
        await this.validateUuid(request, 'BaseMessageThreadId', Where.Body, false, true);
        await this.validateRequest(request);
    }

    private async validateMessageUpdateBody(request) {
        await this.validateString(request, 'Message', Where.Body, true, false);
        await this.validateRequest(request);
    }

    sendMessage = async (request: express.Request): Promise<ChatMessageDomainModel> => {
        await this.validateMessageCreateBody(request);
        return this.getCreateMessageDomainModel(
            request.body, request.params.conversationId);
    };

    updateMessage = async (request: express.Request): Promise<ChatMessageDomainModel> => {
        await this.validateMessageUpdateBody(request);
        const domainModel = this.getUpdateMessageDomainModel(request.body);
        domainModel.id = await this.getParamUuid(request, 'messageId');
        return domainModel;
    };

    private async validateConversationSearchFilters(request) {
        //await this.validateBoolean(request, 'IsGroupConversation', Where.Body, false, false);
        await this.validateString(request, 'Topic', Where.Body, false, false);
        //await this.validateBoolean(request, 'Marked', Where.Body, false, false);
        await this.validateArray(request, 'Users', Where.Body, true, false);
        await this.validateRequest(request);
    }

    getConversationSearchFilters = (request: express.Request): ConversationSearchFilters => {

        var filters: ConversationSearchFilters = {
            CurrentUserId       : request.params.userId,
            OtherUserId         : request.query.otherUserId as uuid ?? null,
            IsGroupconversation : request.params.isGroupconversation === 'true' ? true : false,
        };

        return this.updateBaseSearchFilters(request, filters);
    };

    searchUserConversations = async (request: express.Request): Promise<ConversationSearchFilters> => {
        await this.validateConversationSearchFilters(request);
        const filters = this.getConversationSearchFilters(request);
        return filters;
    };

}

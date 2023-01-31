import { inject, injectable } from 'tsyringe';
import { IGroupChatRepo } from '../database/repository.interfaces/group.chat.repo.interface';
import {
    AddUsersToGroupDomainModel,
    GroupConversationDomainModel,
    PeerConversationDomainModel,
} from '../domain.types/chat/conversation.domain.model';
import { GroupConversationDto, RecentConversationDto } from '../domain.types/chat/group.conversation.dto';
import { ChatMessageDomainModel } from '../domain.types/chat/chat.message.domain.model';
import { ChatMessageDto } from '../domain.types/chat/chat.message.dto';
import { uuid } from '../domain.types/miscellaneous/system.types';
import { ConversationSearchFilters, ConversationSearchResults } from '../domain.types/chat/conversation.search.types';
import { ParticipantDomainModel } from '../domain.types/chat/participant.domain.model';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class GroupChatService {
    constructor(@inject('IGroupChatRepo') private _chatRepo: IGroupChatRepo) {}

    createGroup = async (model: GroupConversationDomainModel): Promise<GroupConversationDto> => {
        return this._chatRepo.createGroup(model);
    };

    sendGroupMessage = async (model: ChatMessageDomainModel): Promise<ChatMessageDto> => {
        return this._chatRepo.sendGroupMessage(model);
    };

    getGroupConversationMessages = async (conversationId: uuid): Promise<ChatMessageDto[]> => {
        return await this._chatRepo.getGroupConversationMessages(conversationId);
    };

    getGroupConversationById = async (conversationId: uuid): Promise<GroupConversationDto> => {
        return await this._chatRepo.getGroupConversationById(conversationId);
    };

    updateGroupConversation = async (
        conversationId: uuid,
        userId: uuid,
        model: GroupConversationDomainModel
    ): Promise<GroupConversationDto> => {
        return await this._chatRepo.updateGroupConversation(conversationId, userId, model);
    };

    isGroupAdmin = async (conversationId: uuid, userId: uuid): Promise<boolean> => {
        return await this._chatRepo.isGroupAdmin(conversationId, userId);
    };

    deleteGroupConversation = async (conversationId: uuid): Promise<boolean> => {
        return await this._chatRepo.deleteGroupConversation(conversationId);
    };

    addUsersToGroupConversation = async (
        domainModel: AddUsersToGroupDomainModel,
        conversationId: uuid,
        userId: uuid
    ): Promise<GroupConversationDto> => {
        return await this._chatRepo.addUsersToGroupConversation(domainModel, conversationId, userId);
    };

    getGroupMessage = async (messageId: uuid): Promise<ChatMessageDto> => {
        return await this._chatRepo.getGroupMessage(messageId);
    };

    updateGroupMessage = async (messageId: uuid, updates: ChatMessageDomainModel): Promise<ChatMessageDto> => {
        return await this._chatRepo.updateGroupMessage(messageId, updates);
    };

    deleteGroupMessage = async (messageId: uuid): Promise<boolean> =>{
        return await this._chatRepo.deleteGroupMessage(messageId);
    }

    getRecentConversationForUser = async (userId: uuid): Promise<RecentConversationDto[]> =>{
        return await this._chatRepo.getRecentConversationsForUser(userId);
    }

    makeGroupAdmin = async (conversationId:uuid,userId:uuid): Promise<boolean> => {
        return await this._chatRepo.makeGroupAdmin(conversationId,userId);
    }
}

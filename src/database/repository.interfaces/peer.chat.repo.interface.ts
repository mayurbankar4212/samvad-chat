import { PeerConversationDomainModel } from "../../domain.types/chat/conversation.domain.model";
import { ConversationDto } from "../../domain.types/chat/conversation.dto";
import { ChatMessageDomainModel } from "../../domain.types/chat/chat.message.domain.model";
import { ChatMessageDto } from "../../domain.types/chat/chat.message.dto";
import { ConversationSearchFilters, ConversationSearchResults } from "../../domain.types/chat/conversation.search.types";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { ParticipantDomainModel } from "../../domain.types/chat/participant.domain.model";

export interface IChatRepo {

    startConversation(model: PeerConversationDomainModel): Promise<ConversationDto>;

    sendMessage(model: ChatMessageDomainModel): Promise<ChatMessageDto>;

    getConversationMessages(conversationId: uuid): Promise<ChatMessageDto[]>;

    searchUserConversations(filters: ConversationSearchFilters): Promise<ConversationSearchResults>;

    getConversationById(conversationId: uuid): Promise<ConversationDto>;

    updateConversation(conversationId: uuid, updates: PeerConversationDomainModel): Promise<ConversationDto>;

    deleteConversation(conversationId: uuid): Promise<boolean>;

    addUserToConversation(model:ParticipantDomainModel): Promise<boolean>;

    removeUserFromConversation(conversationId: uuid, userId: uuid): Promise<boolean>;

    getConversationBetweenTwoUsers(firstUserId: uuid, secondUserId: uuid): Promise<ConversationDto>;

    getMessage(messageId: uuid): Promise<ChatMessageDto>;

    updateMessage(messageId: uuid, updates: ChatMessageDomainModel): Promise<ChatMessageDto>;

    deleteMessage(messageId: uuid): Promise<boolean>;

    // getMarkedConversationsForUser(userId: uuid): Promise<ConversationDto[]>;

    getRecentConversationsForUser(userId: uuid): Promise<ConversationDto[]>;

}

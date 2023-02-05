import { AddUsersToGroupDomainModel, ConversationParticipantDomainModel, GroupConversationDomainModel, PeerConversationDomainModel } from "../../domain.types/chat/conversation.domain.model";
import { ConversationDto } from "../../domain.types/chat/conversation.dto";
import { ChatMessageDomainModel } from "../../domain.types/chat/chat.message.domain.model";
import { ChatMessageDto } from "../../domain.types/chat/chat.message.dto";
import { ConversationSearchFilters, ConversationSearchResults } from "../../domain.types/chat/conversation.search.types";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { ParticipantDomainModel } from "../../domain.types/chat/participant.domain.model";
import { GroupConversationDto, RecentConversationDto } from "../../domain.types/chat/group.conversation.dto";

export interface IGroupChatRepo {

    createGroup (model: GroupConversationDomainModel):Promise<GroupConversationDto>;

    sendGroupMessage(model:ChatMessageDomainModel):Promise<ChatMessageDto>;

    getGroupConversationMessages(conversationId: uuid): Promise<ChatMessageDto[]>;

    getGroupConversationById(conversationId: uuid): Promise<GroupConversationDto>;
    
    updateGroupConversation(conversationId: uuid, userId:uuid,updates: GroupConversationDomainModel):
    Promise<GroupConversationDto>;

    isGroupAdmin (conversationId:uuid, userId:uuid):Promise<boolean>;

    deleteGroupConversation (conversationId:uuid): Promise<boolean>;

    addUsersToGroupConversation(model:AddUsersToGroupDomainModel,conversationId:uuid,UserId:uuid):
    Promise<GroupConversationDto>;

    getGroupMessage(messageId: uuid): Promise<ChatMessageDto>;

    updateGroupMessage(messageId: uuid, updates: ChatMessageDomainModel): Promise<ChatMessageDto>;

    deleteGroupMessage(messageId: uuid): Promise<boolean>;

    getRecentConversationsForUser(userId: uuid): Promise<RecentConversationDto[]>;

    makeGroupAdmin(model:ConversationParticipantDomainModel, conversationId:uuid): Promise<boolean>;

    dismissAsAdmin(model:ConversationParticipantDomainModel, conversationId:uuid):Promise<boolean>;

    removeUserFromGroupConversation(mode:ConversationParticipantDomainModel):Promise<GroupConversationDto>;

}

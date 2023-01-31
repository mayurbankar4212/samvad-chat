import { DateTime } from "aws-sdk/clients/devicefarm";
import { uuid } from "../miscellaneous/system.types";

export interface ChatMessageDomainModel {
    id?            : uuid;
    SenderId?      : uuid;
    Message?       : string;
    PeerConversationId?: uuid;
    GroupConversationId?: uuid;
    FileResourceId?: uuid;
    MessageType?: string;
    ConversationType?: string;
    BaseMessageThreadId?: uuid;
    CreatedAt?:Date,
    UpdatedAt?: Date,
}

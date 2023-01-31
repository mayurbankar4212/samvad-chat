import { uuid } from "../miscellaneous/system.types";

export interface PeerConversationDomainModel {
    id?                 : uuid;
    Topic?              : string;
    Marked?             : boolean;
    InitiatingUserId?   : uuid;
    OtherUserId?        : uuid;
    LastMessageTimestamp?: Date,
}

export interface GroupConversationDomainModel {
    id? : uuid;
    GroupName? : string;
    InitiatingUserId? : uuid;
    ListOfUsers? : string;
    GroupIcon? : string |null;
    Description? : string | null;
    GroupType?:string;
    LastMessageTimestamp?: Date | null;
}

export interface ConversationParticipantDomainModel {
    UserId? : uuid;
    ConversationType? : string;
    IsAdmin? : boolean;
    PeerCoversationId? : uuid;
    GroupConversationId? : uuid;
}

export interface AddUsersToGroupDomainModel{
    // GroupConversationId? : uuid;
    // UserId? : uuid;
    ListOfUsers? : string;
}

export interface RecentConversationDomainModel {
    ConversationId? : uuid;
    LastMessageTimestamp?: Date;
}
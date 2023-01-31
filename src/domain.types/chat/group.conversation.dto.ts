import { uuid } from "../miscellaneous/system.types";

export interface GroupConversationDto {
    id?:uuid;
    GroupName? : string;
    InitiatingUserId? : uuid;
    ListOfUsers? : string;
    GroupIcon? : string;
    Description? : string;
    GroupType?:string;
    LastMessageTimeStamp?: Date,
}

export interface RecentConversationDto {
    ConversationId? : uuid;
    LastMessageTimestamp?: Date;
}
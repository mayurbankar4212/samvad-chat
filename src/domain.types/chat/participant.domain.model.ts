import { uuid } from '../miscellaneous/system.types';

export interface ParticipantDomainModel {
    id?: uuid;
    UserId?: uuid;
    ConversationType?: string;
    IsAdmin?: boolean;
    PeerConversationId?: uuid;
    GroupConversationId?: uuid;
}

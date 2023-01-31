import { uuid } from '../../../../domain.types/miscellaneous/system.types';
import { ConversationDto } from '../../../../domain.types/chat/conversation.dto';
import { GroupConversationDto, RecentConversationDto } from '../../../../domain.types/chat/group.conversation.dto';
import Conversation from '../models/chat/peer.conversation.model';
import { ConversationParticipantDomainModel, GroupConversationDomainModel, PeerConversationDomainModel, RecentConversationDomainModel } from '../../../../domain.types/chat/conversation.domain.model';
import ConversationParticipant from '../models/chat/conversation.participant.model';

///////////////////////////////////////////////////////////////////////////////////

export class ChatMapper {

    static toDto = (conversation: Conversation, users?: uuid[]): ConversationDto => {
        if (conversation == null){
            return null;
        }

        const dto: ConversationDto = {
            id                   : conversation.id,
            //IsGroupConversation  : conversation.IsGroupConversation,
            //Marked               : conversation.Marked,
            InitiatingUserId     : conversation.InitiatingUserId,
            OtherUserId          : conversation.OtherUserId,
            Topic                : conversation.Topic,
            Users                : users ?? null,
            LastMessageTimestamp : conversation.LastMessageTimestamp,
        };
        return dto;
    };

    static toGroupConversationDto = (conversation: GroupConversationDomainModel, users?:uuid[]):
    GroupConversationDto=> {
        if (conversation === null){
            return null;
        }
        const dto: GroupConversationDto = {
            id                   : conversation.id,
            GroupName            : conversation.GroupName,
            InitiatingUserId     : conversation.InitiatingUserId,
            ListOfUsers          : JSON.parse(conversation.ListOfUsers),
            GroupIcon            : conversation.GroupIcon,
            Description          : conversation.Description,
            GroupType            : conversation.GroupType,
            LastMessageTimeStamp : conversation.LastMessageTimestamp
        };
        return dto;
    }

    static getCreateGroupConversationParticipantsDomainModel = async (conversation: GroupConversationDomainModel)
    :Promise<ConversationParticipantDomainModel[]>=>{
        const users:ConversationParticipantDomainModel[] = [];
        const listOfUsers:string[] = JSON.parse(conversation.ListOfUsers);
        users.push({
            UserId              : conversation.InitiatingUserId,
            ConversationType    : 'GROUP',
            IsAdmin             : true,
            GroupConversationId : conversation.id
        });
        for (const user of Object.values(listOfUsers)){
            users.push({
                UserId              : user,
                ConversationType    : 'GROUP',
                IsAdmin             : false,
                GroupConversationId : conversation.id
            });
        }
        return users;
    }

    static getRecentConversationDomainModel = (conversations):RecentConversationDomainModel[] =>{
        if (conversations == null){
            return null;
        }
        const recentConversations: RecentConversationDomainModel[] = conversations.map(x =>
        {
            return { ConversationId: x.id, LastMessageTimestamp: x.LastMessageTimestamp };
        });
        return recentConversations;
    }

    static toRecentConversationDto = (recentConversations:RecentConversationDomainModel[]):RecentConversationDto[] =>{
        if (recentConversations == null){
            return null;
        }
        const dto:RecentConversationDto[] = [];
        for (const conversation of recentConversations){
            const entity: RecentConversationDto = {
                ConversationId       : conversation.ConversationId,
                LastMessageTimestamp : conversation.LastMessageTimestamp
            };
            dto.push(entity);
        }
        return dto;
    }

}

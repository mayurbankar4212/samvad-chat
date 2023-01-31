import { ChatMessageDto } from "../../../../domain.types/chat/chat.message.dto";
import { ChatMessageDomainModel } from "../../../../domain.types/chat/chat.message.domain.model";
import PeerConversation from "../models/chat/peer.conversation.model";

export class ChatMessageMapper {

    static toDto(message:ChatMessageDomainModel):ChatMessageDto {
        if (message === null){
            return null;
        }
        const messageDto :ChatMessageDto = {
            id                  : message.id,
            SenderId            : message.SenderId,
            Message             : message.Message,
            PeerConversationId  : message.PeerConversationId ,
            GroupConversationId : message.GroupConversationId,
            FileResourceId      : message.FileResourceId,
            MessageType         : message.MessageType,
            ConversationType    : message.ConversationType,
            BaseMessageThreadId : message.BaseMessageThreadId,
        };
        return messageDto;
    }

    static toMessageDto(messages: ChatMessageDomainModel[]):ChatMessageDto[]{
        const dto :ChatMessageDto[] = [];
        if (messages === null){
            return null;
        }

        for (const message of messages){
            const entity = {
                id                  : message.id,
                SenderId            : message.SenderId,
                Message             : message.Message,
                PeerConversationId  : message.PeerConversationId ,
                GroupConversationId : message.GroupConversationId,
                FileResourceId      : message.FileResourceId,
                MessageType         : message.MessageType,
                ConversationType    : message.ConversationType,
                BaseMessageThreadId : message.BaseMessageThreadId,
                CreatedAt           : message.CreatedAt
            };
            dto.push(entity);
        }
        return dto;
    }

}

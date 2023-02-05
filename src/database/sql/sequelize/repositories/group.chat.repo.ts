import { json, Model, Op } from 'sequelize';
import { ChatMessageDomainModel } from '../../../../domain.types/chat/chat.message.domain.model';
import { ChatMessageDto } from '../../../../domain.types/chat/chat.message.dto';
import { AddUsersToGroupDomainModel, ConversationParticipantDomainModel, GroupConversationDomainModel } from '../../../../domain.types/chat/conversation.domain.model';
import { GroupConversationDto, RecentConversationDto } from '../../../../domain.types/chat/group.conversation.dto';
import { ConversationSearchFilters, ConversationSearchResults } from '../../../../domain.types/chat/conversation.search.types';
import { ApiError } from '../../../../common/api.error';
import { Logger } from '../../../../common/logger';
import { IGroupChatRepo } from '../../../repository.interfaces/group.chat.repo.interface';
import Conversation from '../models/chat/blocked.user..model';
import ChatMessage from '../models/chat/chat.message.model';
import ConversationParticipant from '../models/chat/conversation.participant.model';
import { ChatMapper } from '../mappers/chat.mapper';
import { uuid, ConversationType } from '../../../../domain.types/miscellaneous/system.types';
import PeerConversation from '../models/chat/peer.conversation.model';
import { ParticipantDomainModel } from '../../../../domain.types/chat/participant.domain.model';
import GroupConversation from '../models/chat/group.conversation.model';
import { ChatMessageMapper } from '../mappers/chat.message.mapper';
import { use } from 'chai';

///////////////////////////////////////////////////////////////////////

export class GroupChatRepo implements IGroupChatRepo {

    createGroup =async (model: GroupConversationDomainModel):Promise<GroupConversationDto>=>{
        try {
            const entity = {
                GroupName            : model.GroupName,
                InitiatingUserId     : model.InitiatingUserId,
                ListOfUsers          : model.ListOfUsers,
                GroupIcon            : model.GroupIcon,
                Description          : model.Description,
                GroupType            : model.GroupType,
                LastMessageTimestamp : model.LastMessageTimestamp,
            };
            const conversation = await GroupConversation.create(entity);
            
            const ConversationParticipants =
            await ChatMapper.getCreateGroupConversationParticipantsDomainModel(conversation);
            for (const paticipant of ConversationParticipants) {
                const entity = {
                    UserId              : paticipant.UserId,
                    ConversationType    : paticipant.ConversationType,
                    IsAdmin             : paticipant.IsAdmin,
                    GroupConversationId : paticipant.GroupConversationId,
                };
                await ConversationParticipant.create(entity);
            }

            return ChatMapper.toGroupConversationDto(conversation);
        }
        catch (error){
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    sendGroupMessage = async(Model : ChatMessageDomainModel):Promise<ChatMessageDomainModel>=>{
        try {
            const entity = {
                SenderId            : Model.SenderId,
                Message             : Model.Message,
                PeerConversationId  : Model.PeerConversationId ,
                GroupConversationId : Model.GroupConversationId,
                FileResourceId      : Model.FileResourceId,
                MessageType         : Model.MessageType,
                ConversationType    : Model.ConversationType,
                BaseMessageThreadId : Model.BaseMessageThreadId,
            };
            const chatMessage = await ChatMessage.create(entity);

            const conversation = await GroupConversation.findByPk(Model.GroupConversationId);
            if (conversation) {
                conversation.LastMessageTimestamp = new Date();
            }
            await conversation.save();

            return ChatMessageMapper.toDto(chatMessage);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    getGroupConversationMessages = async (conversationId:uuid):Promise<ChatMessageDto[]> => {
        try {
            const message = await ChatMessage.findAll({
                where : {
                    GroupConversationId : conversationId,
                },
                order : [['CreatedAt','DESC']],
                limit : 100,
            });
            return ChatMessageMapper.toMessageDto(message);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    getGroupConversationById=async (conversationId: string): Promise<GroupConversationDto>=> {
        try {
            const conversation = await GroupConversation.findOne({
                where : {
                    id : conversationId,
                }
            });

            return ChatMapper.toGroupConversationDto(conversation);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    updateGroupConversation = async (conversationId:uuid, userId:uuid,model:GroupConversationDomainModel):
    Promise<GroupConversationDto>=>{
        try {
            const conversation = await GroupConversation.findOne({
                where : {
                    id : conversationId
                }
            });
            if (model.GroupName){
                conversation.GroupName = model.GroupName;
            }
            if (model.GroupIcon){
                conversation.GroupIcon = model.GroupIcon;
            }
            if (model.Description){
                conversation.Description = model.Description;
            }
            // if (!model.GroupType){
            //     conversation.GroupType = model.GroupType;
            // }

            conversation.save();
            return ChatMapper.toGroupConversationDto(conversation);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    isGroupAdmin = async (conversationId:uuid, userId:uuid):Promise<boolean> => {
        try {
            const participant = await ConversationParticipant.findOne({
                where : {
                    GroupConversationId : conversationId,
                    UserId              : userId
                }
            });
            return participant.IsAdmin;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    deleteGroupConversation =async (conversationId: string): Promise<boolean> =>{
        try {
            const totalDeleted = await ConversationParticipant.destroy({
                where : {
                    GroupConversationId : conversationId,
                }
            });
            Logger.instance().log(`Participants deleted: ${totalDeleted}`);
            const deleted = await GroupConversation.destroy({
                where : {
                    id : conversationId,
                }
            });
            return deleted > 0;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }

    }

    addUsersToGroupConversation = async(domainModel:AddUsersToGroupDomainModel,conversationId:uuid,userId:uuid):
    Promise<GroupConversationDto>=>{
        try {
            const conversation = await GroupConversation.findOne({
                where : {
                    id : conversationId,
                }
            });
            
            const existingUserIds:string[] = JSON.parse(conversation.ListOfUsers);
            const newUserIds:string[] = JSON.parse(domainModel.ListOfUsers);
            const updatedUserIds = Array.from(new Set(existingUserIds.concat(newUserIds)));
            
            conversation.ListOfUsers = JSON.stringify(updatedUserIds);
            conversation.save();

            for (const userId of updatedUserIds) {
                if (existingUserIds.indexOf(userId) === -1){
                    const entity = {
                        UserId              : userId,
                        ConversationType    : ConversationType.GROUP,
                        GroupConversationId : conversationId,
                    };
                    await ConversationParticipant.create(entity);
                }
            }

            // const updatedConversation = await GroupConversation.findOne({
            //     where : {
            //         id : conversationId,
            //     }
            // });
            return ChatMapper.toGroupConversationDto(conversation);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    getGroupMessage= async(messageId: uuid): Promise<ChatMessageDto>=> {
        try {
            const message = await ChatMessage.findByPk(messageId);
            return ChatMessageMapper.toDto(message);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }
    
    updateGroupMessage= async(messageId: uuid, updates: ChatMessageDomainModel): Promise<ChatMessageDto>=> {
        try {
            const message = await ChatMessage.findOne({
                where : {
                    id : messageId
                }
            });
            if (updates.Message) {
                message.Message = updates.Message;
            }
            await message.save();
            return ChatMessageMapper.toDto(message);
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    deleteGroupMessage = async (messageId: string): Promise<boolean> =>{
        try {
            const totalDeleted = await ChatMessage.destroy({
                where : {
                    id : messageId
                }
            });
        
            return totalDeleted > 0;
        }
        catch (error){
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }

    }

    getRecentConversationsForUser= async (userId: string): Promise<RecentConversationDto[]> => {
        try {
            const peerConversations = await this.getPeerConversationIds(userId);

            const conversationParticipants = await this.getConversationParticipantById(userId);

            const groupConversations:GroupConversation[] = [];
            for (const groupConversation of conversationParticipants) {
                const Conversation = await GroupConversation.findByPk(groupConversation.GroupConversationId);
                if (Conversation != null){
                    groupConversations.push(Conversation);
                }
            }
            const recentGroupConversations = ChatMapper.getRecentConversationDomainModel(groupConversations);
            const recentPeerConversations = ChatMapper.getRecentConversationDomainModel(peerConversations);
            
            const recentConversations = (await recentPeerConversations).concat(recentGroupConversations);
            //const recentConversations = [...recentGroupConversations, ...recentPeerConversations];
            //sort((a,b) => a.LastMessageTimestamp.getTime() - b.LastMessageTimestamp.getTime());
            return ChatMapper.toRecentConversationDto(recentConversations);
        }
        catch (error){
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    private async getPeerConversationIds(userId: string) {
        return await PeerConversation.findAll({
            where : {
                [Op.or] : [
                    {
                        InitiatingUserId : userId,
                    },
                    {
                        OtherUserId : userId,
                    },
                ]
            },
            attributes : ["id", "LastMessageTimestamp"],
            order      : [['LastMessageTimestamp', 'DESC']],
            limit      : 15,
            offset     : 0,
        });
    }

    private async getConversationParticipantById(userId: string) {
        return await ConversationParticipant.findAll({
            where : {
                UserId           : userId,
                ConversationType : ConversationType.GROUP,
            },
            // attributes : ["GroupConversationId"],
        });
    }

    makeGroupAdmin= async (domainModel:ConversationParticipantDomainModel, conversationId: string):
    Promise<boolean> => {
        try {
            const partcipant = await ConversationParticipant.findOne({
                where : {
                    GroupConversationId : conversationId,
                    UserId              : domainModel.UserId
                }
            });
            partcipant.IsAdmin = true;
            partcipant.save();
            return partcipant.IsAdmin;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    dismissAsAdmin =async (domainModel:ConversationParticipantDomainModel, conversationId:uuid):Promise<boolean>=>{
        try {
            const partcipant = await ConversationParticipant.findOne({
                where : {
                    GroupConversationId : conversationId,
                    UserId              : domainModel.UserId
                }
            });
            partcipant.IsAdmin = false;
            partcipant.save();
            return partcipant.IsAdmin;
        }
        catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

    removeUserFromGroupConversation= async (model:ConversationParticipantDomainModel):
    Promise<GroupConversationDto>=>{
        try {
            await ConversationParticipant.destroy({
                where : {
                    userId : model.UserId
                }
            });
            const conversation = await GroupConversation.findOne({
                where : {
                    id : model.GroupConversationId,
                }
            });

            const existingUserIds: string[] = JSON.parse(conversation.ListOfUsers);
            const index = existingUserIds.indexOf(model.UserId);
            if (index === -1  && conversation.InitiatingUserId !== model.UserId){
                throw new ApiError(202,'User not found');
            }
            if (index !== -1)
                conversation.ListOfUsers = JSON.stringify(existingUserIds.splice(index,1));
            conversation.save();
            return ChatMapper.toGroupConversationDto(conversation);
        }
        catch (error){
            Logger.instance().log(error.message);
            throw new ApiError(500,error.message);
        }
    }

}


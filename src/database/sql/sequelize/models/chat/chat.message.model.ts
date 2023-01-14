import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import FileResource from '../file.resource/file.resource.model';
import User from './chat.user';
//import Conversation from './conversation.model';
import GroupConversation from './group.conversation.model';
import PeerConversation from './peer.conversation.model';

///////////////////////////////////////////////////////////////////////
enum MessageType {
    TEXT = "TEXT",
    VOICE = "VOCIE",
    VIDEO = "VIDEO",
  }

enum ConversationType {
    GROUP = "GROUP",
    PEER = "PEER",
  }

@Table({
    timestamps      : true,
    modelName       : 'ChatMessage',
    tableName       : 'chat_messages',
    paranoid        : true,
    freezeTableName : true,
    })
export default class ChatMessage extends Model {

    @IsUUID(4)
    @PrimaryKey
    @Column({
        type         : DataType.UUID,
        defaultValue : () => {
            return v4();
        },
        allowNull : false,
    })
    id: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    SenderId : string;

    @BelongsTo(() =>  User)
    user:  User;

    @IsUUID(4)
    @ForeignKey(() => PeerConversation)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    PeerConversationId : string;

    @BelongsTo(() =>  PeerConversation)
    OneToOneConversation:  PeerConversation;

    @IsUUID(4)
    @ForeignKey(() => GroupConversation)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    GroupConversationId : string;

    @BelongsTo(() =>  GroupConversation)
    OneToManyConversation:  GroupConversation;

    @IsUUID(4)
    @ForeignKey(() => FileResource)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    FileResourceId : string;

    @BelongsTo(() =>  FileResource)
    fileResource:  FileResource;

    @Column({
        type      : DataType.TEXT,
        allowNull : false,
    })
    Message: string;

    @Column({
        type :  DataType.ENUM(...Object.values(MessageType)),
        allowNull : false,
    })
    MessageType: MessageType;

    @Column({
        type :  DataType.ENUM(...Object.values(ConversationType)),
        allowNull : false,
    })
    ConversationType: ConversationType;

    @IsUUID(4)
    @Column({
        type         : DataType.UUID,
        allowNull : true,
    })
    BaseMessageThreadId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}

import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from './chat.user';
import Conversation from './blocked.user..model';
import GroupConversation from './group.conversation.model';
import PeerConversation from './peer.conversation.model';

///////////////////////////////////////////////////////////////////////
enum ConversationType {
    GROUP = "GROUP",
    PEER = "PEER",
  }

@Table({
    timestamps      : true,
    modelName       : 'ConversationParticipant',
    tableName       : 'chat_conversation_participants',
    paranoid        : true,
    freezeTableName : true,
    })
export default class ConversationParticipant extends Model {

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

    // @IsUUID(4)
    // @ForeignKey(() => Conversation)
    // @Column({
    //     type      : DataType.UUID,
    //     allowNull : true,
    // })
    // ConversationId : string;

    // @BelongsTo(() =>  Conversation)
    // Conversation:  Conversation;
    
    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    UserId : string;

    @BelongsTo(() =>  User)
    user:  User;

    @Column({
        type :  DataType.ENUM(...Object.values(ConversationType)),
        allowNull : false,
    })
    ConversationType: ConversationType;

    @Column({
        type :DataType.BOOLEAN,
        allowNull : false,
        defaultValue : false,
    })
    IsAdmin: boolean;

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
    
    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}

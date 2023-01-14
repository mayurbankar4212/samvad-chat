import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User  from './chat.user';
import GroupConversation from './group.conversation.model';
import PeerConversation from './peer.conversation.model';

///////////////////////////////////////////////////////////////////////
enum ConversationType {
    GROUP = "GROUP",
    PEER = "PEER",
  }

@Table({
    timestamps      : true,
    modelName       : 'BlockedUser',
    tableName       : 'chat_blocked_users',
    paranoid        : true,
    freezeTableName : true,
    })
export default class BlockedUser extends Model {

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
    @ForeignKey(()=>User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    UserId : string;

    @BelongsTo(() =>  User)
    BlockUser:  User;

    @IsUUID(4)
    @ForeignKey(()=>User)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    BlockedById : string;

    @BelongsTo(() =>  User)
    AdminUser:  User;

    @Column({
        type :  DataType.ENUM(...Object.values(ConversationType)),
        allowNull : false,
    })
    ConversationType: ConversationType;
    
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

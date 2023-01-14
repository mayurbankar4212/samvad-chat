import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    HasMany,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import BlockedUser from './blocked.user..model';
import User from './chat.user';
import ConversationParticipant from './conversation.participant.model';

///////////////////////////////////////////////////////////////////////
enum GroupType {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    PASSWORD = "PASSWORD",
  }

@Table({
    timestamps      : true,
    modelName       : 'GroupConversation',
    tableName       : 'chat_group_conversations',
    paranoid        : true,
    freezeTableName : true,
    })
export default class GroupConversation extends Model {

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

    @Column({
        type      : DataType.STRING(256),
        allowNull : true,
    })
    GroupName: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    InitiatingUserId : string;

    @BelongsTo(() =>  User)
    user:  User;

    @Column({
        type : DataType.STRING(1024),
        allowNull : false,
    })
    ListOfUsers : string;

    @Column({
        type:DataType.STRING(256),
        allowNull : true,
    })
    GroupIcon: string;

    @Column({
        type:DataType.STRING(256),
        allowNull : true,
    })
    Description:string;

    @Column({
        type :  DataType.ENUM(...Object.values(GroupType)),
        allowNull : false,
    })
    GroupType: GroupType;

    @Column({
        type      : DataType.DATE,
        allowNull : true,
    })
    LastMessageTimestamp: Date;

    @HasMany(() => ConversationParticipant)
    Participants : ConversationParticipant[];

    @HasMany(() => BlockedUser)
    BlockConversations : BlockedUser[];
    
    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}

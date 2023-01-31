import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    HasMany,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import BannedUser  from './banned.user.model';
import BlockedUser from './blocked.user..model';
import ConversationParticipant from './conversation.participant.model';
import GroupConversation from './group.conversation.model';
import PeerConversation from './peer.conversation.model';

@Table({
    modelName:'User',
    tableName: 'chat_users',
    timestamps: true,
    paranoid: true,
    freezeTableName: true,
    })

export default class User extends Model {

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
        type: DataType.STRING(256),
        allowNull: false,
    })
    Name: string;

    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    Avatar:string;

    @Column({
            type: DataType.STRING(256),
            allowNull: true,
        })
    ProfileLink:string;

    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    Email:string;

    @Column({
        type: DataType.STRING(256),
        allowNull: true,
    })
    Phone:string;

    @CreatedAt
    CreatedAt:Date

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

    @HasMany(()=> PeerConversation)
    OneToOneConversations:PeerConversation[];

    @HasMany(()=> GroupConversation)
    OneToManyConversations:GroupConversation[];

    @HasMany(()=> ConversationParticipant)
    Participants :ConversationParticipant[];

    @HasMany(()=> BannedUser)
    BanUsers :BannedUser[];

    @HasMany(()=> BlockedUser)
    BlockUsers :BlockedUser[];


}


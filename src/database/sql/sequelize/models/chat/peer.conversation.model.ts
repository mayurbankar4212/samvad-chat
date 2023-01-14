import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt,HasMany
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import BlockedUser from './blocked.user..model';
import User from './chat.user';
import ConversationParticipant from './conversation.participant.model';

///////////////////////////////////////////////////////////////////////

@Table({
    timestamps      : true,
    modelName       : 'PeerConversation',
    tableName       : 'chat_peer_conversations',
    paranoid        : true,
    freezeTableName : true,
    })
export default class PeerConversation extends Model {

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
    Topic: string;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    InitiatingUserId : string;

    @BelongsTo(() =>  User)
    user:  User;

    @IsUUID(4)
    @ForeignKey(() => User)
    @Column({
        type      : DataType.UUID,
        allowNull : false,
    })
    OtherUserId : string;

    @BelongsTo(() =>  User)
    otherUser:  User;

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

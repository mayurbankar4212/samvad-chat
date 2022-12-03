import { BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import Conversation from './conversation.model';

///////////////////////////////////////////////////////////////////////

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

    @IsUUID(4)
    @ForeignKey(() => Conversation)
    @Column({
        type      : DataType.UUID,
        allowNull : true,
    })
    ConversationId : string;

    @BelongsTo(() =>  Conversation)
    Conversation:  Conversation;
    
    @Column({
        type : DataType.UUID,

        allowNull : false,
    })
    UserId: string;

    @Column
    @CreatedAt
    CreatedAt: Date;

    @UpdatedAt
    UpdatedAt: Date;

    @DeletedAt
    DeletedAt: Date;

}

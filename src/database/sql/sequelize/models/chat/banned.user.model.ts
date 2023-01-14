import {
    BelongsTo, Column, CreatedAt, DataType, DeletedAt, ForeignKey,
    IsUUID, Model, PrimaryKey, Table, UpdatedAt
} from 'sequelize-typescript';
import { v4 } from 'uuid';
import User from './chat.user';

@Table({
    timestamps      : true,
    modelName       : 'BannedUser',
    tableName       : 'chat_banned_users',
    paranoid        : true,
    freezeTableName : true,
    })

export default class BannedUser extends Model{

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
    User:  User;

}

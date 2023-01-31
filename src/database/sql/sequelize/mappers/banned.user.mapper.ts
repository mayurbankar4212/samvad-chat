import User from '../models/chat/chat.user';
import { BannedUserDto } from '../../../../../src/domain.types/banned.user/banned.user.dto';
import BannedUser from '../models/chat/banned.user.model';
export class BannedUserMapper {

    static toDto = (bannedUser: BannedUser): BannedUserDto => {
        if (bannedUser == null){
            return null;
        }
        
        const dto: BannedUserDto = {
            id     : bannedUser.id,
            UserId : bannedUser.UserId,
            
        };
        return dto;
    };

    static toAllUserDto = (user: BannedUser[]): BannedUserDto[] => {
        var users = user;
        if (user == null){
            return null;
        }
        const dto: BannedUserDto[] = [];
        for (const user of users){
            dto.push(user);
        }
        return dto;
    };

}

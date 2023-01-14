import User from '../models/chat/chat.user';
import { ChatUserDto } from '../../../../../src/domain.types/chat.user/chat.user.dto';
export class UserMapper {

    static toDto = (user: User): ChatUserDto => {
        if (user == null){
            return null;
        }
        
        const dto: ChatUserDto = {
            id          : user.id,
            Name        : user.Name,
            Avatar      : user.Avtar,
            ProfileLink : user.ProfileLink,
            Phone       : user.Phone,
            Email       : user.Email,
           
        };
        return dto;
    };

}

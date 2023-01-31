import 'reflect-metadata';
import { ChatUserRepo } from '../database/sql/sequelize/repositories/chat.user.repo ';
import { DependencyContainer } from 'tsyringe';
import { BannedUserRepo } from '../database/sql/sequelize/repositories/banned.user.repo';
import { ChatRepo } from '../database/sql/sequelize/repositories/peer.chat.repo';
import { GroupChatRepo } from '../database/sql/sequelize/repositories/group.chat.repo';
export class ChatInjector{
    
    static registerInjections(container: DependencyContainer) {
        container.register('IChatUserRepo',ChatUserRepo);
        container.register('IBannedUserRepo',BannedUserRepo);
        container.register('IChatRepo',ChatRepo);
        container.register('IGroupChatRepo',GroupChatRepo);
    }

}

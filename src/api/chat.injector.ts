import 'reflect-metadata';
import { ChatUserRepo } from '../database/sql/sequelize/repositories/chat.user.repo ';
import { DependencyContainer } from 'tsyringe';
export class ChatInjector{
    
    static registerInjections(container: DependencyContainer) {
        container.register('IChatUserRepo',ChatUserRepo);
    }

}

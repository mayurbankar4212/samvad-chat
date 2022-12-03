import 'reflect-metadata';
import { DependencyContainer } from 'tsyringe';
import { DatabaseConnector_Sequelize } from './database.connector.sequelize';
import { ApiClientRepo } from './repositories/api.client.repo';
import { FileResourceRepo } from './repositories/file.resource.repo';
import { ChatRepo } from './repositories/chat.repo';

////////////////////////////////////////////////////////////////////////////////

export class SequelizeInjector {

    static registerInjections(container: DependencyContainer) {

        container.register('IDatabaseConnector', DatabaseConnector_Sequelize);

        container.register('IApiClientRepo', ApiClientRepo);
        container.register('IFileResourceRepo', FileResourceRepo);
        container.register('IChatRepo', ChatRepo);

    }

}

import 'reflect-metadata';
import { container, DependencyContainer } from 'tsyringe';
import { Authenticator } from '../auth/authenticator';
import { Logger } from '../common/logger';
import { DatabaseConnector } from '../database/database.connector';
import { Injector } from './injector';
import { Scheduler } from './scheduler';
import { Seeder } from './seeder';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class Loader {

    private static _authenticator: Authenticator = null;

    private static _databaseConnector: DatabaseConnector = null;

    private static _seeder: Seeder = null;
    
    private static _scheduler: Scheduler = Scheduler.instance();

    private static _container: DependencyContainer = container;

    public static get authenticator() {
        return Loader._authenticator;
    }

    public static get databaseConnector() {
        return Loader._databaseConnector;
    }

    public static get seeder() {
        return Loader._seeder;
    }

    public static get scheduler() {
        return Loader._scheduler;
    }

    public static get container() {
        return Loader._container;
    }

    public static init = async (): Promise<boolean> => {
        try {

            //Register injections here...
            Injector.registerInjections(container);

            Loader._databaseConnector = container.resolve(DatabaseConnector);
            Loader._authenticator = container.resolve(Authenticator);
            Loader._seeder = container.resolve(Seeder);
            
            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

}

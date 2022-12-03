import path from 'path';
import * as defaultConfiguration from '../../samvad_chat.config.json';
import * as localConfiguration from '../../samvad_chat.config.local.json';
import {
    AuthenticationType,
    AuthorizationType,
    Configurations,
    DatabaseFlavour,
    DatabaseORM,
    DatabaseType,
    FileStorageProvider,
} from './configuration.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

export class ConfigurationManager {

    static _config: Configurations = null;

    public static loadConfigurations = (): void => {

        const configuration = process.env.NODE_ENV === 'local' ? localConfiguration : defaultConfiguration;

        ConfigurationManager._config = {
            SystemIdentifier : configuration.SystemIdentifier,
            BaseUrl          : process.env.BASE_URL,
            Auth             : {
                Authentication : configuration.Auth.Authentication as AuthenticationType,
                Authorization  : configuration.Auth.Authorization as AuthorizationType,
            },
            Database : {
                Type    : configuration.Database.Type as DatabaseType,
                ORM     : configuration.Database.ORM as DatabaseORM,
                Flavour : configuration.Database.Flavour as DatabaseFlavour,
            },
            FileStorage : {
                Provider : configuration?.FileStorage?.Provider as FileStorageProvider ?? 'Custom',
            },
            TemporaryFolders : {
                Upload                     : configuration.TemporaryFolders.Upload as string,
                Download                   : configuration.TemporaryFolders.Download as string,
                CleanupFolderBeforeMinutes : configuration.TemporaryFolders.CleanupFolderBeforeMinutes as number,
            },
            MaxUploadFileSize : configuration.MaxUploadFileSize,
            JwtExpiresIn      : configuration.JwtExpiresIn,
            SessionExpiresIn  : configuration.SessionExpiresIn,
        };

        ConfigurationManager.checkConfigSanity();
    };

    public static BaseUrl = (): string => {
        return ConfigurationManager._config.BaseUrl;
    };

    public static SystemIdentifier = (): string => {
        return ConfigurationManager._config.SystemIdentifier;
    };

    public static Authentication = (): AuthenticationType => {
        return ConfigurationManager._config.Auth.Authentication;
    };

    public static Authorization = (): AuthorizationType => {
        return ConfigurationManager._config.Auth.Authorization;
    };

    public static DatabaseType = (): DatabaseType => {
        return ConfigurationManager._config.Database.Type;
    };

    public static DatabaseORM = (): DatabaseORM => {
        return ConfigurationManager._config.Database.ORM;
    };

    public static DatabaseFlavour = (): DatabaseFlavour => {
        return ConfigurationManager._config.Database.Flavour;
    };

    public static MaxUploadFileSize = (): number => {
        return ConfigurationManager._config.MaxUploadFileSize;
    };

    public static JwtExpiresIn = (): number => {
        return ConfigurationManager._config.JwtExpiresIn;
    }

    public static FileStorageProvider = (): FileStorageProvider => {
        return ConfigurationManager._config.FileStorage.Provider;
    };

    public static UploadTemporaryFolder = (): string => {
        var location = ConfigurationManager._config.TemporaryFolders.Upload;
        return path.join(process.cwd(), location);
    };

    public static DownloadTemporaryFolder = (): string => {
        var location = ConfigurationManager._config.TemporaryFolders.Download;
        return path.join(process.cwd(), location);
    };

    public static TemporaryFolderCleanupBefore = (): number => {
        return ConfigurationManager._config.TemporaryFolders.CleanupFolderBeforeMinutes;
    };

    public static SessionExpiresIn = (): number => {
        return ConfigurationManager._config.SessionExpiresIn;
    }

    private static checkConfigSanity() {

        //Check database configurations

        if (ConfigurationManager._config.Database.Type === 'SQL') {
            var orm = ConfigurationManager._config.Database.ORM;
            var flavour = ConfigurationManager._config.Database.Flavour;
            if (orm !== 'Sequelize' && orm !== 'Knex') {
                throw new Error('Database configuration error! - Unspported/non-matching ORM');
            }
            if (flavour !== 'MySQL' && flavour !== 'PostGreSQL') {
                throw new Error('Database configuration error! - Unspported/non-matching databse flavour');
            }
        }
        if (ConfigurationManager._config.Database.Type === 'NoSQL') {
            var orm = ConfigurationManager._config.Database.ORM;
            var flavour = ConfigurationManager._config.Database.Flavour;
            if (flavour === 'MongoDB') {
                if (orm !== 'Mongoose') {
                    throw new Error('Database configuration error! - Unspported/non-matching ORM');
                }
            }
        }
    }

}

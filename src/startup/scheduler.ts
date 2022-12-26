import * as cron from 'node-cron';
import * as CronSchedules from '../../seed.data/cron.schedules.json';
import { Logger } from '../common/logger';
import { FileResourceService } from '../services/file.resource.service';
import { Loader } from './loader';

///////////////////////////////////////////////////////////////////////////

export class Scheduler {

    //#region Static privates

    private static _instance: Scheduler = null;

    private static _schedules = null;

    private constructor() {
        const env = process.env.NODE_ENV || 'development';
        Scheduler._schedules = CronSchedules[env];
        Logger.instance().log('Initializing the scheduler.');
    }

    //#endregion

    //#region Publics

    public static instance(): Scheduler {
        return this._instance || (this._instance = new this());
    }

    public schedule = async (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            try {

                this.scheduleFileCleanup();

                //this.scheduleDaillyPatientTasks();

                resolve(true);
            } catch (error) {
                Logger.instance().log('Error initializing the scheduler.: ' + error.message);
                reject(false);
            }
        });
    };

    //#endregion

    //#region Privates

    private scheduleFileCleanup = () => {
        cron.schedule(Scheduler._schedules['FileCleanup'], () => {
            (async () => {
                Logger.instance().log('Running scheducled jobs: temp file clean-up...');
                var service = Loader.container.resolve(FileResourceService);
                await service.cleanupTempFiles();
            })();
        });
    };

    // private scheduleCreateMedicationTasks = () => {
    //     cron.schedule(Scheduler._schedules['CreateMedicationTasks'], () => {
    // (async () => {
    //     Logger.instance().log('Running scheducled jobs: Create medication tasks...');
    //     var service = Loader.container.resolve(MedicationConsumptionService);
    //     var upcomingInMinutes = 60 * 24 * 2;
    //     var count = await service.createMedicationTasks(upcomingInMinutes);
    //     Logger.instance().log(`Total ${count} new medication tasks created.`);
    // })();
    //     });
    // };

    // private scheduleDaillyPatientTasks = () => {
    //     cron.schedule(Scheduler._schedules['PatientDailyTasks'], () => {
    //         (async () => {
    //             Logger.instance().log('Running scheducled jobs: Patient daily tasks...');
    //             var service = Loader.container.resolve(UserTaskService);

    //             await service.sendTaskReminders();
    //         })();
    //     });
    // };

    //#endregion

}

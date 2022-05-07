import winston from "winston";
import  DailyRotateFile from 'winston-daily-rotate-file';
import moment from 'moment';
import fs from 'fs-extra';
import fileControl from 'fs';
import _ from 'lodash';
import path from 'path';


class Logger {

	Transports: any;
	Logger: any;
	CurrentLevel: any;

	constructor(Config: any){
		this.Transports = [];
		this.CurrentLevel = _.find(Config.Logs.LevelsMap, {name: Config.Logs.Level.toUpperCase()});
		this.Start(Config);
	}


	async Start(Config: any) {

		const LOG_FOLDER = path.join(appRoot, 'Logs');
		const transports = this.Transports;
		// let DF = 'YYYY-MM-DD h:mm:ss a';
		// Config.Logs.DateFormat !== "" ? DF = Config.Logs.DateFormat : null;

		if (appRoot !== undefined) {

			try {
				fs.ensureDir(LOG_FOLDER);

				const transport: DailyRotateFile = new DailyRotateFile({
					filename: LOG_FOLDER + '\\' + Config.Logs.FileName.Name + '-%DATE%.log',
					datePattern: Config.Logs.FileName.DatePattern,
					zippedArchive: Config.Logs.ZippedLogFile,
					maxSize: Config.Logs.MaxSize.Value + Config.Logs.MaxSize.Unit,
					maxFiles: Config.Logs.MaxFiles.Value + Config.Logs.MaxFiles.Type,
				  });

				transport.on('rotate', (oldFileName, newFileName) => {
					// this.logger.info('Archivo anterior ---> ' + oldFileName);
					if (Config.Logs.Backup.RequireBackup) {
						const src = oldFileName;
						const fileNameToCopy = path.basename(src);
						const mainFolder = path.dirname(require.main.filename);
						const destinationFolder = mainFolder + '\\' + Config.Logs.Backup.BackupFolderName;
						fileControl.access(destinationFolder, (err) => {
							if (err)
								fileControl.mkdirSync(destinationFolder);
							this.copyFile(src, destinationFolder + '\\' + fileNameToCopy);
						});
					}
				});

				transports.push(transport);
				this.Logger = winston.createLogger({
					transports
				});

				this.Logger.info('Logger utilizando el transporte de archivos creado con éxito.');

			} catch (e) {
				throw e;
			}
		}
		else {
			this.Logger.warn('No AppRoot defined in main class. Logger won\'t log to file.');
		}
	}


	async copyFile(src:any, dest:any) {

		const readStream = fileControl.createReadStream(src);

		readStream.once('error', (err) => {
			// tslint:disable-next-line:no-console
			console.log(err);
		});

		readStream.once('end', () => {
			// tslint:disable-next-line:no-console
			console.log(' --> Archivo ' + src + ' respaldado');
		});

		readStream.pipe(fileControl.createWriteStream(dest));
	}

	async Debug (message:string) {
		if (this.CurrentLevel.level === 2) {
			this.Logger.log('debug', message);
		}
	};
	async Info (message:string) {
		if (this.CurrentLevel.level >= 1) {
			this.Logger.info(message);
		}
	};

	async Error (message:string) {
		if (this.CurrentLevel.level >= 0) {
			this.Logger.error(message);
		}
	};
}

export = Logger;
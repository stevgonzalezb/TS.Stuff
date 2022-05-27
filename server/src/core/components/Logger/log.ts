import winston, { format } from "winston";
import  DailyRotateFile from 'winston-daily-rotate-file';
import moment from 'moment';
import fs from 'fs-extra';
import fileControl from 'fs';
import _ from 'lodash';
import path from 'path';
// import { LogLevels } from "src/core/global/enums";


class Logger {

	Transports: any;
	Logger: any;
	CurrentLevel: any;

	constructor(Config: Config) {

		this.Transports = [new winston.transports.Console()];
		this.CurrentLevel = _.find(Config.Logs.LevelsMap, {name: Config.Logs.Level.toUpperCase()});
		this.Logger = winston.createLogger({
			format: format.combine(
				format.colorize(),
				format.timestamp(),
				format.printf(({ timestamp, level, message, service }) => {
				  return `[${timestamp}] ${level}: ${message}`;
				})
			)
		});
		this.Start(Config);


	}


	async Start(Config: Config) {

		const LOG_FOLDER = path.join(appRoot, 'Logs');
		const objTransports = this.Transports;
		const DF = 'YYYY-MM-DD h:mm:ss a';

		if (appRoot !== undefined) {

			try {
				fs.ensureDir(LOG_FOLDER);

				const transport = new DailyRotateFile({
					filename: LOG_FOLDER + '\\' + Config.Logs.FileName.Name + '-%DATE%.log',
					datePattern: Config.Logs.FileName.DatePattern,
					zippedArchive: Config.Logs.ZippedLogFile,
					maxSize: Config.Logs.MaxSize.Value + Config.Logs.MaxSize.Unit,
					maxFiles: Config.Logs.MaxFiles.Value + Config.Logs.MaxFiles.Type,
				  });

				transport.on('rotate', (oldFileName, newFileName) => {
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

				objTransports.push(transport);

				this.Logger.configure({
					transports: objTransports,
					level: 'debug'
				});

				this.Logger.info('[log.ts].[Start] >> Logger using the successfully created file transport.');

			} catch (e) {
				throw e;
			}
		}
		else {
			this.Logger.warn('[log.ts].[Start] >> No AppRoot defined in main class. Logger won\'t log to file.');
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
			console.log(' --> Files ' + src + ' Backup Done!');
		});

		readStream.pipe(fileControl.createWriteStream(dest));
	}

	async Debug (message:string) {
		if (this.CurrentLevel.level === LogLevels.DEBUG) {
			this.Logger.log('debug', message);
		}
	};

	async Info (message:string) {
		if (this.CurrentLevel.level >= LogLevels.INFO) {
			this.Logger.info(message);
		}
	};

	async Error (message:string) {
		if (this.CurrentLevel.level >= LogLevels.ERROR) {
			this.Logger.error(message);
		}
	};
}

export = Logger;
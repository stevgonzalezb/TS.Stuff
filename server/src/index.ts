import Server from './core/server';
import Schemas from './resources/Schemas/SchemasHandler';
import Config from './resources/config';
import Logger from './core/components/Logger';
import Common from './core/components/Common';
import path from 'path';

appRoot = path.resolve(__dirname);

try {
    // Create intance of common modules
    // const oLogger = Logger.init(Config);
    const oCommon = Common.init();

    // Start web sever
    Server.init(oCommon);

} catch (error) {

    // tslint:disable-next-line:no-console
    console.log(error);
}


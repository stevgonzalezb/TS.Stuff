import Server from './core/server';
import Schemas from './resources/Schemas/SchemasHandler';
import Config from './resources/config';
import Logger from './core/components/Logger';
import Common from './core/components/Common';


// Create intance of common modules
const logger = Logger.init(Config);
const common = Common.init(Config, logger, Schemas);

// Start web sever
Server.init();
common.Logger.Debug("Server started succesfully")

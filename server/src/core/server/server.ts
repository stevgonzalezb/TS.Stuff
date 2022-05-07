import path from "path";
import Schemas from '../../resources/Schemas/SchemasHandler';
import Config from '../../resources/config';
import express from "express";

global.appRoot = path.join(__dirname);
// global.errorCodes = require('./resources/Util/ErrorCodes');

export default class Server {

    private app: any;
    private port: number;

    constructor() {
        this.app = express();
        this.port = 8080;
        this.Routes();
        this.Start();
    }

    async Routes() {
        try {
            // define a route handler for the default home page
            this.app.get( "/", ( req:any, res:any ) => {
                res.send( "Hello world!" );
            });
        } catch (error) {
            // to-do
        }
    }

    async Start() {
        try {
            // start the Express server
            this.app.listen( this.port, () => {

            // tslint:disable-next-line:no-console
            console.log( `server started at http://localhost:${ this.port }` );
            });
        } catch (error) {
            // To-do
        }
    }
}
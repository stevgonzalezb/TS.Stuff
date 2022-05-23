import path from "path";
import express from "express";

global.appRoot = path.join(__dirname);
// global.errorCodes = require('./resources/Util/ErrorCodes');

export default class Server {

    private Common:any;
    private WebApp: any;
    private Port: number;

    constructor(Common: any) {
        this.Common = Common;
        this.WebApp = express();
        this.Port = Common.Config.WebServer.Port;
        this.Routes();
        this.Start();
    }

    async Routes() {
        const self = this;
        try {
            // define a route handler for the default home page
            this.WebApp.get( "/health", ( req:any, res:any ) => {
                res.send( "Web server is running!" );
            });
        } catch (error) {
            self.Common.Logger.Error(`server.ts >> Routes() >> Error: ${error}`)
        }
    }

    async Start() {
        const self = this;
        try {
            // Start the Express server
            this.WebApp.listen( this.Port, () => {
                self.Common.Logger.Info(`Web Server Started Correctly at http://localhost:${ this.Port }`)
                self.Common.Logger.Debug(`Web Server Started Correctly at http://localhost:${ this.Port }.`)
            // tslint:disable-next-line:no-console
            // console.log( `server started at http://localhost:${ this.port }` );
            });
        } catch (error) {
            self.Common.Logger.Error(`server.ts >> Start() >> Error: ${error}`)
        }
    }
}
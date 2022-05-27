
import path from 'path';


class WinService {

	Common:Common;
	Options:any;
	WinService:any;

	constructor(Common:Common){

		const Service =  require('node-windows').Service;
		const EventLogger = require('node-windows').EventLogger;
		const log = new EventLogger("SmartSoft Replicador Websocket");

		this.Common = Common
		this.Options = {
			name: Common.Config.Service.Name,
			description: Common.Config.Service.Description,
			script: path.join(appRoot, Common.Config.Service.Main),
			nodeOptions: Common.Config.Service.NodeOptions
		};
		this.WinService = new Service(this.Options);
	}

	async Install() {
		const self = this;
		self.WinService.install();

		self.WinService.on("install", () => {
			if (self.Common.Config.Service.Start) {
				self.WinService.start();
			}
			else {
				//self.Common.Logger.Info(self.Common.Format(self.Common.Messages.Success.SERVICE_CREATED, [self.Common.Config.Service.Name, self.WinService.exists]));
			}
		})
	}

	async Uninstall() {
		const self = this;
		self.WinService.stop();
		self.WinService.uninstall();
		self.WinService.on('uninstall', () => {
			//self.Common.Logger.Info(self.Common.Format(self.Common.Messages.Success.SERVICE_REMOVED, [self.Common.Config.Service.Name, self.WinService.exists]));
		});
	}
}

export = WinService;


type Common = {
    Config: any,
    Logger:any,
    Schemas?:any
}

type Config = {
	Logs: {
		LevelsMap: { name: string; level: number; }[],
		Level: string,
		FileName:{
		   Name: string,
		   DatePattern: string
		},
		DateFormat: string,
		MaxSize: {
		   Value: number,
		   Unit: string
		},
		MaxFiles:{
		   Value: string,
		   Type: string
		},
		Backup:{
		   RequireBackup: boolean,
		   BackupFolderName : string
		},
		ZippedLogFile: boolean
	 },
	 SQLServer: {
		User: string,
		Password: string,
		Server: string,
		Database: string,
		Port: number,
		ConnectionTimeout: number,
		RequestTimeout: number
	 },
	 SMTPServer:{
		AccountEmail: string,
		AccountName: string,
		Port: number,
		Domain: string,
		Password: string,
		Destinatarios: string,
		GreetingTimeout: number,
		SecureChannel: boolean,
		SelfSignedCertificateFailure: boolean
	 },
	 Queues:{
		Redis: {
		   Password: string,
		   Queue: string
		},
		RabbitMQ: {
		   Password: string,
		   Queue: string
		}
	 },
	 WebServer: {
		Port: number
	 },
}


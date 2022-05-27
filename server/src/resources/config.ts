export = {
   Logs: {
      LevelsMap: [{name: 'ERROR', level: 0}, {name: 'INFO', level: 1}, {name: 'DEBUG', level: 2}],
      Level: "DEBUG",
      FileName:{
         Name: "JS-Tools-logs",
         DatePattern: "YYYY-MM-DD-HH"
      },
      DateFormat: "YYYY-MM-DD HH:mm:ss.SSS",
      MaxSize: {
         Value: 5,
         Unit: "m"
      },
      MaxFiles:{
         Value: "10",
         Type: "f"
      },
      Backup:{
         RequireBackup: false,
         BackupFolderName :"BackupLogs"
      },
      ZippedLogFile: false
   },
   SQLServer: {
      User: "08064c1342aaeabe7a0fb9d32c0b1a7b",
      Password: "5edc281228f6ac00c76937d4ee9dc365",
      Server: "AA-49",
      Database: "Sentinel_700",
      Port: 1433,
      ConnectionTimeout:60000,
      RequestTimeout:60000
   },
   SMTPServer:{
      AccountEmail:"cgomez@smartsoftint.com",
      AccountName:"Christian Gomez",
      Port:587,
      Domain:"smtp.office365.com",
      Password:"a186fdb2e7ddcfe358c9ea01d7c0429a9f4dfea7d20b2f239b29199114355cf9",
      Destinatarios:"cgomez@smartsoftint.com",
      GreetingTimeout:20000,
      SecureChannel:false,
      SelfSignedCertificateFailure:false
   },
   Queues:{
      Redis: {
         Password: "",
         Queue: ""
      },
      RabbitMQ: {
         Password: "",
         Queue: ""
      }
   },
   WebServer: {
      Port: 8080
   },
}
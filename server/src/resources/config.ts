export =
{
   Logs: {
      LevelsMap: [{name: 'ERROR', level: 0}, {name: 'INFO', level: 1}, {name: 'DEBUG', level: 2}],
      Level: "DEBUG",
      FileName:{
         Name: "servicio_gestiones-BHD",
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
         RequireBackup: true,
         BackupFolderName :"BackupLogsGestionesBHD"
      },
      ZippedLogFile: false
   },
   WebServer: {
      Port: 8080
   },
   Service: {
      Name: "Smartsoft_Servicio_Bloqueos_BHDLeon",
      Description: "Servicio que usa un cron para procesar gestiones de bloqueos pendientes en Sentinel para BHD",
      Main: "app.js",
      NodeOptions: "",
      Start: false
   },
   Database: {
      user: "08064c1342aaeabe7a0fb9d32c0b1a7b",
      password: "5edc281228f6ac00c76937d4ee9dc365",
      server: "AA-49",
      database: "Sentinel_700",
      port: 1433,
      connectionTimeout:60000,
      requestTimeout:60000
   },
   SMTP:{
      CuentaCorreo:"cgomez@smartsoftint.com",
      NombreCuenta:"Christian Gomez",
      Puerto:587,
      Dominio:"smtp.office365.com",
      Password:"a186fdb2e7ddcfe358c9ea01d7c0429a9f4dfea7d20b2f239b29199114355cf9",
      Destinatarios:"cgomez@smartsoftint.com",
      greetingTimeout:20000,
      CanalSeguro:false,
      FallaEnCertificadoAutoFirmado:false
   },
   Queues:{
      QueueGestionesErradas:"colaBloqueosErrados",
      RedisPassword:"9b2d502ddc99f9605a34aa35c8e0b5c8"
   }
}
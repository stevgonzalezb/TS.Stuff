import rabbitMq from 'amqplib';
import http from 'http';
import mssql from 'mssql';
import moment from 'moment';
import crypt from '../Encrypt';


class RabbitMQ {

    Common:any;
    RabbitConnection:any;
    RabbitCredentialsDecrypted:any;
    RabbitManagementDecrypted:any;
    Sql:any;

    constructor(Common:any, Sql:any) {
        this.Common = Common;
        this.RabbitConnection = null;
        this.RabbitCredentialsDecrypted = false;
        this.RabbitManagementDecrypted = false;
        this.Sql = Sql;
    }


    async Connect() {
        const self = this;
        try {
            if (self.RabbitConnection) {
                return self.RabbitConnection;
            }

            let rabbitconfig:any = {};
            let connectionInterval:any;
            if (self.RabbitCredentialsDecrypted) {
                rabbitconfig = self.Common.Config.RabbitMqServer;
            } else {
                // Si hay credenciales se desencriptan, de lo contrario solo se usa el host
                rabbitconfig = (self.Common.Config.RabbitMqServer.user && self.Common.Config.RabbitMqServer.password) ? decryptRabbitCredentials(self) : self.Common.Config.RabbitMqServer;
            }

            self.RabbitConnection = new Promise((resolve, reject) => {
                // Si hay credenciales se usan para la conexión, de lo contrario solo se usa el host
                const connOptions = (rabbitconfig.user && rabbitconfig.password) ? { credentials: rabbitMq.credentials.plain(rabbitconfig.user, rabbitconfig.password) } : {};
                const open = rabbitMq.connect(`amqp://${rabbitconfig.host}`, connOptions);

                open.then((connection) => {
                    self.Common.Logger.Debug('[rabbitMq].[connect] >> Conexión abierta con Rabbit');
                    connection.on('error', (err) => {
                        self.Common.Logger.Error(`[rabbitMq].[connect] >> Error general de conexión con RabbitMQ: ${err.message}`);
                    })
                    connection.on('close', (err) => {
                        connection.removeAllListeners('close');
                        connectionInterval = setInterval(async () => {
                            self.RabbitConnection = null;
                            try {
                                const conn = await self.Connect();
                                self.Common.Logger.Info('[rabbitMq].[connect] >> Reconexión a RabbitMQ exitosa: Canal asociado a cola');
                                clearInterval(connectionInterval);
                            } catch (err) {
                                self.Common.Logger.Error(`[rabbitMq].[connect] >> Reconexión: ${err}`)
                            }
                        }, self.Common.Config.RabbitMqServer.reconnectionInterval);
                    })
                    return connection.createConfirmChannel();
                }).then(async (channel) => {
                    self.Common.Logger.Debug('[rabbitMq].[connect] >> Canal de Rabbit creado');
                    await channel.assertQueue(self.Common.Config.RabbitMqServer.queuename, { durable: true });
                    self.Common.Logger.Debug('[rabbitMq].[connect] >> Canal asociado a cola');
                    await self.Read(channel);
                    resolve(channel);
                }).catch((err) => {
                    self.Common.Logger.Error('[rabbitMq].[connect] >> Error conectando a RabbitMq: ' + err);
                    self.RabbitConnection = null;
                    reject('Error conectando a RabbitMq: ' + err);
                });
            });

            return self.RabbitConnection;
        } catch (err) {
            throw new Error(`[rabbitMq].[connect] >> General error connecting to RabbitMq: ${err.message}`);
        }
    };

    async Push(data:any) {
        const self = this;
        try {
            return new Promise((resolve, reject) => {
                const conn = self.Connect();
                conn.then(async (channel:any) => {
                    const messageToPush = JSON.stringify(data);
                    self.Common.Logger.Debug(`[rabbitMq].[push] >> Pushing: ${messageToPush}`);
                    await channel.sendToQueue(self.Common.Config.RabbitMqServer.queuename, Buffer.from(messageToPush), {persistent: true});
                    resolve(self.Common.Logger.Debug(`[rabbitMq].[push] >> Message pushed: ${messageToPush}`));
                }).catch((err) => {
                    self.Common.Logger.Error('[rabbitMq].[push] >> Error pushing in queue: ' + err);
                    reject(err.message);
                });
            });
        } catch (err) {
            throw new Error(`[rabbitMq].[push] >> General error pushing data into Rabbit queue: ${err.message}`);
        }
    };

    async Read(channel:any) {
        const self = this;
        try {
            return new Promise(async (resolve, reject) => {
                await channel.prefetch(1);
                await channel.consume(self.Common.Config.RabbitMqServer.queuename, async (data:any) => {
                    if (data) {
                        const requestFromQueue = JSON.parse(JSON.stringify(data.content.toString('utf8')));
                        self.Common.Logger.Debug(`[rabbitMq].[read] >> Reading from RabbitMq: ${requestFromQueue}`);

                        if(requestFromQueue) {
                            try {
                                await channel.ack(data);
                            } catch (error) {
                                self.Common.Logger.Error(`[rabbitMq].[read] >> Ocurrió un error actualizando la gestión: ${error}`);
                                await channel.nack(data);
                            }
                        }
                    } else {
                        self.Common.Logger.Info(`[rabbitMq].[read] >> No data`);
                    }
                });
                resolve(self.Common.Logger.Info(`[rabbitMq].[read] >> Consumer is up and receiving`));
            });
        } catch (err) {
            throw new Error(`General error reading data from Rabbit queue: ${err.message}`);
        }
    };

    async Count() {
        return new Promise(async(resolve, reject) => {
            const self = this;
            self.Common.Logger.Info('[rabbitMq.js].[count] >> Inicia el conteo de mensajes de la cola');
            let credentials:any = {};

            if (self.RabbitManagementDecrypted) {
                credentials = self.Common.Config.RabbitManagement;
            } else {
                credentials = await DecryptRabbitManagementCredentials(self);
            }
            const serverOpt = self.Common.Config.RabbitManagement;
            serverOpt.User = credentials.User;
            serverOpt.Password = credentials.Password;
            serverOpt.Host = self.Common.Config.RabbitMqServer.host;
            const uri = await BuildRabbitManagementApi(self, serverOpt);

            http.get(uri, (res) => {
                const data:any = [];
                res.on('data', (chunk) => {
                    data.push(Buffer.from(chunk, 'binary'));
                });
                res.on('end', () => {
                    self.Common.Logger.Info('[rabbitMq.js].[count] >> Se consume exitosamente la URL');
                    let response:any = Buffer.concat(data).toString();
                    response = JSON.parse(response);
                    response.forEach((queue:any) => {
                        if(self.Common.Config.RabbitMqServer.queuename === queue.name) {
                            resolve(queue.messages)
                        }
                    });
                });

            }).on("error", async(err) => {
                self.Common.Logger.Error(`[rabbitMq.js].[count] >> Ocurrió un error consumiento el endpoint del RabbitMQ Management >> Error: ${err}`);
                reject(err)
            });
        })
    }

}

async function decryptRabbitCredentials(self:any) {
    try {
        const credentials = self.Common.Config.RabbitMqServer;
        credentials.user = crypt.Decrypt("RabbitMqServer.user", credentials.user);
        credentials.password = crypt.Decrypt("RabbitMqServer.password", credentials.password);
        self.rabbitCredentialsDecrypted = true;
        return credentials;
    } catch (err) {
        throw new Error(`[rabbitMq].[decryptRabbitCredentials] >> General error decrypting RabbitMq credentials: ${err.message}`);
    }
};


async function DecryptRabbitManagementCredentials(self:any) {
    try {
        const credentials = self.Common.Config.RabbitManagement;
        credentials.User = crypt.Decrypt("RabbitManagement.User", credentials.User);
        credentials.Password = crypt.Decrypt("RabbitManagement.Password", credentials.Password);
        self.RabbitManagementDecrypted = true;
        return credentials;
    } catch (err) {
        throw new Error(`[rabbitMq].[decryptRabbitManagementCredentials] >> General error decrypting RabbitMq Management credentials: ${err.message}`);
    }
};

async function BuildRabbitManagementApi(self:any, serverOpt:any) {
    try {
        return `http://${serverOpt.User}:${serverOpt.Password}@${serverOpt.Host}:${serverOpt.Port}/${serverOpt.QueueEndpoint}`;
    } catch (err) {
        throw new Error(`[rabbitMq].[decryptRabbitManagementCredentials] >> General error creating Rabbit Management URI: ${err}`);
    }
};



export = RabbitMQ;
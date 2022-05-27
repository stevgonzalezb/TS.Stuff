import Redis from 'redis';
import Encoder from '../Encrypt'

class RedisQueue {

    Common:Common;
    QueueName:string;
    RedisClient:any;

    constructor(Common:Common, Name:string) {
        this.Common = Common;
        this.QueueName = Name;
        this.CreateRedisClient();
        this.RedisClient.on("error", (err:any) => {
            Common.Logger.Error("Error from redis => " + err);
        });
    }

    async CreateRedisClient() {
        const self = this;

        if (self.Common.Config.Queues.RedisPassword) {
            const redisPassword = await Encoder.Decrypt('Queues.RedisPassword', self.Common.Config.Queues.RedisPassword)
            self.RedisClient = Redis.createClient({ password: redisPassword });
        } else {
            self.RedisClient = Redis.createClient();
        }
    }

    async Push(val:any) {

        const self = this;
        const queueName = self.QueueName;

        return new Promise((resolve, reject) => {
            if (self.RedisClient.connected) {
                if (val) {
                    if (typeof(val) === 'object') {
                        val = JSON.stringify(val);
                    }
                    self.RedisClient.rpush(queueName, val, (err:any, reply:any) => {
                        if (err) {
                            self.Common.Logger.Error('Error pushing value to Queue ' + queueName + ', error: ' + err);
                            reject(err);
                        } else {
                            resolve(val);
                        }
                    })
                } else {
                    self.Common.Logger.Error('The value you are inserting is null');
                    reject('Error')
                }
            } else {
                reject('Redis is disconnected - Push method');
            }
        })
    };

    async Pop() {

        const self = this;
        const queueName = self.QueueName;

        return new Promise((resolve, reject) => {
            self.RedisClient.lpop(queueName, (err:any, reply:any) => {
                if (err) {
                    self.Common.Logger.Error('Error when Pop from Queue ' + queueName + ', error: ' + err);
                    reject(err);
                } else {
                    resolve(reply);
                }
            })
        })
    };

    async ShowAllValues(range: any) {

        const self = this;
        const name = self.QueueName;

        return new Promise((resolve, reject) => {
            const redisIsConnected = self.RedisClient.connected;
            if (redisIsConnected) {
                self.RedisClient.lrange(name, 0, range, (err:any, reply:any) => {
                    if (err) {
                        self.Common.Logger.Error('Error on method showAllValues: Queue ' + name + ', error: ' + err);
                        reject(err);
                    } else {
                        resolve(reply);
                    }
                })
            } else {
                reject('Redis is disconnected - ShowAllValues method')
            }
        })
    };

    async GetElements() {
        const self = this;
        const queueName = this.QueueName;
        return new Promise((resolve, reject) => {
            const redisIsConnected = self.RedisClient.connected;
            if (redisIsConnected) {
                self.RedisClient.LLEN(queueName, (err:any, reply:any) => {
                    if (err) {
                        self.Common.Logger.Error('Error on method GetElements on Queue ' + queueName + ', error: ' + err)
                        reject(err);
                    } else {
                        resolve(reply);
                    }
                })
            } else {
                reject('Redis is disconnected - GetElements method')
            }
        })
    };

    async DeleteValue(val:any) {
        const self = this;
        const queueName = this.QueueName;
        return new Promise((resolve, reject) => {
            const redisIsConnected = self.RedisClient.connected;
            if (redisIsConnected) {
                self.RedisClient.lrem(queueName, 1, val, (err:any, reply:any) => {
                    if (err) {
                        self.Common.Logger.Error('Error on method DeleteValue on Queue ' + queueName + ', error: ' + err);
                        reject(err)
                    } else {
                        resolve(reply)
                    }
                })
            } else {
                reject('Redis is disconnected - DeleteValue method')
            }
        })
    };

    async DeleteAllValues(range:any) {
        const self = this;
        const queueName = this.QueueName;
        return new Promise((resolve, reject) => {
            const redisIsConnected = self.RedisClient.connected;
            if (redisIsConnected) {
                self.RedisClient.lrange(queueName, 0, range, (clientError:any, clientReply:any) => {
                    if (clientError) {
                        self.Common.Logger.Error('Error on method DeleteAllValues: Queue ' + queueName + ', error: ' + clientError);
                        reject(clientError)
                    } else {
                        clientReply.forEach((trxToDelete:any, index:number, array:any) => {
                            self.RedisClient.lrem(queueName, 1, trxToDelete, (err:any, reply:any) => {
                                if (err) {
                                    self.Common.Logger.Error('Error on method DeleteValue: Queue ' + queueName + ', error: ' + err);
                                    if (index === array.length - 1) {
                                        reject(err);
                                    }
                                } else {
                                    if (index === array.length - 1) {
                                        resolve(reply);
                                    }
                                }
                            })
                        })
                    }
                })
            } else {
                reject('Redis is disconnected - DeleteAllValues method')
            }
        })
    };

    async DeleteKey() {
        const self = this;
        const queueName = this.QueueName;
        return new Promise((resolve, reject) => {
            self.RedisClient.del(queueName, (err:any, reply:any) => {
                if (err) {
                    self.Common.Logger.Error('Error on method DeleteKey: Queue ' + queueName + ', error: ' + err);
                    reject(err);
                } else {
                    resolve(reply);
                }
            })
        })
    };
}

export = RedisQueue;
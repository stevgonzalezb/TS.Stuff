import Redis from './redis';
import RabbitMq from './rabbitmq';

export = {
	// Redis Client
    Redis(Common:any, Name:any) {
		return new Redis(Common, Name);
	},

	// Rabbit MQ Client
	RabbitMq(Common:any, Name:any) {
		return new RabbitMq(Common, Name);
	}
}
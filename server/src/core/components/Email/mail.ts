import nodemailer from 'nodemailer';
import config from '../../../resources/config';
import crypt from '../Encrypt';


class Email {

    Common: Common;
	Transporter: any;

	constructor(Common: Common){
		this.Common = Common;
		this.Transporter = '';
	}

    async HandleError(Error:any, Text:any) {
        this.Common.Logger.Error(`${Text || ''} ${Error} `);
        return;
    }

    async Config() {
        const self = this;
        return new Promise((resolve, reject) => {

            if (self.Common.Config.SMTP.Password) {
                const decryptedPassword = crypt.Decrypt('SMTP.Password', config.SMTPServer.Password);
                if (decryptedPassword) {
                    const transporterConfig = {
                        host: self.Common.Config.SMTP.Dominio,
                        port: self.Common.Config.SMTP.Puerto,
                        secure: self.Common.Config.SMTP.CanalSeguro,
                        auth: {
                            user: self.Common.Config.SMTP.CuentaCorreo,
                            pass: decryptedPassword
                        },
                        greetingTimeout: self.Common.Config.SMTP.greetingTimeout,
                        tls: {
                            rejectUnauthorized: self.Common.Config.SMTP.FallaEnCertificadoAutoFirmado
                        }
                    };

                    this.Transporter = nodemailer.createTransport(transporterConfig);
                    resolve(this)
                }
            } else {
                try {
                    const transporterConfig = {
                        host: self.Common.Config.SMTP.Dominio,
                        port: self.Common.Config.SMTP.Puerto,
                        secure: self.Common.Config.SMTP.CanalSeguro,
                        greetingTimeout: self.Common.Config.SMTP.greetingTimeout,
                        tls: {
                            rejectUnauthorized: self.Common.Config.SMTP.FallaEnCertificadoAutoFirmado
                        }
                    };

                    this.Transporter = nodemailer.createTransport(transporterConfig);

                    if (this.Transporter) {
                        resolve(this);
                    }

                } catch (error) {
                    this.HandleError(error, error);
                }
            }

        });
    };

    async Send (Subject:string, Message:string) {
        const self = this;
        const email = {
            from: `${self.Common.Config.SMTP.NombreCuenta} <${self.Common.Config.SMTP.CuentaCorreo}>`,
            to: self.Common.Config.SMTP.Destinatarios,
            subject: Subject,
            html: Message

        };

        // Send email
        return new Promise((resolve, reject) => {
            this.Transporter.sendMail(email, (error:any, info:any) => {
                if (error) {
                    reject(error);
                }
                resolve(info);
            })
        })
    };


}

export = Email;
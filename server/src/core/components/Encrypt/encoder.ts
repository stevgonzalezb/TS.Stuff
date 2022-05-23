import crypto from 'crypto'

class Encoder {

    Algorithm:any;

    constructor(Algorithm:any) {
        this.Algorithm = Algorithm
    }

    async Encrypt(Pass:string, Text:string) {
        const cipher = crypto.createCipher(this.Algorithm, Pass.toString())
        let encrypted = cipher.update(Text.toString(), 'utf8', 'hex')
        encrypted += cipher.final('hex');
        return encrypted.toString();
    }

    async Decrypt(Pass:string, Text:string) {
        const decipher = crypto.createDecipher(this.Algorithm, Pass);
        let decrypted = decipher.update(Text.toString(), 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted.toString();
    }
}

export = Encoder;
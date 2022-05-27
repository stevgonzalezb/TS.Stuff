import jsObsfuscator from './jsObfuscator';

export = {
    create(Common:Common){
        return new jsObsfuscator(Common);
    }
}
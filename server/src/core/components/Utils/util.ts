
class Util {

    async IsEmpty(obj:any) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    };

    Sleep(milliseconds:number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    };

    AsyncForeach = async(array:any, callback:any) => {
        for (let i = 0; i < array.length; i++) {
            await callback(array[i], i, array);
        }
    };
}

export = Util;
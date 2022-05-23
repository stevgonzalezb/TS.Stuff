import encoder from './encoder.js'

export = new encoder('p@ssw0rd');

// export ={
// 	init(){
// 		return new encoder('p@ssw0rd');
// 	}
// }

// var fields = process.argv.slice(3)
// var path = process.argv[2]
// if (path) {
//     var Par_fname = path.split("/")
//     var len = process.argv[2].split("/").length
//     var fname = Par_fname[len - 1]
//     var [f, e] = fname.split(".")
//     var con
//     switch (e) {
//         case "js":
//             console.log("js->" + f)
//             con = require(path)
//             console.log(con)
//             case_js(path, con)
//             break;
//         case "json":
//             console.log("json->" + f)
//             con = require(path)
//             console.log(con)
//             case_json(path, con)
//             break;
//         case "env":
//             console.log("env ->")
//             case_env(path)
//             break;
//         default:
//             console.log("el sistema de cifrado solo soporta cifrado para archivos tipo env, json y js")
//             break;
//     }
// } else {
//     console.log("Por favor agregue el archivo que requiere cifrado. ej: npm run cifrar ./config,js password ")
// }

// function case_js(path, file) {
//     fields.forEach(element => {
//         var cifrado = set_data(file, element.toString().split("."), cipher.encrypt(element, get_data(file, element.toString().split("."))))
//         console.log("/----------cifrado Js---------/")
//         console.log(path)
//         console.log(cifrado)
//         fs.writeFileSync(path, "module.exports=" + JSON.stringify(cifrado).replace(/{/g, '\r\n {').replace(/,/g, '\r\n ,'));
//     });
// }

// function case_json(path, file) {
//     fields.forEach(element => {
//         var cifrado = set_data(file, element.toString().split("."), cipher.encrypt(element, get_data(file, element.toString().split("."))))
//         console.log("/---------cifrado Json--------/")
//         console.log(path)
//         console.log(cifrado)
//         fs.writeFileSync(path, JSON.stringify(cifrado).replace(/{/g, '\r\n {').replace(/,/g, '\r\n ,'));
//     });
// }

// function case_env(path) {
//     var file = fs.readFileSync('./.env', 'utf8');
//     //console.log(file)
//     fsplit = file.split("\n")
//     fs.writeFileSync(path, reformat(fsplit))

//     function reformat(array) {
//         var res = []
//         array.forEach((element, index) => {
//             esplit = element.split("=")
//                 //        console.log(element+" "+esplit.length+" "+index)
//             if (esplit.length == 1) {
//                 res.push(element)
//             } else {
//                 if (fields.indexOf(esplit[0]) >= 0) {
//                     res.push(esplit[0] + "=" + cipher.encrypt(esplit[0], esplit[1]))
//                 } else {
//                     res.push(element)
//                 }
//             }
//         })
//         return res.toString().replace(/,/g, '\n')
//     }
// }


// function get_data(object, pathArr) {
//     try {
//         if (pathArr.length == 1) {
//             return object[pathArr[0]]
//         } else {
//             return get_data(object[pathArr[0]], pathArr.slice(1))

//         }
//     } catch (error) {
//         console.log(error)
//     }
// }

// function set_data(object, pathArr, value) {
//     if (pathArr.length == 1) {
//         object[pathArr[0]] = value
//         return object
//     } else {
//         object[pathArr[0]] = set_data(object[pathArr[0]], pathArr.slice(1), value)
//         return object
//     }
//     return object
// }
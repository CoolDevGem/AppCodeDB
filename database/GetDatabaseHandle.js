let GetDBConnection=require('../index').GetDBConnection;
var someFunction = function(appcode, password) {
    return new Promise(function(resolve, reject) {
        /*stuff using username, password*/
        if ( true ) {
            resolve("Stuff worked!");
        } else {
            reject(Error("It broke"));
        }
    });
}
modules.exports =someFunction;
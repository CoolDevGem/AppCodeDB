'use strict';
const Handlebars = require('handlebars')
const Crumb = require('@hapi/crumb');
var Pack = require('pack');
const Iron = require('iron');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const privateKey = require('./config/config').privateKey;

const Hapi = require('@hapi/hapi');
var routesall = require('./routes/index.js');
//const HapiSwagger = require('hapi-swagger');
const serverIP=require('./config/config').serverIP;
const serverport=require('./config/config').serverport;

//let GetDBConnection = require('./database/dbconfigseqmysql');
//module.exports.GetDBConnection = GetDBConnection;
const password = require('./config/config').password;
/*
let alterdb= require('./utils/AlterTableInAllDB_PasswordLength');
alterdb.objectsPromise.then(data => {
        alterdb=data;
        console.log("adddbs then called")
    })
    .catch(error => {
        console.log("Error:"+error);
    });
let adddbs= require('./Adddbentries');
adddbs.objectsPromise
    .then(data => {
        adddbs=data;
        console.log("adddbs then called")
    })
    .catch(error => {
        console.log("Error:"+error);
});*/

async function encryptObj (Value) {

    const obj = { "String": Value };
    try {
        const sealed = await Iron.seal(obj, password, Iron.defaults);
        return sealed;
    } catch (err) {
        console.log(err.message);
    }
}
async function decryptObj (Value){//, callback) {
    try {
        const unsealed = await Iron.unseal(Value, password, Iron.defaults);
        return unsealed;
        //callback(unsealed);
    } catch (err) {
        console.log(err.message);
    }
}
/*GetDBConnection.objectsPromise
    .then(data => {
        GetDBConnection=data;
        console.log("ConnFromAppCOde objectsPromise then called");
    })
    .catch(error => {
        console.log("Error:"+error);
});*/
const people = {
    1: {
        id: 1,
        name: "Jen Jones"
    }
};

// bring your own validation function
const validateFun = async (decoded, request) => {
    console.log("validateFun Decoded Value="+decoded.accountId)
    if (decoded.accountId<0 ) {
        return { isValid: false };
    } else {
        return { isValid: true };
    }
    let appcodeval1=request.payload.appcode;
    console.log("validateFun appcodeval="+appcodeval1)
    decryptObj(appcodeval1).then(data => {
        let appcodevalue = data;
        if (appcodevalue === undefined) {
            console.log('validateFun appcodevalue is ' + appcodevalue)
            return { isValid: false };
        }
        else{
            appcodevalue = appcodevalue.String
            console.log('validateFun appcodevalue=' + JSON.stringify(appcodevalue.String))
            const allKeys = Object.keys(GetDBConnection["GlobalConnection"])
            //console.log(GetDBConnection.GlobalConnection[0]);
            for (var subObj in GetDBConnection["GlobalConnection"]) {
                var SubEntry = GetDBConnection["GlobalConnection"][subObj];
                var objectKeysArray = Object.keys(SubEntry);
                objectKeysArray.forEach(function (objKey) {
                    var objValue = SubEntry[objKey].database;
                    var ac = SubEntry[objKey].appcode;
                    let val1 = "validateFun Conn" + appcodevalue.toString()
                    if (objKey.toString().trim() == val1.toString().trim()) {
                        //console.log("ac=" + ac + "val1=" + val1 + "appcodevalue=" + appcodevalue)
                        if (typeof ac !== "undefined" && ac.toString().trim() == appcodevalue.toString()) {
                            console.log("ac=" + ac + "  objKey=" + objKey + SubEntry[objKey].dbconnection)
                            let Conn = SubEntry[objKey].dbconnection;
                            Conn
                                .authenticate()
                                .then(() => {
                                    //console.log('Connection has been established successfully.');
                                    Conn
                                        .query("SELECT id,api_token from usr where id=" + decodedToken.accountId, {type: tmpConn.QueryTypes.SELECT})
                                        .then(projects => {
                                            console.log("Validate func projects=" + JSON.stringify(projects));
                                            //console.log("projects[0].api_token=" + projects[0].api_token);
                                            console.log("projects[0].api_token=" + projects[0].id);
                                            console.log("request.headers.authorization=" + request.headers.authorization)
                                            console.log("projects[0].api_token=" + projects[0].api_token)
                                            console.log("request.headers.authorization.split(' ')[1].split('.')[0]="+request.headers.authorization.split(' ')[1].split('.')[0])
                                            console.log("projects[0].api_token.split('.')[0]="+projects[0].api_token.split('.')[0])

                                            var error,
                                                credentials = projects[0] || {};

                                            if (( projects[0].api_token.length<20)) {
                                                return { isValid: false };
                                            }
                                            else if (request.headers.authorization && (request.headers.authorization.split(' ')[1].split('.')[0] === projects[0].api_token.split('.')[0])
                                                && (request.headers.authorization.split(' ')[1].split('.')[1] === projects[0].api_token.split('.')[1])
                                                && (request.headers.authorization.split(' ')[1].split('.')[2] === projects[0].api_token.split('.')[2]))
                                            {


                                                if (!credentials) {
                                                    return { isValid: false };
                                                }
                                                return { isValid: true };
                                            } else {
                                                return { isValid: false };
                                            }

                                        })
                                })
                                .catch(err => {
                                    console.error('Unable to connect to the database:', err);
                                    return { isValid: false };
                                });
                        }
                    }
                })
            }
        }
    } );
};
const options = {
    info: {
        'title': 'Awfatech API Documentation - HapiJS',
        'version': "1.0.0",
    }
};

const init = async () => {
    //https://hapi.dev/tutorials/routing/?lang=en_US
    const server = new Hapi.Server({
        host: serverIP,
        port: serverport,
        state: {
            strictHeader: false,
            ignoreErrors: true
        },
        // for cross-origin
        routes: {
            cors: true
        }
    });

    const swaggerOptions = {
        info: {
            title: 'Test API Documentation',
            version: Pack.version,
            name: "Sdsdfsdf"
        },
    };
    //read more https://hapi.dev/tutorials/servermethods/?lang=en_US
    await server.register(
        [
            {
        plugin: Vision,
        options: {
        }
    }, {
        plugin: Inert,
        options: {}
    },
        {
            plugin: require("hapi-auth-jwt2"),
            options: {}
        }/*,
        {
            plugin: Crumb,
            options: {
                restful: true,
                autoGenerate: true,
                cookieOptions: {
                    isSecure: false
                }
            }
        },
        {
            plugin: HapiSwagger,
            name : "asdasd",
            options: swaggerOptions
        }*/]).then(() => {

    });

    server.auth.strategy("jwt", "jwt", {
        key: privateKey,
        validate: validateFun,
        verifyOptions: { algorithms: ["HS256"] }
    });

    //server.auth.default("jwt");


    //read more at https://futurestud.io/tutorials/hapi-how-to-render-views
    server.views({
        engines: {
            html: Handlebars
        },
        path: __dirname + '/views',
        layout: 'layout'
    })

    // Add the route
    //https://futurestud.io/tutorials/hapi-how-to-manage-cookies-and-http-states-across-requests
    server.state('session', {
        ttl: 1000 * 60 * 60 * 24,    // 1 day lifetime
        encoding: 'base64json'       // cookie data is JSON-stringified and Base64 encoded
    });
     server.route(routesall);
    await server.start((err) => {
        if (err) {
            throw err;
        }
        console.log('Server running at:', server.info.uri);
    });
    return server;
};
init()
    .then(server => {
        console.log("Server running at:", server.info.uri);
    })
    .catch(error => {
        console.log(error);
    });
// Start the server


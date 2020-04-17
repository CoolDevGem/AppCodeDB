var mysql = require('mysql');
const Sequelize = require('sequelize');
const CJSON = require('circular-json');
var events = require('events');
var em = new events.EventEmitter();
var _ = require('lodash');
var globalDBconf ={};
const mysqlrootpass=require('../config/config').mysqlrootpass;
const mysqlappcoddb=require('../config/config').mysqlappcoddb;
const mysqltelegramdb=require('../config/config').mysqltelegramdb;
const mysqldbhost=require('../config/config').mysqlappcoddbhost;
const mysqldbport=require('../config/config').mysqlappcoddbport;
const mysqluser=require('../config/config').mysqluser;
const dbhost=require('../config/config').serverIP;
const dbport=require('../config/config').serverport;

module.exports.objectsPromise = new Promise((resolve, reject) => {
    var dbconfig = {
        "database": "",
        "username": "",
        "password":  "",
        "host": "",
        "port": "",
        "dialect": "mssql",  //second database can have a different dialect
        "dialectModule":"",
        "dbconnection":"",
        "appcode":""
    };
    // Open a Mysql Database connectin
    var connectionstr = 'mysql://'+mysqluser+':'+mysqlrootpass+'@'+mysqldbhost+':'+mysqldbport
                +'/'+mysqltelegramdb;
    //reade more at https://github.com/danecando/hapi-sequelize
    console.log("connectionstr="+connectionstr)
    var sequelize = new Sequelize(connectionstr, {
        pool: {
            max: 2, //pool setting
            min: 1,
            acquire: 30000,
            idle: 60000
        }
    });
    try {
      sequelize.authenticate();
      console.log('Connection has been established successfully.');
      resolve(sequelize);
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      reject("connection establishing error");
    }
    
});

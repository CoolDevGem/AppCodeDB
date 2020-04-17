
let GetDBConnection=require('../database/dbconfigseqmysql');
GetDBConnection.objectsPromise
    .then(data => {
      GetDBConnection=data;
      console.log("ConnFromAppCOde objectsPromise then called");
      console.log("We have started testing 1-100 Appcodes");
      let dbstr='api01_test';
      for (var i=1;i<20;i++) {
        let appcodevalue=("000" + i).slice(-4);
        console.log("Count="+i+" Appcode= "+appcodevalue);
        const allKeys = Object.keys(GetDBConnection["GlobalConnection"])
        //console.log(GetDBConnection.GlobalConnection[0]);
        for (var subObj in GetDBConnection["GlobalConnection"]) {
          var SubEntry = GetDBConnection["GlobalConnection"][subObj];
          var objectKeysArray = Object.keys(SubEntry);
          objectKeysArray.forEach(function (objKey) {
            var objValue = SubEntry[objKey].database;
            var ac = SubEntry[objKey].appcode;
            let val1 = "Conn" + appcodevalue.toString()
            if (objKey.toString().trim() == val1.toString().trim()) {
              //console.log("ac=" + ac + "val1=" + val1 + "appcodevalue=" + appcodevalue)
              if (typeof ac !== "undefined" && ac.toString().trim() == appcodevalue.toString()) {
                console.log("ac=" + ac + "  objKey=" + objKey + SubEntry[objKey].dbconnection)
                let tmpConn = SubEntry[objKey].dbconnection;
                //callback(tmpConn);
                //console.log("DBConnection is " + tmpConn)
                tmpConn
                    .authenticate()
                    .then(() => {
                      console.log('Connection has been established successfully.');
                      tmpConn
                          .query("SELECT id,mel FROM usr ", {type: tmpConn.QueryTypes.SELECT})
                          .then(projects => {
                            console.log("Query is successul for count= "+i+" appcode="+appcodevalue)
                            //resolve({"data": projects})
                          })

                    })
                    .catch(err => {
                      console.error('Unable to connect to the database:', err);
                      //resolve({"error": err})
                    });
              }
            }
          })
        }

      }

    })
    .catch(error => {
      console.log("Error:"+error);
    });
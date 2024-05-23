//NodeJS Libraries
const dns = require('dns')
const https = require('https')

//3rd party libraries
const express = require('express')
const cors = require('cors')
const xml2js = require('xml2js')

const app = express()
let port = 5000;

app.use(cors())

app.use(express.urlencoded({ 
    
    extended: true,
    limit: 1000,
    parameterLimit: 5

}))

app.get('/favicon.ico', (req, res) => res.status(204));

app.get("/finesse", (req, response) => {

    let parser = new xml2js.Parser()

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
        keepAlive: true, 
        keepAliveMsecs: 15000
    });

    const options = {
    
        //https://User:Password@URL/finesse/api/

        hostname: `URL`,
        path: "/finesse/api/Team/TeamID",
        port: "443",
        method: 'GET',
        agent: httpsAgent,
        headers: { 'Authorization': 'Basic ' + btoa('user:password') }
       

    };

    //console.log("Finesse: Requesting data from server " + options.hostname)

    try{

        https.get(options, function(res) {
            var response_data = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                response_data += chunk;
            });
            res.on('end', function() {
                parser.parseString(response_data, function(err, result) {
                    if (err) {
                        console.log('Got error: ' + err.message);
                    } else {

                        result = result.Team.users[0].User

                        let sortedData = {
                            "ready":[],
                            "busy":[],
                            "away":[],
                            "other":[],
                        
                        }

                        for(i in result) {

                            if(result[i].state == "READY") {

                                sortedData.ready.push({

                                    "state":"Ready",
                                    "time": new Date() - new Date(result[i].stateChangeTime[0]),
                                    "name":`${result[i].firstName} ${result[i].lastName}`,
                                    "id":result[i].loginId[0],
                                    "extension": result[i].extension[0]

                                })

                            }else if(result[i].state == "WORK_READY") {

                                sortedData.busy.push({

                                    "state":"Wrap up",
                                    "time": new Date() - new Date(result[i].stateChangeTime[0]),
                                    "name":`${result[i].firstName} ${result[i].lastName}`,
                                    "id":result[i].loginId[0],
                                    "extension": result[i].extension[0]

                                })

                            }else if(result[i].state == "TALKING") {

                                sortedData.busy.push({

                                    "state":"In call",
                                    "time": new Date() - new Date(result[i].stateChangeTime[0]),
                                    "name":`${result[i].firstName} ${result[i].lastName}`,
                                    "id":result[i].loginId[0],
                                    "extension": result[i].extension[0]

                                })

                            }else if(result[i].state == "RESERVED") {

                                sortedData.busy.push({

                                    "state":"Reserved",
                                    "time": new Date() - new Date(result[i].stateChangeTime[0]),
                                    "name":`${result[i].firstName} ${result[i].lastName}`,
                                    "id":result[i].loginId[0],
                                    "extension": result[i].extension[0]

                                })

                            }else if(result[i].state == "NOT_READY") {

                                sortedData.away.push({

                                    "state":"Away",
                                    "time": new Date() - new Date(result[i].stateChangeTime[0]),
                                    "name":`${result[i].firstName} ${result[i].lastName}`,
                                    "id":result[i].loginId[0],
                                    "extension": result[i].extension

                                })

                            }else {

                                sortedData.other.push({

                                    "state":"Not available",
                                    "time": new Date() - new Date(result[i].stateChangeTime[0]),
                                    "name":`${result[i].firstName} ${result[i].lastName}`,
                                    "id":result[i].loginId[0],
                                    "extension": result[i].extension

                                })

                            }

                        }

                        response.end(JSON.stringify(sortedData))
    
                        //console.log('Finesse: Data retrieved from server and sent to client');
    
                    }
                });
            });
            res.on('error', function(err) {
                console.log('Finesse: An error occured: ' + err.message);
            });
        });

    }catch {

        console.log("Finesse: Unable to retrieve data from " + options.hostname)

    }
})

app.listen(port, () => {

    console.log(`Listening on ${port}`)

})
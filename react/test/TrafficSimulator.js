const trafficSimulator = require("http-traffic-simulator");

let run = function() {
    trafficSimulator.testDuration(10);//-1 for infinite run
    trafficSimulator.workers(4);
    trafficSimulator.clients(8)
    trafficSimulator.throttleRequests_bps(-1);//-1 for no throttling
    trafficSimulator.randomDelayBetweenRequests('0.5-1.1');

    trafficSimulator.setFunc('request',requestFunc);

    trafficSimulator.start();

    trafficSimulator.events.on('end',function (stats) {
        console.log("Exiting..");
        process.exit();
    });
}

let calls = 0;
let requestFunc = function() {
    let options = {};
    options['host'] = 'backstorybrewery-220406.appspot.com';
    options['port'] = '80';
    options['path'] = '/api/v1/gamelist';
    options['method'] = 'GET';

    let req=trafficSimulator.request(options,function(response){
        //console.log(response);

        console.log("Response: %s",response.statusCode);
        response.setEncoding('utf8');
        response.on('data',function(chunk){

            console.log(chunk)
        });
    });
};

run();
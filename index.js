'use strict'
const express=require('express');
const bodyParser=require('body-parser');
const http=require('http');
const server=express();
const request=require('request');
server.use(bodyParser.urlencoded({
    extended:true
}));
server.set('port',(process.env.PORT||5002))

server.use(bodyParser.urlencoded({extended:false}))
server.use(bodyParser.json());
server.get('/',function(req,res){
	res.send("Hi i am chatboting")
})
setInterval(function(){
	http.get("http://damp-dawn-46880.herokuapp.com");},300000);

server.post('/NODECODE',function(req,res){

    console.log(req.body.result);
    let symbol=(req.body.result&&req.body.result.parameters&&req.body.result.parameters.Stock_Name)? req.body.result.parameters.Stock_Name: "Can't find stock";

    let funct=(req.body.result&&req.body.result.parameters&&req.body.result.parameters.Time_Series)?req.body.result.parameters.Time_Series: "Undefined Time Series Function";

   funct=(req.body.result&&req.body.result.parameters&&req.body.result.parameters.Time_Series_Adjusted=="true")? req.body.result.parameters.Time_Series.concat('_ADJUSTED'): req.body.result.parameters.Time_Series;

    let time_period=(req.body.result&&req.body.result.parameters&&req.body.result.parameters.Time_Interval)?req.body.result.parameters.Time_Interval: "Undefined Time period";

    let num=(req.body.result&&req.body.result.parameters&&req.body.result.parameters.number)?req.body.result.parameters.number: "1";
console.log(symbol+" "+funct+" "+time_period+" "+num+" ");
    let reqUrl=encodeURI('https://www.alphavantage.co/query?function='+funct+'&symbol='+symbol+'&apikey=EVFLVDJI1W4XBPTN&interval='+num+time_period);
    console.log(reqUrl);
    request.get(reqUrl,(error,reponse,body)=>{
        let json=JSON.parse(body);
        let send="";

        let MetaData=json["Meta Data"];
        for(var key in MetaData)
            {
                send+=key+" "+MetaData[key]+"     ";
            }
        let name="";
        for(var key in json)
            {
                send+=key+"     ";
                name=key;
            }
       let RealTimeData=json[name];
       for(var key in RealTimeData)
           {
                send+=key+"   "
                let info=RealTimeData[key];
               for(var k in info)
                   {
                       send+=k+"   "+info[k]+"    ";
                   }
            }

        res.setHeader('Content-Type','application/json');
        res.send(JSON.stringify({
            'speech':send,
            'displayText':send
    }));

    }); // end of request.get

}); // end of post
server.listen(server.get('port'),function(){
console.log("i am running")
})

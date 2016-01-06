
/*
//sensor 1: sensor de luz
//sensor 2: boton
//sensor 3: proximidad
//sensor 4: temperatura
//sensor 5: 

//actuador 1: led azul
//actuador 2: led amarillo
//actuador 3: sonido speaker
//actuador 4: motor
//actuador 5: 
*/

var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var methodOverride = require("method-override");
var port = process.env.PORT || 3000;
var app = express();
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static(__dirname + '/public'));
var router = express.Router();



var five = require("johnny-five"),
  board;
board = new five.Board();

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

board.on("ready", function() {
  var led_azul = new five.Led(9); // Sensor de luz
  var led_amarilla = new five.Led(10); //Sensor proximidad  
  var piezo = new five.Piezo(5);
  var button = new five.Button(2);
  var photoresistor = new five.Sensor({
    pin: "A0",
    freq: 250
  });
  var proximity = new five.Proximity({
    controller: "HCSR04",
    pin: 8
  });

  board.repl.inject({
    pot: photoresistor
  });
  board.repl.inject({
    piezo: piezo
  });
  board.repl.inject({
    button: button
  });

  photoresistor.on("data", function() {
    if (this.value>900) {
      led_azul.on();
    }
    else{
      led_azul.off();
    };
  });

  button.on("down", function() {
    piezo.play({
      song: "C D F D A - A A A A G G G G - - C D F D G - G G G G F F F F - -",
      beats: 1 / 4,
      tempo: 100
    });
  });
  proximity.on("data", function() {
    if (this.cm<10) {
      led_amarilla.on();
      piezo.play({
        song: "C C C - - - C C C - - - C C C - - - C C C",
        beats: 1 / 4,
        tempo: 100
      });        
    }
    else{
      led_amarilla.off();
    };
  });




  app.post('/luz-amarilla', function(req, res) {
    if (req.body.estado == "prendido"){
      led_amarilla.on();
      console.log("on luz-amarilla");
    }
    else{
      led_amarilla.off();      
      console.log("off luz-amarilla");
    };
    res.status(200).end();
  });


  app.post('/alarma', function(req, res) {
    if (req.body.estado == "prendido"){
      piezo.play({
        song: "C C C - - - C C C - - - C C C - - - C C C",
        beats: 1 / 4,
        tempo: 100
      });  
      console.log("on alarma");
    }
    res.status(200).end();
  });

  app.post('/ventilador', function(req, res) {
    if (req.body.estado == "prendido"){
      //led_azul.on();
      console.log("on ventilador");
    }
    else{
      //led_azul.off();      
      console.log("off ventilador");
    };
    res.status(200).end();
  });

  app.post('/servo', function(req, res) {
    if (req.body.estado == "prendido"){
      //led_azul.on();
      console.log("on servo");
    }
    else{
      //led_azul.off();      
      console.log("off servo");
    };
    res.status(200).end();
  });

  app.post('/actuador5', function(req, res) {
    if (req.body.estado == "prendido"){
      //led_azul.on();
      console.log("on actuador5");
    }
    else{
      //led_azul.off();      
      console.log("off actuador5");
    };
    res.status(200).end();
  });
  
  /*
  app.get('/sensor-luz/', function (req, res) {
    var result;

    photoresistor.on("data", function() {
      result = this.value;
      console.log("valor1: "+result);
    });
    console.log("valor2: "+result);
    //res.send(result);
    //res.send(JSON.stringify(result, '\n', '\t'));
    res.status(200).end();
  });
  */




});


var server = http.createServer(app);
server.listen(port, function () {
  console.log('Servidor en puerto '+port);
});

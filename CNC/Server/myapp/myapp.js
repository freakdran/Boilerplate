const express = require('express');
const app = express();
const cors = require('cors');
const router = express.Router();
const parser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');

app.use(cors());
app.use('/api',router);
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

let bots;
let tasks;
let reports;

/*
Beide Arrays werden einmalig erstellt aus .json Datei
*/
fs.readFile('./bots.json', 'utf8', (err, data) => {

    if (err) throw err;
    bots = JSON.parse(data);
});

fs.readFile('./tasks.json', 'utf8', (err, data) => {

    if (err) throw err;
    tasks = JSON.parse(data);
});

fs.readFile('./reports.json', 'utf8', (err, data) => {

    if (err) throw err;
    reports = JSON.parse(data);
});
/*
Server erstellen mit Port 3000 (localhost:3000)
*/
app.listen(3000, function () {
  console.log('Server opened on Port 3000');
});

/*
All the GET
*/
app.get('/', function (req, res) {
  res.send('<pre style = "font-family:  monospace;">Not found</pre>');
});

router.get('/', function (req, res) {
  res.send('<pre style = "font-family:  monospace;">Site not found</pre>');
});

router.get('/Status', function (req, res) {
  res.json(bots);
});

router.get('/Status/:id', function (req, res) {

  if(req.params.id < bots.length) {
    let myfuckingbot = bots[req.params.id];
    //res.send(JSON.stringify(myfuckingbot, null, '\t'));
    res.json(bots[req.params.id]);
  } else {
    res.send('Bot id not found');
  }
});

router.get('/Tasks', function (req, res) {
  res.json(tasks);
});

router.get('/Tasks/:id', function (req, res) {

  if(req.params.id < tasks.length) {
    res.json(tasks[req.params.id]);
  } else {
    res.send('Task id not found');
  }
});

router.get('/Reports', function (req, res) {
  res.json(reports);
});

/*
All the POST
*/
app.post('/api/Status', (req, res) => {
  var idpresent = false;
  var botnumber;


  for(var i = 0; i < bots.length; i++) {
    if(bots[i].id === req.body.id) {
      idpresent = true;
      botnumber = i;
    }
  }

  if(idpresent && typeof req.body.status === 'boolean') {
    if(req.body.status === true) {
      bots[req.body.id].workload = 1.0;
      console.log('Bot with id:' + req.body.id + ' set to 1');
    } else {
      bots[req.body.id].workload = 0.0;
      console.log('Bot with id:' + req.body.id + ' set to 0');
    }

    idpresent = false;
    res.json('OK');
  } else {
    res.json('NOT OK');
  }
});

app.post('/api/Status/:id', (req, res) => {
  if(req.params.id < bots.length) {
    res.json({message: 'OK'});
  } else {
    res.json({message: 'NOT OK'});
  }
});

app.post('/api/Tasks', (req, res) => {

  var newTaskType;

  switch(req.body.type) {
    case 'hash-md5': newTaskType = req.body.type ;
    break;
    case 'hash-sha256': newTaskType = req.body.type ;
    break;
    case 'crack-md5': newTaskType = req.body.type ;
    break;
    default: console.log('Falscher Typ');
  }

  if(newTaskType != null) {

    var newID = 0;
    var taskPresent = false;

    for(var i = 0; i < tasks.length; i++) {
      newID = Math.max(tasks[i].id, newID);
      if(tasks[i].data.input === req.body.data.input && tasks[i].type === req.body.type) {
        taskPresent = true;
      }
    }
    if(!taskPresent) {
      var newTask = {
          id: newID+1,
          type: newTaskType,
          data: {
            input: req.body.data.input,
            output: null
          }
      };
      console.log('Task addded');
      tasks.push(newTask);
      savaData();
      res.json('OK');
    } else {
      console.log('Task already present');
      res.json('NOT OK');
    }
  } else {
    res.json('NOT OK');
  }
});

app.post('/api/Tasks/:id', (req, res) => {
  if(req.params.id < tasks.length) {
    res.json({message: 'OK'});
  } else {
    res.json({message: 'NOT OK'});
  }
});

app.post('/api/Reports', (req, res) => {
  /*
  Wenn output === null => NOT OK
  Wenn output !== null => OK + Berechnen
  */

  console.log('got post request');
  for(var i = 0; i < tasks.length; i++) {
    if(tasks[i].id === req.body.id) {
      if(req.body.data.output !== null) {
        newReport = {
          id: tasks[i].id,
          type: tasks[i].type,
          data: {
            input: tasks[i].data.input,
            output: req.body.data.output
          }
        }
        reports.push(newReport);
        tasks[i].data.output = req.body.data.output;
        console.log('added');
        break;
      } else {
        console.log('output still null');
      }
    } else {
      console.log('ids not matching || requested Task id not present');
    }
  }




})

app.post('/api/Crypter', (req, res) => {

  var input = req.body.input;
  var type = req.body.type;

  console.log(req.body);

  if(input !== null) {
    if(type !== null) {
      if(type === 'hash-md5') {
        let md5sum = crypto.createHash('md5');
        md5sum.update(input);
        let result = md5sum.digest('hex');
        console.log(result);
        res.responseText = 'asdf';
        res.json(result);
      } else if(type === 'hash-sha256') {
        let sha256sum = crypto.createHash('sha256');
        sha256sum.update(input);
        let result = sha256sum.digest('hex');
        res.json(result);
      } else if(type === 'crack-md5') {
        console.log('crack-md5 not supported');
      } else {
        console.log('Wrong type');
      }
    } else {
      console.log('No type defined');
      res.json({'output': null});
    }
  } else {
    console.log('No input');
    res.json({'output': null});
  }

});

var savaData = function() {
  console.log('Backup made');
/*
  fs.writeFile('./reports.json', JSON.stringify(reports), 'utf8', (err) => {
    if (err) throw err;
  });
*/
  fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', (err) => {
    if (err) throw err;
  });

  fs.writeFile('./bots.json', JSON.stringify(bots), 'utf8', (err) => {
    if (err) throw err;
  });
}



setInterval(
  function() {
    savaData();
  }, 10000
);

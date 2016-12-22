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
/* = [
  {
    id:0,
    ip: '127.0.0.1',
    task: 1,
    workload: 0.0
  },{
    id:1,
    ip: '182.142.154.214',
    task: 1,
    workload: 1.0
  },{
    id:2,
    ip: '246.73.94.71',
    task: 1,
    workload: 0.0
  },{
    id:3,
    ip: '8ba7:8331:1b2:a51b:ff59:bd75:6da7:bff3',
    task: 1,
    workload: 1.0
  },{
    id:4,
    ip: '686e:ef75:7515:24ad:d45c:6f16:81dd:90a4',
    task: 1,
    workload: 0.0
  }
];
*/

let tasks;
/* = [
  {
    id:0,
    type: 'hash-md5',
    data: {
      input: 'sample with output',
      output: 'tuptuo htiw elpmas'
    }
  },{
    id:1,
    type: 'hash-md5',
    data: {
      input: 'sample without output',
      output: 'null'
    }
  }
]

*/

let reports;

/*
fs.writeFile('./bots.json', JSON.stringify(bots), 'utf8', (err) => {
  if (err) throw err;
});

fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', err => {
  if (err) throw err;
})
*/

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

  for(var i = 0; i < tasks.length; i++) {
    if(tasks[i].id === req.params.id) {
      if(req.params.data.output !== null) {
        newReport = {
          id: tasks[i].id,
          data: {
            input: tasks[i].data.input,
            output: req.params.id
          }
        }
        reports.push(newReport);
        tasks[i].data.output = req.params.data.output;

        break;
      } else {
        console.log('output still null');
      }
    } else {
      console.log('requested Task id not present');
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

var saveData = function() {

  fs.writeFile('./reports.json', JSON.stringify(reports), 'utf8', (err) => {
    if (err) throw err;
  });

  fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', (err) => {
    if (err) throw err;
  });

  fs.writeFile('./bots.json', JSON.stringify(bots), 'utf8', (err) => {
    if (err) throw err;
  });
}



//setInterval('saveData()', 10000);

/*
const fs = require('fs');

var datass;
fs.readFile('./mytext.txt', 'utf8', (err, data) => {

    if (err) throw err;

    console.log(data);	// 'foobar'
	  datass = data;

});

fs.writeFile('./mytextwrite.txt', datass, (err) => {
  if (err) throw err;
  console.log(datass);
  console.log('It\'s saved!');
});

var foo = 'asdf\nfdsa\nfoo\noof';
fs.writeFile('./mytextwrite2.txt', foo, (err) => {
  if (err) throw err;
  console.log('It\'s saved!');
});
*/

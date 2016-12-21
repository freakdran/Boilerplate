const express = require('express');
const app = express();
const cors = require('cors');
const router = express.Router();
const parser = require('body-parser');
const fs = require('fs');

app.use(cors());
app.use('/api',router);
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

/*
Bot Array mit max 5 Bots
*/

let bots /* = [
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



/*
Task Testarray mit bei neustart 2 Tasks
*/
let tasks /* = [
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


/*
fs.writeFile('./bots.json', JSON.stringify(bots), 'utf8', (err) => {
  if (err) throw err;
});

fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', err => {
  if (err) throw err;
})
*/

fs.readFile('./bots.json', 'utf8', (err, data) => {

    if (err) throw err;
    bots = JSON.parse(data);
});

fs.readFile('./tasks.json', 'utf8', (err, data) => {

    if (err) throw err;
    tasks = JSON.parse(data);
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

    fs.writeFile('./bots.json', JSON.stringify(bots), 'utf8', (err) => {
      if (err) throw err;
    });
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

    for(var i = 0; i < tasks.length; i++) {
        newID = Math.max(tasks[i].id, newID);
    }

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

    fs.writeFile('./tasks.json', JSON.stringify(tasks), 'utf8', (err) => {
      if (err) throw err;
    });
    res.json('OK');
  } else {
    res.json('NOT OK');
  }
})

app.post('/api/Tasks/:id', (req, res) => {
  if(req.params.id < tasks.length) {
    res.json({message: 'OK'});
  } else {
    res.json({message: 'NOT OK'});
  }
});


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

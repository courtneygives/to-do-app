var router = require('express').Router();
var path = require('path');
var pg = require('pg');
var bodyParser = require('body-parser');


var Connect = require('../db/connection.js').Connect;

// ::::::::: GET ALL ROWS ::::::::: //
router.get('/', function(request, response){
  pg.connect(Connect, function(err, client, done){
    if (err){
      console.log('Error getting all rows: ' + err);
      response.sendStatus(500);
    } else {
      var query = client.query('SELECT * FROM tasks');
      var results = [];
      query.on('error', function(err){
        console.log('Query error: ' + err);
        done();
        response.sendStatus(500);
      });
      query.on('row', function(rowData){
        results.push(rowData);
      });
      query.on('end', function(){
        response.send(results);
        done();
      });
    }
  });
});


// ::::::::: ADD NEW ROW ::::::::: //

router.post('/', function(request, response){
  console.log('Task added :' + request.body.task_content);
  pg.connect(Connect, function(err, client, done){
    if (err){
      console.log('Error posting: ' + err);
      response.sendStatus(500);
    } else {
      var result = [];
      var task_content = request.body.task_content;
      var task_status = request.body.task_status;
      var due_date = request.body.due_date;


      var query = client.query('INSERT INTO tasks (task_content, task_status, due_date) VALUES ($1, $2, $3)' + 'RETURNING id, task_content, task_status, due_date', [task_content, task_status, due_date]);

      query.on('row', function(row){
        result.push(row);
      });

      query.on('end', function(){
        done();
        response.send(result);
      });
    }
  });
});

// ::::::::: MODIFY ROW ::::::::: //
// var query = client.query("UPDATE tasks SET completed = true WHERE (id = " + taskID + ");");



// ::::::::: DELETE ROW ::::::::: //
router.post('/remove', function(request, response){
  console.log('Deleting task: ' + request.body.id);
  pg.connect(Connect, function(err, client, done){
    if (err){
      console.log('Error posting: ' + err);
      response.sendStatus(500);
    } else {
      var query = client.query('DELETE FROM tasks WHERE (id = ' + request.body.id + ';)');
  }
});
});


module.exports = router;

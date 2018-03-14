/*****************************************************************************
  NODE PACKAGES SET UP
*****************************************************************************/
var express = require('express');
var mysql = require('./dbcon.js');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8315);

app.use(express.static('public'));




/*****************************************************************************
  HOME
*****************************************************************************/
app.get('/',function(req,res){
  console.log("This is home");
  res.render('home');
});



/*****************************************************************************
  DISPLAY
*****************************************************************************/
app.get('/display',function(req,res){   //was home1
  console.log("This is /display. I got a GET request");
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
  // var queryResult = mysql.pool.query('SELECT * FROM Students', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    console.log("Still from /display",context); //good, consoles the JSON object of students
    //  Now send this data (that we had console.log'd) via res.send() instead of console.log

    res.type('application/json')
    res.send(rows); //ORIGINAL
  })
});

/*****************************************************************************
  INSERT
*****************************************************************************/
app.post('/insert',function(req, res){
  console.log("this is /insert. I got a POST request to ADD.");
  var context = {};
  mysql.pool.query('INSERT INTO Students (`fname`, `lname`, `house`) VALUES (?,?,?)',
    [req.body.fname, req.body.lname, req.body.house], function(err, result){
      if(err){
        next(err);
        return;
      }

      context.results = JSON.stringify(result);
      console.log("What I got from /insert: ",context);
      res.type('application/json');
      res.send(rows);
    }
)
})



/*****************************************************************************
  DELETE
*****************************************************************************/

/*****************************************************************************
  UPDATE
*****************************************************************************/


/*****************************************************************************
  RESET-TABLE
*****************************************************************************/
app.get('/reset-table',function(req,res,next){
  var context = {};
  [your connection pool].query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    [your connection pool].query(createString, function(err){
      context.results = "Table reset";
      res.render('home',context);
    })
  });
});


/*****************************************************************************
  ERROR HANDLERS, CONNECT PORT
*****************************************************************************/
app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});

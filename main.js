/*****************************************************************************
  NODE PACKAGES SET UP
*****************************************************************************/
var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');  //NEED THIS FOR THE POST!!!!!

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8315);

app.use(express.static('public'));




/*****************************************************************************
  HOME
*****************************************************************************/
app.get('/',function(req,res){
  console.log("This is home");
  var context = {};
  res.render('home', context);
});



/*****************************************************************************
  DISPLAY
*****************************************************************************/
app.get('/display',function(req,res, next){
  console.log("This is /display. I got a GET request");
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    // context.results = JSON.stringify(rows);
    console.log("Still from /display",context);

    res.type('application/json')
    res.send(rows);
  })
});

/*****************************************************************************
  INSERT
*****************************************************************************/
app.post('/insert',function(req, res, next){
  console.log("this is /insert. I got a POST request to ADD.");
  var context = {};
  if(req.body.name !== ""){
    mysql.pool.query('INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?,?,?,?,?)',
      [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.lbs], function(err, rows, fields){
        if(err){
          next(err);
          return;
        }
        // res.send(rows); //Going to try sending rows

      mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
          if (err){
            next(err);
            return;
          }
          // context.results = JSON.stringify(result);
          console.log("What I got from /insert: ", context);
          res.type('application/json');
          res.send(rows);
      });

      // context.results = JSON.stringify(result);
      // console.log("What I got from /insert: ",context);
      // res.type('application/json');
      // res.send(result);

    });
  }

});




/*****************************************************************************
  DELETE
*****************************************************************************/
app.post('/delete', function(req, res){
  console.log("This is /delete.  I got a POST request to DELETE");
  var context = {};
  mysql.pool.query("DELETE FROM workouts WHERE id = ?", [req.body.id], function(err, result){
    if(err){
      next(err);
      return;
    }

    mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
        if (err){
          next(err);
          return;
        }
        context.results = JSON.stringify(result);
        console.log("What I got from /delete: ", context);
        res.type('application/json');
        res.send(rows);
    });
  });
});


/*****************************************************************************
  UPDATE
*****************************************************************************/
app.get('/update', function(req, res, next){
  var context = {};
  console.log("The requested QUERY for GET from /update.");
  //Get the hidden id. Use QUERY.
  context.id = req.query.id;
  console.log(context);
  res.render('update', context);
});


app.post("/update", function(req, res, next){
  var context = {};
  console.log("The requested BODY for POST from /update.");
  //Get hidden id. Use BODY.
  context.id = req.body.id;
  console.log(context);

  res.type('application/json');
  res.render('update', context);
})

//Parameter would be: /safe-update?id=2&name=Jogging&reps=....
app.get('/form-update',function(req,res,next){
  var context = {};
  mysql.pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){
   if(err){
     next(err);
     return;
   }
   if(result.length == 1){
     var curVals = result[0];

     mysql.pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=? ",
       [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id],
       function(err, result){
       if(err){
         next(err);
         return;
       }

   context.results = JSON.stringify(result);
   console.log("From /form-update: ");
   console.log(JSON.stringify(result));

      //After updating via update form, return home
       res.render('home');
     });
   }
 });
});



/*****************************************************************************
  RESET-TABLE
*****************************************************************************/
app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
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

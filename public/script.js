
/*****************************************************************************
0. THE ADD (INSERT) BUTTON
*****************************************************************************/
//https://stackoverflow.com/questions/7066191/javascript-onclick-onsubmit-for-dynamically-created-button
//https://stackoverflow.com/questions/18831783/how-to-call-a-server-side-function-from-client-side-e-g-html-button-onclick-i
var addButtonFunction = function(){
  var button = document.createElement('button');
  button.id="addButton"
  button.innerHTML = 'ADD WORKOUT';
  button.onclick = function(){
    return false;
  };

  document.getElementById('addWorkoutForm').appendChild(button);
    // document.body.appendChild(button);
};

//CALL THIS F'N FOR ADD WORKOUT BUTTON TO SHOW
addButtonFunction();



/*****************************************************************************
1. DISPLAY  (new xml, GET)
*****************************************************************************/
//Get form id
var addWorkout = document.getElementById("addWorkoutForm");

//Create a request in order to add the element to the server
var ourRequest = new XMLHttpRequest();

//GET request to /display route
ourRequest.open('GET', '/display', true);

//Do something with the data when it gets loaded.
//Alternatively can do: ourRequest.addEventListener("load", function(){});
ourRequest.onload = function(){ // ourRequest.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  //A. If the data from server loads properly, then do something with it.
  if(ourRequest.status >= 200 && ourRequest.status < 400){
    var ourData = JSON.parse(ourRequest.responseText); //Parse the loaded JSON data
    console.log(ourData); //Display the objects to client console

    //Dynamically create a table to display the loaded ourData (f'n definition below)
    generate_table(ourData);
  }
  //B. If data fails to load from the server, print error message.
  else{
    console.log("Error in network request: " + ourRequest.statusText);
  }
};

//don't put this here before ourRequest.send(): console.log(ourData);
ourRequest.send();
/* 8. Add console.log() statement to client-side code in callback of the GET ourRequest
  and log the info coming back from the request*/
// console.log(ourData); guess should be in onload bc ourData not defined


//https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces
//https://www.w3schools.com/jsref/met_table_insertrow.asp
//https://www.w3schools.com/html/html_tables.asp
/* <table>
    <tr>
      <th>  <th>  <th>
    <tr>
      <td>  <td>  <td>
    <tr>
      <td>  <td>  <td>
*/
function generate_table(loadedJSON){
  //Get the table (from home.handlebars)
  var table = document.getElementById("displayTable");

  //Create a header row <tr> with header cells <th>
  var head_row = document.createElement("tr");

  var head_name = document.createElement("th");
  var head_reps = document.createElement("th");
  var head_weight = document.createElement("th");
  var head_date = document.createElement("th");
  var head_unit = document.createElement("th");
  var head_update = document.createElement("th");
  var head_delete = document.createElement("th");

  //Append upward to each parent
  head_name.innerText = "Exercise";
  head_row.appendChild(head_name);

  head_reps.innerText = "Reps";
  head_row.appendChild(head_reps);

  head_weight.innerText = "Weight";
  head_row.appendChild(head_weight);

  head_date.innerText = "Date";
  head_row.appendChild(head_date);

  head_unit.innerText = "Unit";
  head_row.appendChild(head_unit);

  head_update.innerText = "Update";
  head_row.appendChild(head_update);

  head_delete.innerText = "Delete";
  head_row.appendChild(head_delete);

  table.appendChild(head_row);

  //For each item in loaded JSON object, create new row and insert elements
  //https://stackoverflow.com/questions/921789/how-to-loop-through-plain-javascript-object-with-objects-as-members
  //https://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure
  loadedJSON.forEach(function(item){
    //Create new row/cells to put the loaded JSON in
    var add_row = document.createElement("tr");

    var add_name = document.createElement("td");
    var add_reps = document.createElement("td");
    var add_weight = document.createElement("td");
    var add_date = document.createElement("td");
    var add_unit = document.createElement("td");
    var add_update = document.createElement("td");
    var add_delete = document.createElement("td");

    /*loaded JSON on client console:
        0:{id: 2, name: "jog", reps: 0, weight: 0, date: "0000-00-00", …}
        1:{id: 3, name: "run", reps: 0, weight: 0, date: "0000-00-00", …}
        2:{id: 4, name: "swim", reps: 0, weight: 0, date: "0000-00-00", …} */
      //https://stackoverflow.com/questions/31275357/using-substring-of-json-key-value-for-conditionals
      //https://www.w3schools.com/jsref/jsref_substring.asp
      //https://piazza.com/class/jbu2ol8jlbl3iu?cid=285

      /* DATE */
      add_date.innerText = item["date"].substring(0); //because item["date"] is string
      add_row.appendChild(add_date);

      /* EXERCISE (NAME) */
      add_name.innerText = item["name"].substring(0);  //because item["name"] is string
      add_row.appendChild(add_name);

      /* REPS */
      add_reps.innerText = item["reps"];  //because item["reps"] not string
      add_row.appendChild(add_reps);

      /* WEIGHT */
      add_weight.innerText = item["weight"];
      add_row.appendChild(add_weight);

      /* UNIT (LBS)*/
      if(item["lbs"] === 1){  // if(document.getElementById("add_lbs_false").checked){
        add_unit.innerText = "lbs";
      }
      else if (item["lbs"] === 0){   //(document.getElementById("add_lbs_true").checked) {  //else, default: lbs is true
        add_unit.innerText = "kg";
      }
      add_row.appendChild(add_unit);

      /* UPDATE BUTTON */
      var form = document.createElement("form");
      var input_update = document.createElement("input");
        input_update.setAttribute('type', "hidden");
        input_update.setAttribute('value', item["id"]);
      var button_update = document.createElement("input");
        button_update.setAttribute('type', "button");
        button_update.setAttribute('value', "UPDATE");
        button_update.setAttribute('class', "update");
      // var updateBUTTON = document.getElementById("update");
      //   updateBUTTON.addEventListener('click', updateFunction(displayTable, item["id"]), false);

      form.appendChild(input_update);
      form.appendChild(button_update);
      add_update.appendChild(form);
      add_row.appendChild(add_update);

      /* DELETE BUTTON*/
      var form = document.createElement("form");
      var input_delete = document.createElement("input");
        input_delete.setAttribute('type', "hidden");
        input_delete.setAttribute('value', item["id"]);
      var button_delete = document.createElement("input");
        button_delete.setAttribute('type', "button");
        button_delete.setAttribute('value', "DELETE");
        button_delete.setAttribute('class', "delete");
      // var deleteBUTTON = document.getElementById("delete");
      //   deleteBUTTON.addEventListener('click', deleteFunction(displayTable, item["id"]), false);

      form.appendChild(input_delete);
      form.appendChild(button_delete);
      add_delete.appendChild(form);
      add_row.appendChild(add_delete);

      //NEED TO APPEND!!
      table.appendChild(add_row);
  })

  /* EVENT LISTENER - UPDATE BUTTONS */
  var button_update = document.getElementsByClassName("update");
  //Go through however many update buttons we have
  for (var i = 0; i < button_update.length; i++ ){
  button_update[i].addEventListener('click', updateFunction, false);
  }

  /* EVENT LISTENER - DELETE BUTTONS */
  var button_delete = document.getElementsByClassName("delete");
  //Go through however many delete buttons we have
  for (var i = 0; i < button_delete.length; i++ ){
  button_delete[i].addEventListener('click', deleteFunction, false);
  }
}

/*****************************************************************************
2. INSERT
*****************************************************************************/
var addButton = document.getElementById("addButton");

addButton.addEventListener('click', function(event){  //I don't think I need an event parameter. Anyway.
  console.log("I'm going to work on sending these post parameters to server");

  var addReq = new XMLHttpRequest();

  //https://www.w3schools.com/js/js_json_arrays.asp
  // 0:{id: 2, name: "jog", reps: 0, weight: 0, date: "0000-00-00", …}
  //Create the payload object and set all elements to null
  var payload = {name: null,
                reps: null,
                weight: null,
                date: null,
                lbs: null};

  //Now set the object elements to client input (addWorkoutForm form parameters)
  payload.name = document.getElementById("add_name").value;
  payload.reps = document.getElementById("add_reps").value;
  payload.weight = document.getElementById("add_weight").value;
  payload.date = document.getElementById("add_date").value;

  if (document.getElementById("add_lbs_false").checked){
    payload.lbs = 0;
  }
  else if (document.getElementById("add_lbs_true").checked){
    payload.lbs = 1;
  }

  //I might need to setRequestHeader
  addReq.open('POST', '/insert', true);
  addReq.setRequestHeader('Content-Type', 'application/json');

  addReq.onload = function(){
     //A. If the data from server loads properly, then do something with it.
     if(ourRequest.status >= 200 && ourRequest.status < 400){
       var addedData = JSON.parse(ourRequest.responseText);
       //Dynamically create a table to display the loaded addedData
       generate_table(addedData);


     }
    //B. If data fails to load from the server, print error message.
     else {
       console.log("Error in network request: " + ourRequest.statusText);
     }
     // addReq.send(JSON.stringify(payload));
  };

  //req.send() here
  addReq.send(JSON.stringify(payload));
  // addReq.send(payload);
  event.preventDefault();
});

/*****************************************************************************
3. DELETE
*****************************************************************************/
function deleteFunction(table, row_id){
    console.log("deleteFunction row_id: " + row_id);
    var deleteRequest = new XMLHttpRequest();
    var id = row_id;
    var payload = {"id": id};
    deleteRequest.open('POST', '/delete', true);
    deleteRequest.setRequestHeader("Content-Type", "application/json");
    deleteRequest.onload = function(){
      if(deleteRequest.status >= 200 && deleteRequest.status < 400){
        var deleteData = JSON.parse(deleteRequest.responseText); //Parse the loaded JSON data
        console.log(deleteData); //Display the objects to client console
        //Dynamically create a table to display the loaded ourData (f'n definition below)
        // generate_table(deleteData);
      }
      //B. If data fails to load from the server, print error message.
      else{
        console.log("Error in network request: " + deleteData.statusText);
      }
    }
    deleteRequest.send(JSON.stringify(payload));

}

/*****************************************************************************
4. UPDATE
*****************************************************************************/
function updateFunction(table, row_id){
  console.log("updateFunction row_id: " + row_id);
}











































//space buffer

/*function for sorting the table by header*/

const baseURL = "http://localhost:3000/";

function sort_table(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("my_table");
  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}


function onLoadBody() {
  showUsers();
}


function showUsers() {
  // Creating the XMLHttpRequest object

  var request = new XMLHttpRequest();

  // Instantiating the request object
  request.open("GET", baseURL + "users");

  // Defining event listener for readystatechange event
  request.onreadystatechange = function () {
    // Check if the request is compete and was successful
    if (this.readyState === 4 && this.status === 200) {
      // Inserting the response from server into an HTML element
      fillTable(this.responseText);
     
    }
  };

  request.send();

}



function addUser() {

  let postData = {
    "name": name_input.value,
    "number": phone_input.value,
    "email": email_input.value,
    "nationality": country_input.value
  };

  let postJson = JSON.stringify(postData)

  const url = baseURL + "createUser"
  let xhr = new XMLHttpRequest()

  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  xhr.send(postJson);

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Post successfully created!")
      const container = document.getElementById('my_table');

      container.innerHTML = ' <tr id="tableLable"> <th onclick="sort_table(1)">ID</th><th onclick="sort_table(0)">Name</th><th onclick="sort_table(3)">Phone number</th><th onclick="sort_table(2)">Email</th><th onclick="sort_table(4)">Country</th></tr>';
      //container.innerHTML='';
      showUsers();
    }
  }

}

function deleteUser() {

  var selectedTable = document.getElementById('my_table');
  var myrows = selectedTable.getElementsByTagName("tr");
  var lastrow = myrows[myrows.length - 1];
  var mycells = lastrow.getElementsByTagName("td");
  var lastcell = mycells[0];

  var idLast = lastcell.innerHTML;
  console.log(idLast);

  let postData = {
    "id": idLast
  };
  let postJson = JSON.stringify(postData)

  const url =  baseURL + "deleteUser"
  let xhr = new XMLHttpRequest()

  xhr.open('DELETE', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  xhr.send(postJson);

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Post successfully created!")
      const container = document.getElementById('my_table');

      container.innerHTML = ' <tr id="tableLable"> <th onclick="sort_table(1)">ID</th><th onclick="sort_table(0)">Name</th><th onclick="sort_table(3)">Phone number</th><th onclick="sort_table(2)">Email</th><th onclick="sort_table(4)">Country</th></tr>';
      showUsers();
    }
  }

}


function searchUser() {

  let postData = {
    "name": search_input.value
  };
  let postJson = JSON.stringify(postData)

  const url = baseURL + "findUser"
  let xhr = new XMLHttpRequest()

  xhr.open('POST', url, true)
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8')
  xhr.send(postJson);

  xhr.onload = function () {
    if (xhr.status === 200) {
      console.log("Post successfully created!")
      const container = document.getElementById('my_table');

      container.innerHTML = ' <tr id="tableLable"> <th onclick="sort_table(1)">ID</th><th onclick="sort_table(0)">Name</th><th onclick="sort_table(3)">Phone number</th><th onclick="sort_table(2)">Email</th><th onclick="sort_table(4)">Country</th></tr>';

      fillTable(xhr.response);
    }
  }
}


function fillTable(results) {
  var data = JSON.parse(results);

  var tableData = '';
  var k = 0;

  for (let i = 0; i < data.length; i++) {
    k++;
    tableData += '<tr>';

    for (const [key, value] of Object.entries(data[i])) {
      tableData += '<td>' + value + '</td>';
    }
    tableData += '</tr>';
  }

  var myTable = document.getElementById('tableLable');
  myTable.insertAdjacentHTML("afterend", tableData);
  
}
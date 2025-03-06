var table = document.getElementById("task table");

function Create_button(){
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = '<td><input type="checkbox" onclick="setTable(this)"></td>';
    cell2.innerHTML = document.getElementById("taskname").value;
    cell3.innerHTML = '<td><button onclick="Delete_button(this)">delete</button></td>';
    setTable();
}

function Delete_button(e){
    var i = e.parentNode.parentNode.rowIndex;
    table.deleteRow(i);
    setTable();
}

function setTable(){
    let mytable = document.getElementById("task table").innerHTML;
    localStorage.setItem("mytable", mytable);
}

if(!localStorage.getItem("mytable")){
    setTable();
} else {
    let storedtable = localStorage.getItem("mytable");
    document.getElementById("task table").innerHTML = storedtable;
}
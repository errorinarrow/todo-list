var table = document.getElementById("task table");

function Create_button(){
    var row = table.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = '<td><input type="checkbox" id="box' + (document.querySelectorAll('input[type=checkbox]').length + 1) +'" onclick="savebox()"></td>';
    cell2.innerHTML = document.getElementById("taskname").value;
    cell3.innerHTML = '<td><button onclick="Delete_button(this)">delete</button></td>';
    setTable();
    savebox();
}

function Delete_button(e){
    var i = e.parentNode.parentNode.rowIndex;
    table.deleteRow(i);
    var checkboxs = document.querySelectorAll('input[type=checkbox]');
    for(i = 0 ; i < checkboxs.length ; i++){
        checkboxs[i].id = 'box' + (checkboxs.length - i);
    }
    setTable();
    savebox();
}

function setTable(){
    let mytable = document.getElementById("task table").innerHTML;
    localStorage.setItem("mytable", mytable);
}

if(!localStorage.getItem("mytable")){
    setTable();
    loadboxbox();
} else {
    let storedtable = localStorage.getItem("mytable");
    document.getElementById("task table").innerHTML = storedtable;
    loadbox();
}

function savebox(){
    var i, checkboxs = document.querySelectorAll('input[type=checkbox]');
    for(i=0 ; i < checkboxs.length ; i++){
        localStorage.setItem(checkboxs[i].id, checkboxs[i].checked);
    }
    console.log("Saved Box...");
}

function loadbox(){
    var i, checkboxs = document.querySelectorAll('input[type=checkbox]');
    for(i = 0; i < checkboxs.length ; i++){
        checkboxs[i].checked = localStorage.getItem(checkboxs[i].id) === 'true' ? true:false;
    }
}
var medic = {};
medic.webdb = {};
medic.webdb.db = null;

medic.webdb.open = function() {
  var dbSize = 10 * 1024 * 1024; // 5MB
  medic.webdb.db = openDatabase("MEDIC", "1.0", "Medical Stock Manager", dbSize);
}

medic.webdb.createTable = function() {
  var db = medic.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS medi_stock(SLNO INTEGER PRIMARY KEY ASC, medicine_name TEXT, quantity INTEGER , upd_date Date)", []);
  });
}

medic.webdb.createTableTrans = function() {
  var db = medic.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS medi_trans(SLNO INTEGER , QUANTITY_ADDED INTEGER, LAST_UPD_DATE DATE, FOREIGN KEY (SLNO) REFERENCES medi_stock(SLNO))', []);
  });
}




medic.webdb.loadMedi = function(txt) {
  var db = medic.webdb.db;
  var today = new Date();
  var day = today.getMonth()+ 1 +"/"+ today.getDate() + "/" + today.getFullYear();
  var con = txt.split("\n");
	alert(con.length + 'data insertions');
    for(jj=0;jj<= con.length -1;jj++){			
		(function(jj) {
		var data = con[jj].split("|");
		var day = today.getMonth()+ 1 +"/"+ today.getDate() + "/" + today.getFullYear();
        db.transaction(function (tx) {  
                tx.executeSql('INSERT INTO medi_stock(medicine_name, quantity,upd_date) VALUES (?,?,?)',  [data[0],data[1],day]);
        });
      })(jj)
	};
  //console.log(medicine_name,quantity);
  
 }



medic.webdb.addMedi = function(medicine_name,quantity) {
  var db = medic.webdb.db;
  var today = new Date();
  var day = today.getMonth()+ 1 +"/"+ today.getDate() + "/" + today.getFullYear();
  console.log(medicine_name,quantity);
  db.transaction(function(tx){
    //var addedOn = new Date();
    tx.executeSql("INSERT INTO medi_stock(medicine_name, quantity,upd_date) VALUES (?,?,?)",
        [medicine_name, quantity,day],
        medic.webdb.onSuccess,
        medic.webdb.onError);
	//tx.executeSql("commit");	
   });
   
   
	//db.transaction(function(tx) {
	//	tx.executeSql("INSERT into medi_trans values(?,?,?)",[slno,upq,day],
	//	medic.webdb.onSuccess,
    //    medic.webdb.onError) 			
	//});
   
}

medic.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

medic.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  //medic.webdb.getAllStock(loadStock);

}


medic.webdb.getAllStock = function(renderFunc) {
	var db = medic.webdb.db;
	db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM medi_stock ORDER BY QUANTITY ASC", [], function(tx, results) {
      var len=results.rows.length;
      var i;
      for(i=0; i<len; i++) {
		//var the_slno = results.rows.item(i).SLNO;
		//alert(results.rows.item(i).medicine_name);
		var table = document.getElementById('mytable'); //html table
		var rowCount = table.rows.length; //no. of rows in table
		var columnCount =  table.rows[0].cells.length; //no. of columns in table          
		var row = table.insertRow(rowCount); //insert a row            
		
		var cell1 = row.insertCell(0); //create a new cell           
		var element1 = document.createTextNode(results.rows.item(i).SLNO); //create a new element           
		cell1.setAttribute('id',results.rows.item(i).SLNO);
		cell1.appendChild(element1); //append element to cell
		var cell2 = row.insertCell(1); //create a new cell           
		var element2 = document.createTextNode(results.rows.item(i).medicine_name); //create a new element           
		cell2.appendChild(element2); //append element to cell
		var cell3 = row.insertCell(2); //create a new cell           
		var element3 = document.createTextNode(results.rows.item(i).quantity); //create a new element           
		if(results.rows.item(i).quantity < 200){
			cell3.setAttribute('style', 'color: red');
		}	
		cell3.appendChild(element3); //append element to cell
		var cell4 = row.insertCell(3); //create a new cell           
		var element4 = document.createTextNode(results.rows.item(i).upd_date); //create a new element           
		cell4.appendChild(element4); //append element to cell
		
		var cell5 = row.insertCell(4); //create a new cell      
		var buttonnode= document.createElement('input');
		buttonnode.setAttribute('type','button');
		buttonnode.setAttribute('name',cell1.id);
		buttonnode.setAttribute('value','Delete');
		buttonnode.onclick = function() { delStock(this.name);}
		cell5.appendChild(buttonnode);
		
	  }
	});});
}

medic.webdb.addToStock = function(renderFunc) {
  var db = medic.webdb.db;
	for(i=0; i<1; i++) {
		//alert(results.rows.item(i).medicine_name);
		var table = document.getElementById('addtable'); //html table
		var rowCount = table.rows.length; //no. of rows in table
		var columnCount =  table.rows[0].cells.length; //no. of columns in table          
		var row = table.insertRow(rowCount); //insert a row            		
		var cell1 = row.insertCell(0); //create a new cell           
		var element1 = document.createElement("select"); 
		element1.type = "text";
		element1.setAttribute('id', 'txt1'); //set the id attribute		
		element1.setAttribute('class', 'newInput'); //set the id attribute		
	//	element1.setAttribute('required'); //set the id attribute		
		//element1.setAttribute('placeholder', 'Type Medicine Name'); //set the id attribute		
		cell1.appendChild(element1); //append element to cell
		
		var cell2 = row.insertCell(1); //create a new cell           
		var element2 = document.createElement("input"); 
		element2.type = "Number";
		element2.setAttribute('class', 'newInput2'); //set the id attribute		
		element2.setAttribute('id', 'nqua'); //set the id attribute		
		cell2.appendChild(element2); //append element to cell	
		
  }
  
  db.transaction(function(tx) {
		tx.executeSql("SELECT medicine_name FROM medi_stock", [], function(tx, results) {
			var len = results.rows.length;
			var sel = document.getElementById('txt1');
			for(i=0; i < len; i++) {			
				opt = document.createElement("option");
                opt.value = results.rows.item(i).medicine_name;
                opt.text=results.rows.item(i).medicine_name;
                sel.appendChild(opt);
			}
		})
	});	
}


medic.webdb.dailyStock = function(renderFunc) {
	var db = medic.webdb.db;
  	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM medi_stock", [], function(tx, results) {
			var len = results.rows.length;
			for(i=0; i < len; i++) {
				//alert(results.rows.item(i).medicine_name);
				var table = document.getElementById('dailytable'); //html table
				var rowCount = table.rows.length; //no. of rows in table
				var columnCount =  table.rows[0].cells.length; //no. of columns in table          
				var row = table.insertRow(rowCount); //insert a row            		
				var cell1 = row.insertCell(0); //create a new cell           
				cell1.id ='slno'+i;
				var element1 = document.createTextNode(results.rows.item(i).SLNO); //create a new element           
				cell1.appendChild(element1); //append element to cell
				
				var cell2 = row.insertCell(1); //create a new cell           
				cell2.id = 'name'+i;
				var element2 = document.createTextNode(results.rows.item(i).medicine_name); //create a new element           
				cell2.appendChild(element2); //append element to cell
				
				var cell3 = row.insertCell(2); //create a new cell           
				cell3.id = 'quantity'+i;
				var element3 = document.createTextNode(results.rows.item(i).quantity); //create a new element           
				cell3.appendChild(element3); //append element to cell
		
				var cell4 = row.insertCell(3); //create a new cell           
				var element4 = document.createElement("input"); 
				element4.type = "number";
				//element4.onKeyDown="myFunction()";
				
				
				element4.setAttribute('class', 'QInput'); //set the id attribute		
				element4.setAttribute('id', 'QInput'+i); //set the id attribute		
				element4.setAttribute('placeholder', 'Enter quantity');
				cell4.appendChild(element4); //append element to cell				
				var element5 = document.createElement("input"); 				
				element5.setAttribute('value', 'Update'); //set the id attribute		
				//element5.setAttribute('style', 'color:black'); //set the id attribute		
				element5.style.color = "rgba(64, 61, 136, 0.82)"; //set the id attribute		
				element5.setAttribute('id', i); //set the id attribute		
				element5.setAttribute('type', 'Button');
				element5.onclick = function() {
					var s = 'slno'+(this.id);
					var slno = document.getElementById(s).innerText;
					var q = 'quantity'+(this.id);
					var qua = document.getElementById(q).innerText;
					var o = 'QInput'+(this.id);
					var out = document.getElementById(o).value;
					if (out.length > 0) {						
					}
					else{
						alert ('Only Numbers Please!!!');
						return;
					}
					
					var upq = Number(qua) - Number(out);
					if(upq < 0){
						alert("Cannot take out more than what is in stock");					
						return;	
					}
					
						
					
					updateStock(slno,upq);
				}
				cell4.appendChild(element5); //append element to cell				
			}

		})
	});
	
}
/*
function myFunction(){
	var e = event || window.event;  // get event object
    var key = e.keyCode || e.which; // get key cross-browser

    if (key < 48 || key > 57) { //if it is not a number ascii code
        //Prevent default action, which is inserting character
        if (e.preventDefault) e.preventDefault(); //normal browsers
            e.returnValue = false; //IE
}
*/
function upName(){
	var db = medic.webdb.db;
	var val = document.getElementById('msno').value;
	var upq = document.getElementById('mname').value;
	//var med = val.options[val.selectedIndex].text;
	alert(val+upq);
		if(upq.length > 0){
	}
	else{
		alert('Number only please!');
		return;
	}
	
	db.transaction(function(tx) {
		tx.executeSql("UPDATE medi_stock SET MEDICINE_NAME = ? where SLNO = ?", [upq,val], function(tx, results) {
		alert("Updated");})
		//tx.executeSql("insert into medi_trans  ?, ? where medicine_name = ?",[sno,upq,med]) 			
	});
}


function addMedStock(){
	var val = document.getElementById('txt1');
	var upq = document.getElementById('nqua').value;
	var med = val.options[val.selectedIndex].text;
	if(upq.length > 0){
	}
	else{
		alert('Number only please!');
		return;
	}
	var db = medic.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("UPDATE medi_stock SET QUANTITY = QUANTITY + ? where medicine_name = ?", [upq,med], function(tx, results) {
		alert("Quantity Updated");})
		//tx.executeSql("insert into medi_trans  ?, ? where medicine_name = ?",[sno,upq,med]) 			
	});
}


function addData(){
	var val = document.getElementsByTagName('input');
	hee = val[0].value;	
	hoo = val[1].value;	
	if (/^\s*$/.test(hee) && /^\s*$/.test(hoo)){
		//value is either empty or contains whitespace characters
		//do not append the value
		alert("please fill in atleast on row of data");
	}
	else{
		//code for appending the value to url
		var idata = document.getElementsByTagName('input');
		for(j=0;j<= idata.length;j=j+2){
			if(/^\s*$/.test(idata[j].value)) break;
			alert (idata[j].value,idata[j+1].value);
			medic.webdb.addMedi(idata[j].value,idata[j+1].value);
		}
		alert("Data Added");		
	}
}

/*medic.webdb.backupData = function(renderFunc) {
	var db = medic.webdb.db;
	var data = [];
  	db.transaction(function(tx) {
		tx.executeSql("SELECT * FROM medi_stock", [], function(tx, results) {
			var len = results.rows.length;
			for(i=0; i < len; i++) {
				data.push(results.rows.item(i).medicine_name);		
			}
			alert(data);
		})
	});
	
}*/




medic.webdb.backupData = function(renderFunc){
var db = medic.webdb.db;
 var csvData = "";
 db.transaction(function(tx){
 tx.executeSql("SELECT * FROM medi_stock", [], function(tx, results) {
 var len = results.rows.length;

  for (i = 0; i < len; i++) {
	csvData += results.rows.item(i).SLNO + "|" + results.rows.item(i).quantity + "|" + results.rows.item(i).medicine_name + "\n";
   }
	window.location='data:text/csv;charset=utf8,' + encodeURIComponent(csvData);
  });

 });
};



function backupStock(){
	medic.webdb.backupData();	
}


function delStock(slnu){
	var db = medic.webdb.db;
	//alert(slnu);
	db.transaction(function(tx) {
    tx.executeSql("DELETE FROM medi_stock where SLNO = ?", [slnu], function(tx, results) {
		medic.webdb.getAllStock();
	})
})
alert ("data deleted");
//window.location.href='index.html';
}

function viewStock(){
	init();
	medic.webdb.getAllStock();
}

function addDisplay(){
	init();
	medic.webdb.addToStock();
}
function dailyDisplay(){
	init();
	medic.webdb.dailyStock();
}

function importData(txt){
	medic.webdb.loadMedi(txt);
//	var con = txt.split("\n");
//	alert(con.length + 'data insertions');
 //   for(jj=0;jj<= con.length -1;jj++){			
	//	var temp = con[jj].split("|");
	//	medic.webdb.addMedi(temp[0],temp[1]);
	//	sleep 2;
	//}
	alert(jj +" Data Imported. Please Check inventory!");	
}


function updateData(txt){
	var con = txt.split("\n");
    for(jj=0;jj<= con.length;jj++){			
		var temp = con[jj].split("|");
		alert (temp[0]);
		updateStock(temp[0],temp[1]);
	}
	alert("Data Imported. Please Check inventory!");	
}
function updateStock(slno,upq){
	var db = medic.webdb.db;
	db.transaction(function(tx) {
		tx.executeSql("UPDATE medi_stock SET QUANTITY = ? where SLNO = ?", [upq,slno], function(tx, results) {
		alert("Quantity Updated with "+ upq);})
		//tx.executeSql("insert into medi_trans  ?, ? where medicine_name = ?",[sno,upq,med]) 			
	});	
	//dailyDisplay();
}
function init() {
  medic.webdb.open();
  medic.webdb.createTable();
  medic.webdb.createTableTrans();  
 // medic.webdb.addMedi("test1", 400);
  //medic.webdb.addMedi("test3", 450);
 //delStock();
 //medic.webdb.getAllStock();
}



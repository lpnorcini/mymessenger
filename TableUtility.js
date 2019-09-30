//  var currentList = new Array();
  var listSize = 0;
  var paginateSize = 100;
  var currentPos = 0;
  var lastSelected = -1;

  function doPaginate(tableName, bodyName) { 
//    alert("Table Name is: " + tableName + " body name is: " + bodyName);
    
    createAndShowTable(tableName,bodyName);
  }

  var months = new Array("January","February","March","April","May","June","July","August","September","October","November","December");
  function getDisplayDate(aDate) {
    return (months[aDate.getMonth()] + " " + aDate.getDate());
  }
  
  var weekdays = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");

  function getDay(aDate) {
    return weekdays[aDate.getDay()];
  }

  function createAndShowTable(tableName, bodyName) {
    var coreTable = document.getElementById(tableName);
    if (!coreTable ) {
      alert( "Core Table is NULL");
    }
    var coreBody = null;
    for(var i = 0; i < coreTable.tBodies.length && null == coreBody; i++) {
//      alert("Body ID: " + coreTable.tBodies[i].id);
 //     if(bodyName == coreTable.tBodies[i].id) {
        coreBody = coreTable.tBodies[i];
//      }
    }
    deleteAllRows(coreBody);
    for( var i = 0; i < listSize; i++ ) {
      var row = coreBody.insertRow(-1);
      cell = row.insertCell(-1);
      cell.innerHTML = lists[i][0];
      cell = row.insertCell(-1);
      cell.innerHTML = lists[i][1];
      cell = row.insertCell(-1);
      cell.innerHTML = "<a href='#', onClick='removeMember(" + i + ");'>Remove</a>";
    } 
    //Add an empty row
    var txtName = "<input type='text' name='txtMemberName' size='30'/>";
    var txtPhone = "<input type='text' name='txtMemberPhone' size='12'/>";
    var row = coreBody.insertRow(-1);
    cell = row.insertCell(-1);
    cell.innerHTML = txtName;
    cell = row.insertCell(-1);
    cell.innerHTML = txtPhone
    cell = row.insertCell(-1);
    cell.innerHTML = "<a href='#', onClick='addAnotherMember();'>Add Another</a>";
  }

 function deleteAllRows(tableOrTBody) {
    if(null != tableOrTBody) {
      while(tableOrTBody.rows.length > 0) {
        tableOrTBody.deleteRow(0);
      }
    }
  }
  
  
  //This updates the HTMLDOM with response 
  function processStateChange() {
	if (req.readyState == 4) { // Complete
	    if (req.status == 200) { // OK response
	    	if(DEBUG){
	    		alert("sai responsetext :" +req.responseText);
	    	}
	    	//If a successful save, clear data changed flag
	    	var htmlString = req.responseText;
			if(htmlString.search(/Finalize Performed Successfully/) != -1) {
	    	  //SuccessfulFinalize
	    	  window.parent.dataChangedFlag = false;
	    	  finalizeSuccessful();
	    	}
	    	else if(htmlString.search(/ success/i) != -1) {
//              alert("in processStateChange hasDataChanged = " + window.parent.dataChangedFlag);
	    	  window.parent.dataChangedFlag = false;
	    	  //This excludes the saved decisions to process next time when the user saves the reviews
	    	  for(var i=0; i<keys.length ; i++){
	    	  	keys[i][2] = keys[i][1];
	    	  	keys[i][4] = keys[i][3];
	    	  }
//              alert("in processStateChange hasDataChanged = " + window.parent.dataChangedFlag);
	    	}
	        document.getElementById('div1').innerHTML = htmlString;
        }else {
	        alert("Problem with server response:\n " + req.statusText);
        }
    }
  }

  function doSort(col, type) {
    if(0 <= col && 6 >= col) {
      var sortPos = new Array();
      for( var i = 0; i < (listSize - 1); i++ ) {
        var currentRow = lists[i];
        var currentPos = i;
        for( var j = i + 1; j < listSize; j++ ) {
          var swap = false;
          if( type == 'D' ) {
            //Sort descending
            if(lists[currentPos][col] < lists[j][col]) {
              swap = true;
            }
          }
          else {
            //Sort ascending
            if(lists[currentPos][col] > lists[j][col]) {
              swap = true;
            }
          }

          if(swap) {
            lists[currentPos] = lists[j];
            lists[j] = currentRow;
            currentRow = lists[currentPos];
            swap = false;
          }
        }
      }
      doPaginate('start');
    }
  }
  

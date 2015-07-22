var intervalHandler;

function doCheckin(){
	//contact server
	htmlGetRequest(script_url, "q=REQUEST:CHECKIN:"+getStaffId(), wait);
	doStart();
}

function doEnrollment(){
	//contact server
	htmlGetRequest(script_url, "q=REQUEST:ENROLL:"+getStaffId(), wait);
	doStart();
}

function doStart(){
	document.getElementById(staffIdTag).setAttribute("disabled", "disabled");
	document.getElementById("loading_div").setAttribute("style", "visibility: visible;");
	document.getElementById("start_button").setAttribute("style", "display: none;");
	document.getElementById("abort_button").setAttribute("style", "display: block;");
}

function wait(response){
	if(response == "waiting"){
		intervalHandler = setInterval(
			function(){(htmlGetRequest(script_url,"q=REQUEST:STATUS:"+getStaffId(),waitCheckin) )},
			3000);
	}else{
		alert("mismatch");
	}
}

function waitCheckin(response){
	if(response == "SUCCESS:"+getStaffId()){
		clearInterval(intervalHandler);
		alert("checked in successfully");
		doAbort();
	}
}

function doAbort(){
	document.getElementById(staffIdTag).removeAttribute("disabled");
	document.getElementById("loading_div").setAttribute("style", "visibility: hidden;");
	document.getElementById("start_button").setAttribute("style", "display: block;");
	document.getElementById("abort_button").setAttribute("style", "display: none;");
}

function abortCheckin(){
	htmlGetRequest(script_url, "q=REPLY:ABORT:"+getStaffId(), null);
	doAbort();
}

function abortEnrollment(){
	htmlGetRequest(script_url, "q=REPLY:ABORT_ENROLMENT:"+getStaffId(), null);
	doAbort();
}

function getStaffId(){
	return getSelectedOption(staffIdTag);
}

function getSelectedOption(tagId){
	var selectOptions = document.getElementById(tagId).options;
	for(var o=0; o < selectOptions.length; ++o){
		var currentOption = selectOptions[o];
		if(currentOption.selected){
			return currentOption.value;
		}
	}
	return null;
}
function htmlGetRequest(url, params, handlerFunction){
	var requestObject = makeHttpRequest();
	requestObject.open('GET', url + '?' + params, true);
	requestObject.send(null);
	var response = null;
	requestObject.onreadystatechange = function(){
		if(requestObject.readyState == 4){
			if (requestObject.status == 200){
				handlerFunction != null ? handlerFunction(requestObject.responseText) : "";
			}else{
				alert('Error'+httpRequestResponse(requestObject.status));
			}
		}
	}
}
function makeHttpRequest(){
	try {return new XMLHttpRequest();}
	catch (e) {}
	try {return new ActiveXObject("Msxml2.XMLHTTP");}
	catch (e) {}
	try {return new ActiveXObject("Microsoft.XMLHTTP");}
	catch (e) {}
}
function httpRequestResponse(code){
	var rs = '';
	switch(code){
		case 404: rs = ' 404 : Page Not Found.'; break;
		case 414: rs = ': Request URL too long for the server.'; break;
		case 0: rs = ': Can not establish http connection.'; break;
		default : rs = ': Unknown Type.'; break;
	}
	return rs;
}

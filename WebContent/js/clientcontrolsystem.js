var userrepstore=new Array();
var beaconrepstore = new Array();

function createclientcontrolsystem(){
	var cs = new Object();
	cs.id=getnewkey();
	cs.showbeaconsbool=false;
	cs.autotrackgpsbool=false;
	cs.showusersbool=false;
	cs.transportactive=false;
	cs.showbeacons=function(){
		if(document.getElementById("showbeacons").checked==true){
			//alert("show beacons");
			cs.showbeaconsbool=true;
			if(cs.transportactive==false){//activate transport
				cs.transportactive=true;
				cs.transporttimer=setTimeout("objectstore['clientcs'].getinformation()",3000);
			}//else nothing timer should detect cs.showusers is now true and start sending requests for data
		}else{
			//alert("hide beacons");
			cs.showbeaconsbool=false;
		}
	};
	cs.autotrack=function(){
		alert("toggle autotrack gps ");
	};
	cs.showusers=function(){
		if(document.getElementById("showusers").checked==true){
			//alert("show users");
			cs.showusersbool=true;
			if(cs.transportactive==false){//activate transport
				cs.transportactive=true;
				//alert("start get users timer");
				cs.transporttimer=setTimeout("objectstore['clientcs'].getinformation()",6000);
			}//else nothing timer should detect cs.showusers is now true and start sending requests for data
		}else{
			//alert("hide users");
			cs.showusersbool=false;
		}
	};
	cs.handlejsonmessage=function(jsonmsg){
		//alert("received "+jsonmsg);
		var jsmsg = JSON.parse(jsonmsg);
		if(jsmsg.msgtype=="SubscriberGetAllUsersReturn"){
			/*
			 * create new objects or update ones already in userrepstore
			 */
			
			//alert("remove "+userrepstore.length+" map user items ");
			
			var usrgone = userrepstore.pop();
			while(usrgone!=null){
				usrgone.circle.circle.setMap(null); //remove dot from map
				usrgone = userrepstore.pop();
			}
			
			var usrlist = jsmsg.userlist;
			//alert("iterate through "+usrlist.length);
			var userlength=usrlist.length;
			for(var i=0;i<userlength;i++){
				var usrobj = usrlist.pop();
				var userkey = usrobj.subscriberkey;
				
				var newusrobj = new Object();
				newusrobj.circle=objectstore['googlemap'].createusrgooglecircle(3,usrobj.latitude,usrobj.longitude);
				newusrobj.circleoptions={center:newusrobj.circle.latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#FF0000",map:objectstore['googlemap'].googlemap,radius:newusrobj.circle.radius,strokeWeight:1};
				//circleobj.circle.setOptions(circleobj.circleoptions);
				newusrobj.latitude=usrobj.latitude;
				newusrobj.longitude=usrobj.longitude;
				newusrobj.starttime=usrobj.starttime;
				newusrobj.stoptime=usrobj.stoptime;
				newusrobj.userkey=usrobj.subscriberkey;
				//alert("create new usr dot on map store using key "+newusrobj.userkey);
				userrepstore.push(newusrobj);
				
			}
			
		}else if(jsmsg.msgtype=="SubscriberGetAllBeaconsReturn"){
			//alert("show all beacons");
			/*
			 * create new objects or update ones already in userrepstore
			 */
			
			//alert("remove "+userrepstore.length+" map user items ");
			
			var beacongone = beaconrepstore.pop();
			while(beacongone!=null){
				beacongone.circle.circle.setMap(null); //remove dot from map
				beacongone = beaconrepstore.pop();
			}
			
			var beaconlist = jsmsg.userlist;
			//alert("iterate through beacons "+beaconlist.length);
			var userlength=beaconlist.length;
			for(var i=0;i<userlength;i++){
				var beaconobj = beaconlist.pop();
				//var userkey = usrobj.beaconkey;
				
				var newbeaconobj = new Object();
				newbeaconobj.circle=objectstore['googlemap'].createusrgooglecircle(beaconobj.range,beaconobj.latitude,beaconobj.longitude);
				newbeaconobj.circleoptions={center:newbeaconobj.circle.latlng,fillOpacity:0.2,strokeOpacity:0.4,fillColor:"#0000FF",map:objectstore['googlemap'].googlemap,radius:newbeaconobj.circle.radius,strokeWeight:1};
				//circleobj.circle.setOptions(circleobj.circleoptions);
				newbeaconobj.latitude=beaconobj.latitude;
				newbeaconobj.longitude=beaconobj.longitude;
				
				newbeaconobj.range=beaconobj.range;
				newbeaconobj.beaconkey=beaconobj.beaconkey;
				//alert("create new usr dot on map store using key "+newusrobj.userkey);
				beaconrepstore.push(newbeaconobj);
			}
		}
	};
	cs.getinformation=function(){
		var bounds = objectstore['googlemap'].bounds;
		if(bounds==null){
			alert("error retreiving back end information try again");
			cs.transportactive=false;
			return;
		}
		var ne = bounds.getNorthEast();
		var sw = bounds.getSouthWest();
		var nw = new google.maps.LatLng(ne.lat(),sw.lng());
		var se = new google.maps.LatLng(sw.lat(),ne.lng());
		var starttime = objectstore['googlemap'].starttime;
		var stoptime = objectstore['googlemap'].stoptime;
		if(cs.showusersbool){//need to send json request to back end with map screen dimensions use objectstore['googlemap'] to get map object
			if(objectstore['googlemap'].bounds!=null){
				//alert("create json message and send it");
				cs.sendjsonmessage(createjsongetotherusers(nw,se,starttime,stoptime));
			}
		}
		if(cs.showbeaconsbool){//need to send json request to back end with map screen dimensions
			if(objectstore['googlemap'].bounds!=null){
				//alert("create json message and send it");
				cs.sendjsonmessage(createjsongetbeacons(nw,se,starttime,stoptime));
			}
		}
		if(cs.autotrackgpsbool){//need to send json request to back end with map screen dimensions
			
		}
		if(cs.showbeaconsbool || cs.autotrackgpsbool || cs.showusersbool){
			cs.transporttimer=setTimeout("objectstore['clientcs'].getinformation()",10000);
		}else{
			cs.transportactive=false;
		}
	};
	cs.showselection=function(){
		if(document.getElementById("selectionconfiguration").style.visibility=="hidden"){
			document.getElementById("selectionconfiguration").style.visibility="visible";
			document.getElementById("selectionconfiguration").style.display="block";
		}else{
			document.getElementById("selectionconfiguration").style.visibility="hidden";
			document.getElementById("selectionconfiguration").style.display="none";
		}
	};
	return cs;
}
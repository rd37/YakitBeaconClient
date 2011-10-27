/*
*  this object represents the user manually dragging a point ball around
*  the screen to get beacon messages from zero or more beacons
*
*/

function createdragballobj(map){
	var dbobj = new Object();
	dbobj.map=map;
	dbobj.range=10;
	dbobj.latitude=48.4633;
	dbobj.longitude=-123.3133;
	dbobj.starttime=0;
	dbobj.stoptime=(new Date()).getTime();
	dbobj.sessionkey=null;
	dbobj.state=0;
	dbobj.initialize=function(){
		//alert("drag ball init map");
		/*
		 * since map is also just a regular map, decision need to be made at the beacon object
		 * not the map object, map state is meaningless so beacon must maintain state of the map 
		 * with respect the the mouse motion and clicking events.  therefore map state is controlled and only has
		 * meaning to the beacon object.
		 */
		dbobj.map.circle=dbobj.map.createnewgooglecircle(dbobj.range,dbobj.latitude,dbobj.longitude);
		
		/*
		 * resize events
		 */
		google.maps.event.addListener(dbobj.map.circle.circle,'click',function(event){
			//document.getElementById("tray_1_0").innerHTML="bf dbobj state "+dbobj.state;
			if(dbobj.state==0){
				dbobj.state=1;
			}else if(dbobj.state==1){
				dbobj.state=0;
				dbobj.latitude=event.latLng.lat();
				dbobj.longitude=event.latLng.lng();
				dbobj.sendjsonmessage(createjsonupdateuser(dbobj.sessionkey,dbobj.latitude,dbobj.longitude,dbobj.starttime,dbobj.stoptime));
			
			}
			//document.getElementById("tray_1_1").innerHTML="aft dbobj state "+dbobj.state;
		});
		//google.maps.event.addListener(dbobj.map.circle.circle,'rightclick',function(event){
			//alert("up evnet");
			
		//});
		google.maps.event.addListener(dbobj.map.googlemap,'mousemove',function(event){
			//alert("click occured map");
			if(dbobj.state==1){
				dbobj.map.circle.move(event.latLng);
				/*
				 * need to update ball position
				 */
				//dbobj.latitude=event.latLng.lat();
				//dbobj.longitude=event.latLng.lng();
				//dbobj.sendjsonmessage(createjsonupdateuser(dbobj.sessionkey,dbobj.latitude,dbobj.longitude,dbobj.starttime,dbobj.stoptime));
			}
			
		});
		
		//update backend position in datastructure
		dbobj.sendjsonmessage(createjsonregisteruser(dbobj.latitude,dbobj.longitude,dbobj.starttime,dbobj.stoptime));
		//dbobj.state=1;
	};
	dbobj.handlejsonmessage=function(jsonmsg){
		//alert("received "+jsonmsg);
		var jsmsg = JSON.parse(jsonmsg);
		if(jsmsg.msgtype=="registration"){
			//dbobj.state=2;
			//automate the retieval of messages from msginbox to populate trays
			//alert("setup timer 2");
			dbobj.sessionkey=jsmsg.subscriberkey;
			dbobj.timer=setTimeout("objectstore['dragball'].messageretreival()",4000);
		}else if(jsmsg.msgtype=="SubscriberGetMessagesReturn"){
			//populate trays tray object is subscribed to this one, use notify with
			var messagelistobj = jsmsg.msglist;
			for(var i=0;i<messagelistobj.length;i++){
				//alert("update list with new message "+messagelistobj[i].message+" from beacon "+messagelistobj[i].beaconid);
				var ev = createevent(messagelistobj[i].beaconid,messagelistobj[i].message);
				dbobj.notify(ev);
			}
		}
	};
	dbobj.messageretreival=function(){
		dbobj.sendjsonmessage(createjsongetusermessaged(dbobj.sessionkey));
		//if(dbobj.state==2)
			dbobj.timer=setTimeout("objectstore['dragball'].messageretreival()",4000);
	};
	return dbobj;
}
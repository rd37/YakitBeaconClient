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
			}
			
		});
		/*google.maps.event.addListener(dbobj.map.circle.circle,'mousemove',function(event){
			//alert("clicl occured bf"+beacon.mapstate);
			if(dbobj.state==1){
				dbobj.map.circle.move(event.latLng);
			}
			
		});*/
		//update backend position in datastructure
		dbobj.sendjsonmessage(createjsonregisteruser(dbobj.latitude,dbobj.longitude));
	};
	dbobj.handlejsonmessage=function(jsonmsg){
		alert("received "+jsonmsg);
	};
	return dbobj;
}
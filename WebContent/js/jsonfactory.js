function createjsonregisteruser(lat,lng,starttime,stoptime){
	var jsmsgobj = new Object();
	jsmsgobj.requesttype="RegisterDefaultSubscriber";
	jsmsgobj.latitude=lat;
	jsmsgobj.longitude=lng;
	jsmsgobj.starttime=starttime;
	jsmsgobj.stoptime=stoptime;
	return JSON.stringify(jsmsgobj);
}

function createjsonupdateuser(key,lat,lng,starttime,stoptime){
	var jsmsgobj = new Object();
	jsmsgobj.requesttype="UpdateSubscriber";
	jsmsgobj.latitude=lat;
	jsmsgobj.longitude=lng;
	jsmsgobj.starttime=starttime;
	jsmsgobj.stoptime=stoptime;
	jsmsgobj.subscriberkey=key;
	return JSON.stringify(jsmsgobj);
}

function createjsongetusermessaged(sessionkey){
	var jsmsgobj = new Object();
	jsmsgobj.requesttype="SubscriberGetMessages";
	jsmsgobj.subscriberkey=sessionkey;
	return JSON.stringify(jsmsgobj);
}
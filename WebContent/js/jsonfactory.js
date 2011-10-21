function createjsonregisteruser(lat,lng){
	var jsmsgobj = new Object();
	jsmsgobj.requesttype="RegisterDefaultSubscriber";
	jsmsgobj.latitude=lat;
	jsmsgobj.longitude=lng;
	return JSON.stringify(jsmsgobj);
}
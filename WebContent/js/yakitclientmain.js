/*
*	Entry point and setup for yakit client app
*
*/
var objectstore=new Array();

var keycounter=0;

function initialize(){
	/*
	 * setup client control system receives index.html page commands and other commands from objects
	 */
	var clientcontrolsystem = createclientcontrolsystem();
	objectstore['clientcs']=clientcontrolsystem;
	addpublishersubscriber(clientcontrolsystem);
	addtransport(clientcontrolsystem);
	
	/*
	 * setup map
	 */
	var googlemap = creategooglemap();
	objectstore['googlemap']=googlemap;
	googlemap.initialize();
	googlemap.initializediv(document.getElementById('googlemapdiv'));
	
	//setup dragball circle
	var dragballobj = createdragballobj(googlemap);
	objectstore['dragball']=dragballobj;
	addpublishersubscriber(dragballobj);
	addtransport(dragballobj);
	dragballobj.initialize();
	
	
	//setup trays and their lists
	//alert("prepare trays");
	var tray0=createtray(0); //belongs to drag ball object
	tray0.initialize();
	objectstore['tray0']=tray0;
	dragballobj.addsubscriber(tray0);
	
}

function createevent(beaconid,msg){
	var event = new Object();
	event.beaconid=beaconid;
	event.message=msg;
	return event;
}
/*
 * object must implement the notification function to handle messages
 */
function addpublishersubscriber(object){
	object.subscribers = new Array();
	//functions
	object.addsubscriber = function(subobj){
		object.subscribers.push(subobj);
	};
	object.notify = function(msgobj){
		var tmparray = new Array();
		var sub=object.subscribers.pop();
		while(sub){
			tmparray.push(sub);
			sub.notification(msgobj);
			sub=object.subscribers.pop();
		}
		var subback=tmparray.pop();
		while(subback){
			object.subscribers.push(subback);
			subback=tmparray.pop();
		}
	};
}

/*
 * maybe possible to setup mulitple tyransport in the future
 */
function addtransport(object){
	object.sendqueue=new Array();
	object.sendbusy=false;
	object.sendjsonmessage=function(jsonmsg){
		if(!object.sendbusy){
			object.sendbusy=true;
			object.httpobj=gethttpobj();
			if(object.httpobj==null){
				alert("error getting http object to use http tranport");
				return;
			}
			object.url="YakitClientServlet?jsonmessage="+jsonmsg+"&sid="+Math.random();
			object.httpobj.onreadystatechange=function(){
				if(object.httpobj.readyState==4){
					object.handlejsonmessage(object.httpobj.responseText);
					object.sendbusy=false;
					if(object.sendqueue.length>0){
						object.sendjsonmessage(object.sendqueue.pop());
					}
				}
			};
			object.httpobj.open("GET",object.url,true);
			object.httpobj.send(null);
		}else{
			object.sendqueue.push(jsonmsg);
		}
	};
};

function getnewkey(){
	return ++keycounter;
};
function getpos(elem){   
    var posX = 0;   
    var posY = 0;             
    while(elem!= null){   
        posX += elem.offsetLeft;   
        posY += elem.offsetTop;   
        elem = elem.offsetParent;   
    }                              
    return { x : posX, y : posY };   
};
function gethttpobj()
{
	if (window.XMLHttpRequest)
    {
	  // code for IE7+, Firefox, Chrome, Opera, Safari
	  return new XMLHttpRequest();
    }
	if (window.ActiveXObject)
	{
	  // code for IE6, IE5
	  return new ActiveXObject("Microsoft.XMLHTTP");
	}
return null;
};


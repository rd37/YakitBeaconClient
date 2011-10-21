/*
*has knowledge of the tray id's as specified in the index.html file
*
*uses these id's to add and remove tray items
*
*id's follow a specific pattern left to right i.e. tray_0_0 ... tray_0_2
*or tray_1_0 ... tray_1_4
*
*
*
*/

function createtray(index){
	var trayobj=new Object();
	trayobj.listarray = new Array(); //indexed by 0-3
	trayobj.listlastused=new Array();//indexed by 0-3
	trayobj.listarraybeaconid=new Array();//indexed by 0-3
	trayobj.index=index;//either 0 or 1 since only two trays in this app
	
	//functions
	trayobj.togglelist=function(i){
		if(trayobj.listarray[i].rootdivelement.style.visibility=="visible")
			trayobj.hidelist(i);
		else
			trayobj.showlist(i);
	};
	trayobj.showlist=function(i){
		var x=getpos(document.getElementById("tray_"+trayobj.index+"_"+i)).x;
		var y=getpos(document.getElementById("tray_"+trayobj.index+"_"+i)).y;
		trayobj.listarray[i].rootdivelement.setAttribute("style","font-size:8px;z-index:999;position:absolute;top:"+y+"px;left:"+x+"px;");
		trayobj.listarray[i].rootdivelement.style.visibility="visible";
		trayobj.listarray[i].rootdivelement.style.display="block";
	};
	trayobj.hidelist=function(i){
		trayobj.listarray[i].rootdivelement.style.visibility="hidden";
		trayobj.listarray[i].rootdivelement.style.display="none";
	};
	trayobj.initialize=function(){
		for(var i=0;i<4;i++){
			trayobj.listarray[i]=createlist(4);
			trayobj.listarray[i].initialize();
			listobjectstore[trayobj.listarray[i].rootdivelement.getAttribute("id")]=trayobj.listarray[i];
			//trayobj.listarray[i].rootdivelement.style.position="absolute";
			trayobj.listarray[i].rootdivelement.style.visibility="hidden";
			trayobj.listarray[i].rootdivelement.style.display="none";
			document.getElementById("tray_"+trayobj.index+"_"+i).appendChild(trayobj.listarray[i].rootdivelement);//make lists avail on screen
			trayobj.listlastused[i]=0;
			trayobj.listarraybeaconid[i]=-1;
		}	
	};
	trayobj.notification=function(eventmsg){//receives notifications from either drag ball or auto-track-gps 
		var beaconid=eventmsg.beaconid;
		var message=eventmsg.message;
		var index=-1;
		for(var i=0;i<4;i++){
			//alert("compare "+trayobj.listarraybeaconid[i]+" to "+beaconid);
			if(trayobj.listarraybeaconid[i]==beaconid)
				index=i;
		}
		if(index!=-1){
			var listdiv = createnewlistdiv();
			listdiv.innerHTML=message;
			//alert("add div to same beacon id "+beaconid+" at index "+index);
			trayobj.addmessage(beaconid,index,listdiv);
			trayobj.listlastused[index]=999;//replace with current time
		}else{//find lowest time and insert the div there
			var indexlowest=0;
			var indexlowestvalue=0;
			for(var i=0;i<4;i++){
				if(i==0){
					indexlowest=0;
					indexlowestvalue=trayobj.listlastused[i];
				}else{
					if(indexlowestvalue>trayobj.listlastused[i]){
						indexlowest=i;
						indexlowestvalue=trayobj.listlastused[i];
					}
				}
			}
			//alert("add div to new beacon id "+beaconid+" at lowest index "+indexlowest);
			var listdiv = createnewlistdiv();
			listdiv.innerHTML=message;
			trayobj.listarraybeaconid[indexlowest]=beaconid;
			trayobj.addmessage(beaconid,indexlowest,listdiv);
		}
	};
	trayobj.addmessage=function(beaconid,index,messagediv){
		trayobj.listarray[index].appenddiv(messagediv);
		//update last used array to current time
		trayobj.listlastused[index]=999;
		trayobj.listarraybeaconid[index]=beaconid;
		//set list to display last set of messsages
	};
	return trayobj;
}
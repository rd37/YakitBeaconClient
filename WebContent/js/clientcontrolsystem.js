function createclientcontrolsystem(){
	var cs = new Object();
	cs.id=getnewkey();
	cs.showbeacons=function(){
		alert("toggle show beacons");
	};
	cs.autotrack=function(){
		alert("toggle autotrack gps ");
	};
	cs.showusers=function(){
		alert("toggle show users");
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
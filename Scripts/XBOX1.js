//******************************************************************************
//**  File: XBOX1.js
//**  Date: May 2018     //last updated 8/31 cleaned up and updated Ajax calls
//**  Author: Ken McIntosh
//******************************************************************************
$(document).ready(function () {
	setUpSortie();
	setUpCetus();
	setUpDailyReset();
	setUpAlerts();
	setUpVoid();
	setUpDarvo();
	setUpNews();
	setUpSyndicate();
	setUpBaro();
	setUpInvasions();
});

//Global vars to use to compare to see if any changes were detected
var alertsJSON;
var voidJSON;

function checkForUpdates(idForTimer){
	if(idForTimer == "sortie0" || idForTimer == "sortie1" || idForTimer ==  "sortie2"){
		setUpSortie();
	}else if(idForTimer == "cetusTimer"){
		setUpCetus();
	}else if(idForTimer == "dailyResetTimer"){
		setUpDailyReset();
	}else if(idForTimer == "alert0" || 
				idForTimer == "alert1" || 
				idForTimer == "alert2" || 
				idForTimer == "alert3" || 
				idForTimer == "alert4" || 
				idForTimer == "alert5" || 
				idForTimer == "alert6" || 
				idForTimer == "alert7" || 
				idForTimer == "alert8" || 
				idForTimer == "alert9") {
		$('#Alerts').empty();
		setUpAlerts();
	}else if(idForTimer == "void0" || 
				idForTimer == "void1" || 
				idForTimer == "void2" || 
				idForTimer == "void3" || 
				idForTimer == "void4" || 
				idForTimer == "void5" || 
				idForTimer == "void6" || 
				idForTimer == "void7" || 
				idForTimer == "void8" || 
				idForTimer == "void9") {
		$('#Void').empty();
		setUpVoid();
	}else if(idForTimer == "darvoTimer"){
		setUpDarvo();
	}else{//invalid id
		return;
	}
}

// Timer (From w3Schools and modified for my needs)
function setTimer(time, idForTimer, additionalTime, status){
	var x = setInterval(function() {
		var now = new Date().getTime();
		var remaining = time - now + additionalTime;
		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(remaining / (1000 * 60 * 60 * 24));
		var hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((remaining % (1000 * 60)) / 1000);

		if(status ==  "active" && document.getElementById(idForTimer) != null){
			if(days >= 1)
				document.getElementById(idForTimer).innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
			else if(hours >= 1)
				document.getElementById(idForTimer).innerHTML = hours + "h " + minutes + "m " + seconds + "s ";
			else
				document.getElementById(idForTimer).innerHTML = minutes + "m " + seconds + "s ";
		}else if (document.getElementById(idForTimer) != null){
			if(days >= 1)
				document.getElementById(idForTimer).innerHTML ="Starts in: " + days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
			else if(hours >= 1)
				document.getElementById(idForTimer).innerHTML ="Starts in: " + hours + "h " + minutes + "m " + seconds + "s ";
			else
				document.getElementById(idForTimer).innerHTML ="Starts in: " + minutes + "m " + seconds + "s ";
		}

		// If the count down is over, write some text 
		if (remaining < 0) {
			clearInterval(x);
			if(document.getElementById(idForTimer) != null)
				document.getElementById(idForTimer).innerHTML = "EXPIRED";
			checkForUpdates(idForTimer);
		}
	}, 1000);
}
//----------------------------------------End of timers--------------------------------------------------------------------------

// Sortie
function setUpSortie(){
	$.getJSON('https://api.warframestat.us/xb1/sortie', function(data) {
		$('#Sortie').empty(); //empty it if it needs to be refreshed
	  	var end = new Date(data.expiry); //find out when it expires
	  	$('#Sortie').append("<div id=\"wrapSortie\"><p id=\"sortieBoss\">" + data.faction + " | " + data.boss + "</p></div>");
	  	var numElements = (Object.keys(data.variants).length);
	  	for(var i =0; i< numElements;i++){
	  		$('#Sortie').append("<div id=\"wrap\"><p id=\"white\">" + data.variants[i].node + " | " + data.variants[i].missionType + " | " + data.variants[i].modifier 
	  			+ "</p> <p class = \"sortie\" id = \"sortie"+i+"\">...</p></div>");
	  		var timer = "sortie" + i;
	  		setTimer(end, timer,0, "active");
	  	}
	});
}
//---------------------------------------End of Sortie ---------------------------------------------------------------------------------------------

//Cetus
function setUpCetus(){
	$.getJSON('https://api.warframestat.us/xb1/cetusCycle', function(data) {
		$('#Cetus').empty();
		var end = new Date(data.expiry);
		var timer = "cetusTimer"; 
		if(data.isDay == true && data.isCetus == true){	//day time
			$('#Cetus').append("<div id =\"wrap\"><p id = \"white\">Day Time</p><p class = \"cetus\" id=\"cetusTimer\">...</p></div>");
			setTimer(end, timer,0, "active");
		}
		else if(data.isDay == false && data.isCetus == true){//night
			$('#Cetus').append("<div id =\"wrap\"><p id = \"white\">Night Time</p><p class = \"cetusNite\" id=\"cetusTimer\">...</p></div>");
			setTimer(end, timer,0, "active");
		}
		else{ //invalid information is in the returned JSON
			return;
		}
	});
}

//---------------------------------------End of Cetus------------------------------------------------------------------------------------------

//Daily reset
// daily reset isn't provided in the api so have to use a work around
// currently daily reset is at 5pm PST time
// sortie resets daily at 9am so that 8hrs different
// 8 hrs = 28,800,000 milliseconds
// sortie reset + 8hrs will give time till next reset
function setUpDailyReset(){
	$.getJSON('https://api.warframestat.us/xb1/sortie', function(data) {
		$('#Daily').empty();
		var sortieEnd = new Date(data.expiry); //gives tomorrows date 9 am
		var today = new Date();

		$('#Daily').append("<div id =\"wrap\"><p id =\"white\">Time till Daily Reset:</p><p class = \"dailyTimer\" id=\"dailyResetTimer\">...</p></div>");
		var timer = "dailyResetTimer"
		//before reset
		if(sortieEnd - today > 57600000){ //16hrs till next sortie reset then the math changes
			setTimer(sortieEnd,timer, -57600000, "active")
		}else{ //after reset
			setTimer(sortieEnd, timer, 28800000, "active");
		}
	});	
}
//------------------------------------------End of Daily Reset-----------------------------------------------------------------------------------

//setUpAlerts
//try storing api return as a global var and use that to check to see if the refreshed
// recall api to see if it is different
// if different rebuild alerts
function setUpAlerts(){
	$.getJSON('https://api.warframestat.us/xb1/alerts', function(data) {
		alertsJSON = data; //update the json
		$('#Alerts').empty();

		//check to see if the expiry time is past Timenow
		//if yes don't add it
		//if no add it
		for(var i =0; i<data.length;i++){
			var alertStart = new Date(data[i].activation);
			var alertTime = new Date(data[i].expiry);
			var nowTime = new Date();
			var timer = "alert"+i;
			if(alertStart - nowTime > 0){//not started yet
				$('#Alerts').append("<div id =\"wrap\"><p id =\"white2\">" + data[i].mission.node + " | " + data[i].mission.type + " | "  + data[i].mission.faction 
					+ "</p> <p class = \"alertsStart \" id=\"alert" + i + "\">...</p> <p class= \"reward\">" + data[i].mission.reward.asString +"</p></div>");
				setTimer(alertStart, timer, 0, "start");
			}
			else if(alertTime - nowTime > 0){ //not expired
				$('#Alerts').append("<div id =\"wrap\"><p id =\"white2\">" + data[i].mission.node + " | " + data[i].mission.type + " | "  + data[i].mission.faction 
					+ "</p> <p class = \"alerts \" id=\"alert" + i + "\">...</p> <p class= \"reward\">" + data[i].mission.reward.asString +"</p></div>");
				setTimer(alertTime, timer, 0, "active");
			}
		}

		setInterval(function() {
			var changes = false;
			$.getJSON('https://api.warframestat.us/xb1/alerts', function(alertData) {
				if(alertsJSON.length == alertData.length){
					for(var i = 0; i<alertData.length;i++){
						if(alertData[i].id != alertsJSON[i].id){
							changes = true;
							break;
						}
					}
				}
				if(alertsJSON.length != alertData.length || changes == true){
					console.log("Refreshing Alerts!");
					document.location.reload(true); 
				}
			});
		}, 1000);
	});	
}
//------------------------------------------Emd of alerts-----------------------------------------------------------

// Void Fissures
function setUpVoid(){
	$.getJSON('https://api.warframestat.us/xb1/fissures', function(voidData) {
		voidJSON = voidData;
		$('#Void').empty();
		var VoidTier = ["Lith", "Meso","Neo", "Axi"];
		for(var j =0; j<VoidTier.length; j++){
			for(var i =0; i<voidData.length;i++){
				if(voidData[i].tier == VoidTier[j]){
					//check to see if the expiry time is past Timenow
					//if yes don't add it
					//if no add it
					var voidStart = new Date(voidData[i].activation);
					var voidTime = new Date(voidData[i].expiry);
					var nowTime = new Date();
					var timer = "void"+i;
					if(voidStart - nowTime > 0){
						$('#Void').append("<div id =\"wrap\"><p id =\"white2\">" + voidData[i].node + " | " + voidData[i].missionType + " | " + voidData[i].enemy + ' | ' + voidData[i].tier 
							+ "</p> <p class = \"fissures \" id=\"void" + i + "\">...</p></div>");
						setTimer(voidStart, timer, 0, "start");
					}
					else if(voidTime - nowTime > 0){ //not expired
						$('#Void').append("<div id =\"wrap\"><p id =\"white2\">" + voidData[i].node + " | " + voidData[i].missionType + " | " + voidData[i].enemy 
							+ "</p> <p class = \"fissures\" id=\"void" + i + "\">...</p> <p class=\"Tier\" id=\"fissure"+i+"\">"+ voidData[i].tier + "</p></div>");
						setTimer(voidTime, timer, 0, "active");
					}
					if(voidData[i].tier == "Meso" || voidData[i].tier == "Axi"){
						document.getElementById("fissure"+i).style.backgroundColor = "purple";
					}
				}
			}
		}

		setInterval(function() {
			var changes = false;
			$.getJSON('https://api.warframestat.us/xb1/fissures', function(voidData) {
				if(voidJSON.length == voidData.length){
					for(var i = 0; i<voidData.length;i++){
						if(voidData[i].id != voidJSON[i].id){
							changes = true;
							break;
						}
					}
				}
				if(voidJSON.length != voidData.length || changes == true){
					console.log("Refreshing Void Fissures!");
					document.location.reload(true); 
					//In order to do the other $("#Alerts").load("")... need to have a localhost set up
				}
			});
		}, 1000);
	});
}
//------------------------------------------End of Void Fissures-------------------------------------------------------------------

//darvo
function setUpDarvo(){
	$.getJSON('https://api.warframestat.us/xb1/dailyDeals', function(darvoData) {
		$('#Darvo').empty();
		var end = new Date(darvoData[0].expiry);
		var timer = "darvoTimer"; 
		var remaining = darvoData[0].total - darvoData[0].sold;
		$('#Darvo').append("<div id =\"wrap\"><p id = \"white\">"+darvoData[0].item + " | " +darvoData[0].salePrice + " plat | " + remaining + "/" + darvoData[0].total 
			+ " remaing | "+ darvoData[0].discount+ "% off"+ "</p><p class = \"darvo\" id=\"darvoTimer\">...</p></div>");
		setTimer(end, timer,0, "active");
	});
}
//------------------------------------------End of Darvo Daily Deal--------------------------------------------------------------------------------

//news
function setUpNews(){
	$.getJSON('https://api.warframestat.us/xb1/news', function(newsData) {
		$('#News').empty();
		var eta;
		for(var i = newsData.length-1; i>=0;i--){
			$('#News').append("<div id =\"wrap\"> <p class = \"timer\" id = \"time" + i + "\"></p><p id = \"white\">" + newsData[i].message + "</p></div>");
			//Below is used to fix the formatting if it happens
			eta = newsData[i].eta;
			eta = eta.split(" ");
			if(eta[0] == "in")
				eta[0] = eta[1];

			//fix the -hr or day problem when the API oddly sets the eta to a - value instead of positve ago
			eta[0] = eta[0].split("-");
			if(eta[0][0] == ""){
				eta[0] = eta[0][1];
			}
			document.getElementById("time"+i).innerHTML = eta[0];
		}
	});
}
//------------------------------------------End of News ------------------------------------------------------------------------------------------

//Syndicate
function setUpSyndicate(){
	$.getJSON('https://api.warframestat.us/xb1/syndicateMissions', function(synData) {
		$('#Syndicate').empty();
		var expSyn = new Date(synData[0].expiry);
		for(var i = 0; i <synData.length; i++){
			var nodes = "";
			var singleNode = "";
			if(synData[i].syndicate != "Quills" && synData[i].syndicate != "Operations Syndicate" && 
				synData[i].syndicate != "Ostrons" && synData[i].syndicate != "Assassins" && 
				synData[i].syndicate != "EventSyndicate") {
				
				singleNodes = synData[i].nodes;
				for(var j = 0; j<singleNodes.length -1; j++){
					nodes += singleNodes[j] + " | ";
				}
				nodes += singleNodes[singleNodes.length -1];
				$('#Syndicate').append("<div id =\"wrap\">"+
					"<p id = \"white\">"+ nodes +"</p>"+
					"<p class = synTimer id =\"syn" + i +"\">...</p>"+
					"<p class=\"syn\">"+ synData[i].syndicate + "</p>"+
				"</div>");
				var timer = "syn"+i;
				setTimer(expSyn,timer, 0, "active");
			}
		}
	});
}
//------------------------------------------End of Syndicate--------------------------------------------------------------------------------------

//Baro Ki'Teer
function setUpBaro(){
	$.getJSON('https://api.warframestat.us/xb1/voidTrader', function(baroData) {
		$('#Baro').empty();
		var baroStart = new Date(baroData.activation);
		var baroEnd = new Date(baroData.expiry);
		var now = new Date();
		if(baroStart - now >0){ //Baro hasn't arrived at a Relay
			$('#Baro').append("<div id =\"wrap\">"+
				"<p id=\"voidTrader\">" + baroData.character + " | Coming to: " + baroData.location +"</p>"+
				"<p class = \"baroTimer\" id=\"baro\">...</p>"+
			"</div>");
			setTimer(baroStart,'baro',0, 'start');
		}else{ //Baro has arrived at a Relay
			$('#Baro').append("<div id =\"wrap\">"+
				"<p id=\"voidTrader\">" + baroData.character + " | Located at: " + baroData.location +"</p>"+
				"<p class = \"baroTimer\" id=\"baro\">...</p>"+
			"</div>");
			setTimer(baroEnd, 'baro',0, "active");
			for(var i = 0; i<baroData.inventory.length; i++){ //Add baro's wares to #Baro
				$('#Baro').append("<div id = \"wrap\">"+
					"<p id=\"white\">" + baroData.inventory[i].item + "</p>"+
					"<p class = \"price\">"+ baroData.inventory[i].ducats + " ducats | "+ baroData.inventory[i].credits + " credits" +"</p>"+
				"</div>");
			}
		}
	});	
}
//------------------------------------------End of Baro Ki'Teer----------------------------------------------------------------------------------

//Invasions
/*
NOTE*
Bar always goes from right to left. 
completion % =    (count + reqcount)/(reqCount *2) based off of api JSON file

bar % = how full to the right it is
EX:   75%    * =  bar
0 - - - - - - - - - 100 
****************
*/
function setUpInvasions(){
	$.getJSON('https://api.warframestat.us/xb1/invasions', function(invData) {
		$('#Invasions').empty();
		for(var i = 0; i < invData.length; i++){
			var percent = invData[i].completion;
			percent = Math.round(percent * 10)/10;
			//defenderReward will always have a counted item so just need to check to see if this one has anything
			if(percent >=0 && percent <100){
				if(invData[i].attackerReward.countedItems.length > 0 ){
					if(invData[i].attackerReward.countedItems[0].count > 1){ //more then 1 reward of same time
						$('#Invasions').append("<div class = \"invasions\">"+
							"<br>"+
							"<p class = \"invasionsNode\">"+ invData[i].node + " | " + invData[i].attackingFaction + " vs " + invData[i].defendingFaction + " | " + percent + "% left"+"</p>"+
							"<p class = \"invasionsGreenLeft\" id=\"leftDrop"+i+"\">"+invData[i].attackerReward.countedItems[0].count + " " + invData[i].attackerReward.countedItems[0].type + "</p>"+
							"<p class = \"invasionsGreenRight\" id=\"rightDrop"+i+"\">"+ invData[i].defenderReward.countedItems[0].count + " " + invData[i].defenderReward.countedItems[0].type + "</p>"+
							"<div  id=\"myProgress"+i+"\" style=\"width:99%;background-color:red;border-radius:10px;margin:0px 0px 10px 3px;position:absolute;top:25px;\">"+
								"<div id=\"container\">"+
									"<img id=\"left"+i+"\" + src=\"./grineer.png\" style=\"height:33px;position:absolute;left:5px;top:-1px;\">"+
									"<img id=\"right"+i+"\" + src=\"./grineer.png\" style=\"height:33px;position:absolute;right:6px;top:-1px;\">"+
								"</div>"+
								"<div id=\"myBar"+i +"\" style=\"width:"+ percent+"%;height:30px;background-color:green;border-radius:10px\">"+
									"</div>"+
							"</div>"+
						"</div>");
					}
					else{ // 1 reward
						$('#Invasions').append("<div class = \"invasions\">"+
							"<br>"+
							"<p class = \"invasionsNode\">"+ invData[i].node + " | " + invData[i].attackingFaction + " vs " + invData[i].defendingFaction + " | " + percent + "% left"+"</p>"+
							"<p class = \"invasionsGreenLeft\" id=\"leftDrop"+i+"\">"+ invData[i].attackerReward.countedItems[0].type + "</p>"+
							"<p class = \"invasionsGreenRight\" id=\"rightDrop"+i+"\">"	+ invData[i].defenderReward.countedItems[0].type + "</p>"+
							"<div id=\"myProgress"+i+"\" style=\"width:99%;background-color:red;border-radius:10px;margin:0px 0px 10px 3px;position:absolute;top:25px;\">"+
								"<div id=\"container\">"+
									"<img id=\"left"+i+"\" + src=\"./grineer.png\" style=\"height:33px;position:absolute;left:5px;top:-1px;\">"+
									"<img id=\"right"+i+"\" + src=\"./grineer.png\" style=\"height:33px;position:absolute;right:6px;top:-1px;\">"+
								"</div>"+
								"<div id=\"myBar"+i +"\" style=\"width:"+ percent+"%;height:30px;background-color:green;border-radius:10px\">"+
								"</div>"+
							"</div>"+
						"</div>");

						//change the background color to blue for weapon parts or other items that aren't a resoucre. (bp, weapon parts, ex adapter, reactor, catalyst)
						if(invData[i].defenderReward.countedItems[0].type != "Feildron" && invData[i].defenderReward.countedItems[0].type != "Detonite Injector" 
							&& invData[i].defenderReward.countedItems[0].type != "Mutagen Mass" && invData[i].defenderReward.countedItems[0].type != "Mutalist Alad V Coordinate") {
							
							document.getElementById("leftDrop"+i).style.backgroundColor = "blue";
							document.getElementById("rightDrop"+i).style.backgroundColor = "blue";
						}
					}	
				}
				else{ //1 item with reward
					if(invData[i].defenderReward.countedItems[0].count > 1){ // 1 reward with multiple of it
						$('#Invasions').append("<div class = \"invasions\">"+
						"<br>"+
						"<p class = \"invasionsNode\">"+ invData[i].node + " | " + invData[i].attackingFaction + " vs " + invData[i].defendingFaction + " | " + percent + "% left"+"</p>"+
						"<p class = \"invasionsGreenRight\" id=\"rightDrop"+i+"\">"+ invData[i].defenderReward.countedItems[0].count + " " + invData[i].defenderReward.countedItems[0].type + "</p>"+
						"<div  id=\"myProgress"+i+"\" style=\"width:99%;background-color:red;border-radius:10px;margin:0px 0px 10px 3px;position:absolute;top:25px;\">"+
							"<div id=\"container\">"+
								"<img id=\"left"+i+"\" + src=\"./grineer.png\" style=\"height:33px;position:absolute;left:5px;top:-1px;\">"+
								"<img id=\"right"+i+"\" + src=\"./grineer.png\" style=\"height:33px;position:absolute;right:6px;top:-1px;\">"+
							"</div>"+
							"<div id=\"myBar"+i +"\" style=\"width:"+ percent+"%;height:30px;background-color:green;border-radius:10px\">"+
							"</div>"+
						"</div>"+
					"</div>");				
					}else{
						$('#Invasions').append("<div class = \"invasions\">"+
							"<br>"+
							"<p class = \"invasionsNode\">"+ invData[i].node + " | " + invData[i].attackingFaction + " vs " + invData[i].defendingFaction + " | " + percent + "% left"+"</p>"+
							"<p class = \"invasionsGreenRight\" id=\"rightDrop"+i+"\">"+ invData[i].defenderReward.countedItems[0].type + "</p>"+
							"<div  id=\"myProgress"+i +"\" style=\"width:99%;background-color:red;border-radius:10px;margin:0px 0px 10px 3px;position:absolute;top:25px;\">"+
								"<div id=\"container\">"+
									"<img id=\"left"+i+"\" + src=\"./grineer.png\" style=\"height:33px;position:absolute;left:5px;top:-1px;\">"+
									"<img id=\"right"+i+"\" + src=\"./grineer.png\" style=\"height:33px;position:absolute;right:6px;top:-1px;\">"+
								"</div>"+
								"<div id=\"myBar"+i +"\" style=\"width:"+ percent+"%;height:30px;background-color:green;border-radius:10px\">"+
								"</div>"+
							"</div>"+
						"</div>");
					
						//change the background color to blue for weapon parts or other items that aren't a resoucre. (bp, weapon parts, ex adapter, reactor, catalyst)
						if(invData[i].defenderReward.countedItems[0].type != "Feildron" && invData[i].defenderReward.countedItems[0].type != "Detonite Injector" 
							&& invData[i].defenderReward.countedItems[0].type != "Mutagen Mass" && invData[i].defenderReward.countedItems[0].type != "Mutalist Alad V Nav Coordinate"){
							
							//no left side
							document.getElementById("rightDrop"+i).style.backgroundColor = "blue";
						}
					}
				}
				//Should never be a weapon part based on current game invasion mechanics
				if(invData[i].defendingFaction == "Corpus"){
					document.getElementById("myProgress"+i).style.backgroundColor = "blue";
					document.getElementById("right"+i).src = "./Images/corpus.png";
				}
				if(invData[i].defendingFaction == "Grineer"){
					document.getElementById("myProgress"+i).style.backgroundColor = "red";
					document.getElementById("right"+i).src = "./Images/grineer.png";
				}
				if(invData[i].defendingFaction == "Infested"){
					document.getElementById("myProgress"+i).style.backgroundColor = "green";
					document.getElementById("right"+i).src = "./Images/infestation.png";
				}
				if(invData[i].attackingFaction == "Corpus"){
					document.getElementById("myBar"+i).style.backgroundColor = "blue";
					document.getElementById("left"+i).src = "./Images/corpus.png";
				}
				if(invData[i].attackingFaction == "Grineer"){
					document.getElementById("myBar"+i).style.backgroundColor = "red";
					document.getElementById("left"+i).src = "./Images/grineer.png";
				}
				if(invData[i].attackingFaction == "Infested"){
					document.getElementById("myBar"+i).style.backgroundColor = "green";
					document.getElementById("left"+i).src = "./Images/infestation.png";
				}
			}
		}
	});
}
//------------------------------------------End of Invasions--------------------------------------------------------------------------------------
//******************************************************************************
//**  File: Arcanes_Weapons.js
//**  Date: July 2018
//**  Author: Ken McIntosh
//******************************************************************************
$(document).ready(function () {
	loadArcanes();
	loadWeapons();
});


/* Arcane format 7/2018
	"regex":"acceleration",
    "name":"Arcane Acceleration",
    "effect":"On critical hit, 5% / 10% / 15% / 20% chance\nto give 15% / 30% / 45% / 60% Fire Rate to Rifles\nfor 1.5 / 3 / 4.5 / 6 Seconds",
    "rarity":"Uncommon",
    "location":"Changing, check droptable",
    "thumbnail":"https://vignette2.wikia.nocookie.net/warframe/images/9/96/Arcane_Acceleration_160.png/revision/latest/scale-to-width-down/75?cb=20150407090527",
    "info":"http://warframe.wikia.com/wiki/Arcane_Acceleration"
*/

// not going to display the thumbnail due to the picture not appearing to load correctly. Will test again later 7/19/2018
// regex can be ignored for displaying info
// location hasn't been updated since change approx 4/2018. Current drop from POE will manually Change **Note
// Info will be shorted to a diff link
// effect layout is not consitent and varies dramitically so specail formatting would require many special cases.
	//do to complexity going to just use the string for now. May hand type it all out layout in "pretty" format at later date.
function loadArcanes(){
	$.getJSON('https://api.warframestat.us/arcanes', function(voidArcanes) {
		$('#Arances').empty(); //make sure it is cleaned out
		if(voidArcanes != null){
			for(var i = 0; i < voidArcanes.length;i++){ //loop through all of the arcanes to display their info
				//name                        rarity
				//effect
				//location
				//info: wiki
				$('#Arcanes').append("<div class =\"itemWrap\" id=\"arcane"+ i + "\">"+
						"<p class=\"Arc_Name\" id=\"arc_Name"+i+"\">"+voidArcanes[i].name +"</p>"+
						"<p class=\"Arc_Rarity\" id= \"arc_Rarity" + i +"\">"+voidArcanes[i].rarity+"</p>"+
						"<p id=\"arc_Effect\"> EFFECT: "+voidArcanes[i].effect+"</p>"+
						"<p class = \"Arc_Loc\" id=\"arc_Loc"+ i + "\">LOCATION: Drops from Plains of Eidolon (POE) on Earth.</p>"+
						"<a id=\"arc_Info\" href=\""+voidArcanes[i].info +"\" target=\"_blank\">Wiki Info</a>"+
					"</div>");

				var nameCheck = "";
				var num = 0;
				while (voidArcanes[i].name[num] != " "){
					nameCheck = nameCheck + voidArcanes[i].name[num];
					num++;
				}				
				//color code based on rarity
				if(nameCheck == "Magus"){ //operator arcane
					document.getElementById("arcane"+i).style.borderColor = "#008000";
					document.getElementById("arc_Name"+i).style.backgroundColor = "#008000"
					document.getElementById("arc_Rarity"+i).style.backgroundColor = "#008000"
					document.getElementById("arc_Loc"+i).innerHTML = "LOCATION: Quills Syndicate Item for purchase";
				}else if(nameCheck == "Virtuos"){ //amp arcane
					document.getElementById("arcane"+i).style.borderColor = "#FF4500";
					document.getElementById("arc_Name"+i).style.backgroundColor = "#FF4500"
					document.getElementById("arc_Rarity"+i).style.backgroundColor = "#FF4500"
					document.getElementById("arc_Loc"+i).innerHTML = "LOCATION: Quills Syndicate Item for purchase";
				}else if (nameCheck == "Exodia") { // Exodia arc
					document.getElementById("arcane"+i).style.borderColor = "#FF00FF";
					document.getElementById("arc_Name"+i).style.backgroundColor = "#FF00FF"
					document.getElementById("arc_Rarity"+i).style.backgroundColor = "#FF00FF"
					document.getElementById("arc_Loc"+i).innerHTML = "LOCATION: Nak (During Plague Star Event Only) Item for purchase";
				}
				else if(voidArcanes[i].rarity == "Common"){ //bronze
					document.getElementById("arcane"+i).style.borderColor = "#CD7F32";
					document.getElementById("arc_Name"+i).style.backgroundColor = "#CD7F32"
					document.getElementById("arc_Rarity"+i).style.backgroundColor = "#CD7F32"
				}else if(voidArcanes[i].rarity == "Uncommon"){ //silver
					document.getElementById("arcane"+i).style.borderColor = "#C0C0C0";
					document.getElementById("arc_Name"+i).style.backgroundColor = "#C0C0C0"
					document.getElementById("arc_Rarity"+i).style.backgroundColor = "#C0C0C0"
				}else if(voidArcanes[i].rarity == "Rare"){ //Gold
					document.getElementById("arcane"+i).style.borderColor = "#FFD700";
					document.getElementById("arc_Name"+i).style.backgroundColor = "#FFD700"
					document.getElementById("arc_Rarity"+i).style.backgroundColor = "#FFD700"
				}else { //Legendary //Not currently in use. Arcanes haven't been updated in API since game changes
					//
				}		
			}	
		}
	});
}

// Cant use weapon name as an ID because it can contain spaces which requires a work around.
// Will format it based on EX: "Primary#", #++ for every primary found starting @ 0
function loadWeapons(){
	$.getJSON('https://api.warframestat.us/weapons', function(weapons){
		var primNum = 0;
		var secNum = 0;
		var meleeNum = 0;

		for(var i =0; i< weapons.length;i++){
			if(weapons[i].category == "Primary"){
				addWeapon(weapons[i], primNum, "Primary");
				primNum++;
			}
			else if(weapons[i].category == "Secondary"){
				addWeapon(weapons[i], secNum, "Secondary");
				secNum++;
			}else{
				//melee
				addWeapon(weapons[i], meleeNum, "Melee");
				meleeNum++;
			}
		}
	});
}


function addWeapon (weapon, weaponNum, category){
	var dmgTypes = "";
	var factionGame = "";
	if(weapon.damageTypes != null){
		for(var loopTypes in weapon.damageTypes){
			dmgTypes += loopTypes + ": " +  weapon.damageTypes[loopTypes]+ " ";
		}
	}else{
		dmgTypes = "Not Provided";
	}

	if (weapon.tags == null || (weapon.tags).length === 0){
		factionGame = "Mo Faction Listed";
	}else{
		factionGame = weapon.tags[0];
	}

	$('#'+category).append("<div class =\"weaponWrap\">"+
				"<div class=\"title_Descript_Container\">"+
					"<h2>"+weapon.name + "</h2>"+
					"<p id = \"whiteWeapon\">Type: "+weapon.type +"</p>"+
					"<p id = \"whiteWeaponDesc\">"+weapon.description +"</p>"+
					"<div id=\""+category+weaponNum+"\">"+
					"</div>"+
				"</div>"+
			"</div>");

	//have to check to make sure it has wikiaThumbnail as not all do
	
	if(weapon.wikiaThumbnail != null){
		//add the image next
		$("#"+category+weaponNum).append("<div class = \"imgContainer\">"+
					"<img id = \"pic\" + src="+weapon.wikiaThumbnail+">"+
				"</div>");
	}else{
		$("#"+category+weaponNum).append("<div class = \"imgContainer\">"+
					"<p id = \"whiteWeapon\" style=\"text-align: center;\">No Image URL In JSON</p>"+
				"</div>");
	}

	if(category == "Primary" || category == "Secondary"){
		addStatsGuns(weapon,weaponNum,category, dmgTypes, factionGame);
	}else{
		addStatsMelee(weapon,weaponNum,category, dmgTypes, factionGame);
	}

	//See if it is a pre-built weapon or a blueprint
	if(weapon.buildPrice == null){ //Doesn't have the key then it isn't a bp
		$("#"+category+weaponNum).append("<h3>Blueprint Requirements:</h3>"+
			"<p> </p>"+ //empty space padding
			"<h3> N/A </h3>"+
			"<h3>Comes Pre-built </h3>");
	}
	else{
		//it has a bp and compents more checks required to make sure its valid information
		$("#"+category+weaponNum).append("<h3>Blueprint Requirements</h3>"+
					"<p> </p>"+ //empty space padding
					"<p id = \"whiteWeapon\">Build Price: "+weapon.buildPrice +"cc</p>" +
					"<p id = \"whiteWeapon\">Build Time: "+ (weapon.buildTime / (60*60)) +" hours</p>"+ //sec -> hrs
					"<p id = \"whiteWeapon\">Price to Rush Build: "+weapon.skipBuildTimePrice +" Platinum</p>" +
					"<p id = \"whiteWeapon\">Build Price: "+weapon.buildPrice +"cc</p>"+
					"<h4>Blueprint Crafting Components<h4>");

		//Compents can have different amounts of items in the components[]
		//each comp should have:
				
				//	name
				//	description
				//	count
				//	tradeable		
		for(var comp = 0; comp < weapon.components.length; comp++){
			$("#"+category+weaponNum).append("<p id = \"whiteWeapon\">Component Piece: "+ weapon.components[comp].name +"</p>"+
					"<p id = \"whiteWeapon\">Components Description: "+weapon.components[comp].description +"</p>"+
					"<p id = \"whiteWeapon\">Component Count: "+weapon.components[comp].itemCount +"</p>"+
					"<p id = \"whiteWeapon\">Component Tradeable: "+weapon.components[comp].tradable +"</p>"+
					"<p> <p>");
		} 
	}
}

function addStatsGuns(weapon, weaponNum,category,dmgTypes, factionGame){
		//Universal for all Guns currently
	$("#"+category+weaponNum).append("<div class= \"universalWeaponContainer\">"+
		"<p id = \"whiteWeapon\">Accuracy: "+ (weapon.accuracy).toFixed(2) +"%</p>"+
		"<p id = \"whiteWeapon\">Critical Chance: "+ (weapon.criticalChance * 100).toFixed(2)+"%</p>"+
		"<p id = \"whiteWeapon\">Critical Damage Multiplier: "+weapon.criticalMultiplier +"x</p>"+
		"<p id = \"whiteWeapon\">Fire Rate: "+ (weapon.fireRate).toFixed(2) +"</p>"+
		"<p id = \"whiteWeapon\">Magazine Size: "+weapon.magazineSize +"</p>"+
		"<p id = \"whiteWeapon\">Noise Type: "+weapon.noise +"</p>"+
		"<p id = \"whiteWeapon\">Reload Time: "+ (weapon.reloadTime).toFixed(2) +" sec</p>"+
		"<p id = \"whiteWeapon\">Status Chance: "+(weapon.procChance * 100).toFixed(2) +"%</p>"+
		"<p id = \"whiteWeapon\">Trigger Type: "+weapon.trigger +"</p>"+
		"<p id = \"whiteWeapon\">Damage Total: "+weapon.damage +"</p>"+
		"<p id = \"whiteWeapon\">Damage Breakdown: "+ dmgTypes +"</p>"+ //passed into function
		"<p id = \"whiteWeapon\">Riven Disposition: "+weapon.disposition +" / 5</p>"+
		"<p id = \"whiteWeapon\">Omega Attenuation (Rivens): "+ (weapon.omegaAttenuation).toFixed(2) +"</p>"+ 
		"<p id = \"whiteWeapon\">Mastery Requirement: "+weapon.masteryReq +"</p>"+
		"<p id = \"whiteWeapon\">Bullet Type: "+weapon.trigger +"</p> "+
		"<p id = \"whiteWeapon\">Vaulted: "+weapon.vaulted +"</p>"+
		"<p id = \"whiteWeapon\">Tradeable: "+weapon.tradable +"</p>"+
		"<p id = \"whiteWeapon\">Faction Association: "+factionGame +"</p>"+ //passed into function
		"<p> </p>"+//empty space
		"<a href=\""+weapon.wikiaUrl +"\" target=\"_blank\" style= \"padding-left:10px; color:blue\">Wiki Info</a>"+
		"<p> </p>"+
	"</div>");//empty space
	}

function addStatsMelee(weapon,weaponNum,category,dmgTypes,factionGame){
	//melee weapons have a few differences attack speed, no trigger/bullet type, leap attack, spin attack, etc.
	$("#"+category+weaponNum).append("<div class= \"universalWeaponContainer\">"+
		"<p id = \"whiteWeapon\">Accuracy: "+ (weapon.accuracy).toFixed(2) +"%</p>"+
		"<p id = \"whiteWeapon\">Critical Chance: "+ (weapon.criticalChance * 100).toFixed(2)+"%</p>"+
		"<p id = \"whiteWeapon\">Critical Damage Multiplier: "+weapon.criticalMultiplier +"x</p>"+
		"<p id = \"whiteWeapon\">Attack Speed: "+ (weapon.fireRate).toFixed(2) +"</p>"+
		"<p id = \"whiteWeapon\">Noise Type: "+weapon.noise +"</p>"+
		"<p id = \"whiteWeapon\">Status Chance: "+(weapon.procChance * 100).toFixed(2) +"%</p>"+
		"<p id = \"whiteWeapon\">Damage Total: "+weapon.damage +"</p>"+
		"<p id = \"whiteWeapon\">Damage Breakdown: "+ dmgTypes +"</p>"+ //passed into function
		"<p id = \"whiteWeapon\">Leap Attack: "+weapon.leapAttack +"</p>"+
		"<p id = \"whiteWeapon\">Spin Attack: "+(weapon.spinAttack)*2 +"</p>"+
		"<p id = \"whiteWeapon\">Riven Disposition: "+weapon.disposition +" / 5</p>"+
		"<p id = \"whiteWeapon\">Omega Attenuation (Rivens): "+ (weapon.omegaAttenuation).toFixed(2) +"</p>"+ 
		"<p id = \"whiteWeapon\">Mastery Requirement: "+weapon.masteryReq +"</p>"+
		"<p id = \"whiteWeapon\">Vaulted: "+weapon.vaulted +"</p>"+
		"<p id = \"whiteWeapon\">Tradeable: "+weapon.tradable +"</p>"+
		"<p id = \"whiteWeapon\">Faction Association: "+factionGame +"</p>"+ //passed into function
		"<p> </p>"+//empty space
		"<a href=\""+weapon.wikiaUrl +"\" target=\"_blank\" style= \"padding-left:10px; color:blue\">Wiki Info</a>"+
		"<p> </p>"+
	"</div>");//empty space
}
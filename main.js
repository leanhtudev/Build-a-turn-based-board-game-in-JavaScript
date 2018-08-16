
var randomPosition1;
var randomPosition2;
var randomWeapon;
var randomWeaponObject = [];
var dimmedSpot;
var unavailableSpot = [];
var moveStatus = 1;
var moveRangeArray = [];
var pressIndex = 0;
var availableSpot = [];
var avoidLeftSideMove = [];
var avoidRightSideMove = [];
var weaponDetect;
var buttonpressed = false;

for (i = 10; i <= 90; i = i + 10) {
	avoidLeftSideMove.push(i);
};
for (i = 11; i <= 100; i = i + 10) {
	avoidRightSideMove.push(i);
};
var defend = 0;
var surroundingP1 = [];
var surroundingP2 = [];
var currentPlayer = player1;
//create Object Character
var Character = {
	// Initialize the character
	initCharacter: function (name, health, force) {
		this.name = name;
		this.health = health;
		this.force = force;
	},
	hold: 0,
	weaponName: "",
	position: 0,
	target: '',
	// Attack a target
	attack: function (target) {
		target.health = target.health - this.force;
		console.log(target.name + ' has ' + target.health + ' health left');

		/*
		
		if (this.health > 0) {
		
		target.health = target.health - this.force;
		console.log("target health: " +target.health);
		if (target.health > 0) {
		console.log(target.name + " has " + target.health + " health points left");
		} else {
		target.health = 0;
		console.log(target.name + " has been eliminated!");
		document.getElementById(this.position).innerHTML="eliminated";
		}
		} else {
		console.log("not enough health");
		}
		*/
	},
	attackWithDefend: function (target) {
		target.health = target.health - this.force / 2;
		console.log(target.name + ' has ' + target.health + ' health left');
	}
};


var Player = Object.create(Character);
// Initialize the player
Player.initPlayer = function (name, health, force) {
	this.initCharacter(name, health, force);
	this.xp = 0;
};

// Fight an enemy
Player.fight = function (enemy) {
	this.attack(enemy);
	if (enemy.health === 0) {
		console.log(this.name + " eliminated " + enemy.name + " and wins " +
			enemy.value + " experience points");
		this.xp += enemy.value;
	}
};

//create Player1
var player1 = Object.create(Player);
player1.initPlayer("Mario", 100, 10);
//create Player2
var player2 = Object.create(Player);
player2.initPlayer("Bird", 100, 10);

var currentPlayer = player1;
player1.target = player2;
player2.target = player1;

$(document).ready(function () {
	document.getElementById("marioTurn").innerHTML="Your Turn";
	document.getElementById("birdTurn").innerHTML="Wait";
	show();
	for (i = 1; i <= 100; i++) {
		document.getElementById("main").innerHTML += '<div class="cell" id="' + i + '"></div>';
	}
	//creating available Spot
	for (i = 1; i <= 100; i++) {
		availableSpot.push(i);
	}




	//creating unavailable spot
	for (i = 0; i <= 9; i++) {
		var dimmedSpot = Math.floor((Math.random() * 100) + 1);
		document.getElementById(dimmedSpot).style.backgroundColor = "black";
		unavailableSpot.push(dimmedSpot);
		//refresh available spot
		if (availableSpot.indexOf(dimmedSpot) != -1) {
			availableSpot.splice(availableSpot.indexOf(dimmedSpot), 1);
		}
	}


	//create Player1's position
	randomPosition1 = Math.floor((Math.random() * 100) + 1);
	while (availableSpot.indexOf(randomPosition1) == -1) {
		randomPosition1 = Math.floor((Math.random() * 100) + 1);
	}
	player1.position = randomPosition1;

	$('#' + randomPosition1).append('<img src="img/mario.jpg" height="50" width="50">');

	//create Player2's position
	randomPosition2 = Math.floor((Math.random() * 100) + 1);
	while (availableSpot.indexOf(randomPosition2) == -1 || surroundingCell(randomPosition1).indexOf(randomPosition2) != -1) {
		randomPosition2 = Math.floor((Math.random() * 100) + 1);
	}
	player2.position = randomPosition2;

	$('#' + randomPosition2).append('<img src="img/angrybird.png" height="50" width="50">');
	

	//random Position for weapon
	for (i = 0; i < 4; i++) {
		randomWeapon = Math.floor((Math.random() * 100) + 1);
		while (availableSpot.indexOf(randomWeapon) == -1 || randomWeapon == randomPosition1 || randomWeapon == randomPosition2 || randomWeaponObject.indexOf(randomWeapon) != -1) {
			randomWeapon = Math.floor((Math.random() * 100) + 1);
		}
		var weaponElement = {
			init: function (name, position, damage) {
				this.name = name;
				this.position = position;
				this.damage = damage;
			}
		}
		if (i == 0) {
			$('#' + randomWeapon).append('<img src="img/cake.png" height="50" width="50">');
			var damage = Math.floor((Math.random() * 100) + 1);
			weaponElement.init('cake', randomWeapon, damage);
			randomWeaponObject.push(weaponElement);
		}
		else if (i == 1) {
			$('#' + randomWeapon).append('<img src="img/donut.jpg" height="50" width="50">');
			var damage = Math.floor((Math.random() * 100) + 1);
			weaponElement.init('donut', randomWeapon, damage);
			randomWeaponObject.push(weaponElement);

		}
		else if (i == 2) {
			$('#' + randomWeapon).append('<img src="img/pizza.png" height="50" width="50">');
			var damage = Math.floor((Math.random() * 100) + 1);
			weaponElement.init('pizza', randomWeapon, damage);
			randomWeaponObject.push(weaponElement);

		}
		else {
			$('#' + randomWeapon).append('<img src="img/burger.png" height="50" width="50">');
			var damage = Math.floor((Math.random() * 100) + 1);
			weaponElement.init('burger', randomWeapon, damage);
			randomWeaponObject.push(weaponElement);

		}



	}

	

	$(document).keydown(function (e) {
		if(pressIndex<=3){



			switch (e.which) {
				case 37:    //left arrow key
					console.log(currentPlayer);
					
					var check = currentPlayer.position - 1;
					if (availableSpot.indexOf(check) != -1 && avoidLeftSideMove.indexOf(check) == -1) {
						var previous = currentPlayer.position;
						currentPlayer.position--;
						pressIndex++;
						weaponCheck(previous, currentPlayer.position);
						playersTouch(currentPlayer.position, currentPlayer.target.position);
						show();
					}
					break;
				case 38:    //up arrow key
					var check = (currentPlayer.position) - 10;
					if (availableSpot.indexOf(check) != -1) {
						var previous = currentPlayer.position;
						currentPlayer.position -= 10;
						pressIndex++;
						weaponCheck(previous, currentPlayer.position);
						playersTouch(currentPlayer.position, currentPlayer.target.position);
						show();
					}
					break;
				case 39:    //right arrow key
					var check = currentPlayer.position + 1;
					if (availableSpot.indexOf(check) != -1 && avoidRightSideMove.indexOf(check) == -1) {
						var previous = currentPlayer.position;
						currentPlayer.position++;
						pressIndex++;
						weaponCheck(previous, currentPlayer.position);
						playersTouch(currentPlayer.position, currentPlayer.target.position);
						show();
					}
					break;
				case 40:    //bottom arrow key
					var check = currentPlayer.position + 10;
					if (availableSpot.indexOf(check) != -1) {
						var previous = currentPlayer.position;
						currentPlayer.position += 10;
						pressIndex++;
						weaponCheck(previous, currentPlayer.position);
						playersTouch(currentPlayer.position, currentPlayer.target.position);
						show();
					}
					break;
			}
		 }
	});

});


//use key to move






//check if number in array
function inArray(number) {
	for (i = 0; i < unavailableSpot.length; i++) {
		if (number == unavailableSpot[i]) {
			return true;
		}
	}
	return false;
}

function changeStatus() {
	if (pressIndex == 3) {
		if (currentPlayer == player1) {
			currentPlayer = player2;
			pressIndex = 0;

			document.getElementById("marioTurn").innerHTML="Wait";
			document.getElementById("birdTurn").innerHTML="Your Turn";
		} else if (currentPlayer == player2) {
			currentPlayer = player1;
			pressIndex = 0;
			document.getElementById("birdTurn").innerHTML="Wait";
			document.getElementById("marioTurn").innerHTML="Your Turn";
		}



	}	
}

function renderImage(name) {
		switch (name) {
			case 'donut': return '<img src="img/donut.jpg" height="50" width="50">';
				break;
			case 'cake': return '<img src="img/cake.png" height="50" width="50">';
				break;
			case 'burger': return '<img src="img/burger.png" height="50" width="50">';
				break;
			case 'pizza': return '<img src="img/pizza.png" height="50" width="50">';
				break;
		}
	}
function weaponCheck(previous, value) {
		document.getElementById(previous).innerHTML = " ";
		//render new img
		if(currentPlayer==player1){document.getElementById(value).innerHTML = '<img src="img/mario.jpg" height="50" width="50">';}
		else if(currentPlayer==player2){document.getElementById(value).innerHTML = '<img src="img/angrybird.png" height="50" width="50">';}
		
		//check if the player take the weapon or not
		for (i = 0; i < randomWeaponObject.length; i++) {
			if (value == randomWeaponObject[i].position) {


				if (currentPlayer.hold == 0) {
					currentPlayer.hold = 1;
				} else if (currentPlayer.hold == 1) {
					var weaponElement = {
						init: function (name, position, damage) {
							this.name = name;
							this.position = position;
							this.damage = damage;
						}
					}
					weaponElement.init(currentPlayer.weaponName, previous, currentPlayer.force);
					document.getElementById(previous).innerHTML = renderImage(currentPlayer.weaponName);
					randomWeaponObject.push(weaponElement);
					console.log(randomWeaponObject);
					
					
				}
				currentPlayer.weaponName = randomWeaponObject[i].name;
				currentPlayer.force = randomWeaponObject[i].damage;
				document.getElementById("weaponStatus").innerHTML=currentPlayer.name + ' has pick the weapon ' + currentPlayer.weaponName + ' and force is ' + currentPlayer.force;
				randomWeaponObject.splice(i, 1);
				console.log(randomWeaponObject);
			}

		}
	}
function surroundingCell(position) {
	var array = [position - 1, position + 1, position - 10, position + 10];
	return array;
}
function playersTouch(p1, p2) {                                                                                                                                                                                          
	surroundingP1 = surroundingCell(p1);
	surroundingP2 = surroundingCell(p2);
	if (surroundingP1.indexOf(p2) != -1 || surroundingP2.indexOf(p1) != -1) {
		pressIndex=4;
		document.getElementById("fightStatus").innerHTML+='Health of ' + currentPlayer.name + ' is ' + currentPlayer.health + ' with the force of ' + currentPlayer.force+'<br>';
		document.getElementById("fightStatus").innerHTML+='Health of ' + currentPlayer.target.name + ' is ' + currentPlayer.target.health + ' with the force of ' + currentPlayer.target.force + "<br>";
		attack();
	
/*
	while (player2.health > 0 && player1.health > 0) {
			var choose1 = prompt(currentPlayer.name + ' will attack ' + currentPlayer.target.name + '. ' + currentPlayer.target.name + ' can choose 0 to normal attack and 1 for defending.');
			if (choose1 == 0) { currentPlayer.attack(currentPlayer.target); }
			else if (choose1 == 1) { currentPlayer.attackWithDefend(currentPlayer.target); }

			var choose2 = prompt(currentPlayer.target.name + ' will attack ' + currentPlayer.name + '. ' + currentPlayer.name + ' can choose 0 to normal attack and 1 for defending.');
			if (choose2 == 0) { currentPlayer.target.attack(currentPlayer); }
			else if (choose2 == 1) { currentPlayer.target.attackWithDefend(currentPlayer); }
		}
		*/
	}
	else {
		changeStatus();
	}
}
function show(){
	document.getElementById("marioHealth").innerHTML=player1.health;
	document.getElementById("marioForce").innerHTML=player1.force;
	document.getElementById("marioWeapon").innerHTML=player1.weaponName;
	document.getElementById("birdHealth").innerHTML=player2.health;
	document.getElementById("birdForce").innerHTML=player2.force;
	document.getElementById("birdWeapon").innerHTML=player2.weaponName;
}


function attack(){
	if(currentPlayer.health>0 && currentPlayer.target.health>0){
		document.getElementById("fightInfo").innerHTML+=currentPlayer.name +' will attack ' + currentPlayer.target.name + "<br>";
		document.getElementById("pressInfo").innerHTML=currentPlayer.target.name+ " can choose 0 to be normally attacked or 1 to defend!";
		$("#button").show();
		$("#choose").show();
	}
}
function check(){
	var type = document.getElementById("choose").value;
	if(type>1 || type<0){
		document.getElementById("fightInfo").innerHTML+="Choose Type again, Its just 0 and 1!<br>";
		attack();
		document.getElementById("choose").value='';
	}
	else{
		document.getElementById("choose").value='';
		if(type==0){
		document.getElementById("fightInfo").innerHTML+=currentPlayer.target.name + " choose being normally attacked <br>";
			currentPlayer.attack(currentPlayer.target);
		} 
		else if(type==1){
			document.getElementById("fightInfo").innerHTML+=currentPlayer.target.name + " choose defend<br>";
			currentPlayer.attackWithDefend(currentPlayer.target);
		}
		document.getElementById("fightInfo").innerHTML+=currentPlayer.target.name + " has "+currentPlayer.target.health +" health left <br>";
		$("#button").hide();
		$("#choose").hide();
		if(currentPlayer.health<=0){
			document.getElementById("fightInfo").innerHTML+= currentPlayer.name + " is killed!";
		}
		else if(currentPlayer.target.health<=0){
			document.getElementById("fightInfo").innerHTML+= currentPlayer.target.name + " is killed!";
		}
		currentPlayer=currentPlayer.target;
		attack();
	}
	
}
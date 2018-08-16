
var randomPosition1;
var randomPosition2;
var randomWeapon;
var randomWeaponObject=[];
var dimmedSpot;
var unavailableSpot=[];
var moveStatus=1;
var moveRangeArray=[];
var pressIndex=0;
var availableSpot=[];
var avoidLeftSideMove=[];
var avoidRightSideMove=[];
var weaponDetect;
for(i=10;i<=90;i=i+10){
	avoidLeftSideMove.push(i);
};
for(i=11;i<=100;i=i+10){
	avoidRightSideMove.push(i);
};
var defend=0;
var surroundingP1=[];
var surroundingP2=[];
var currentPlayer=player1;
//create Object Character
var Character = {
    // Initialize the character
    initCharacter: function (name, health, force) {
        this.name = name;
        this.health = health;
        this.force = force;
    },
    hold: 0 ,
    weaponName:"",
    position:0,
    target:null,
    // Attack a target
    attack: function (target) {
        target.health=target.health-this.force;
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
        target.health=target.health-this.force/2;
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
player1.initPlayer("Mario", 150, 25);
//create Player2
var player2 = Object.create(Player);
player2.initPlayer("Bird", 150, 25);

player1.target=player2;
player2.target=player1;


$( document ).ready(function() {
   for(i=1;i<=100;i++){
   	document.getElementById("main").innerHTML+='<div class="cell" id="'+i+'"></div>';
   }
   //creating available Spot
   for(i=1;i<=100;i++){
   	availableSpot.push(i);
   }




   //creating unavailable spot
   for(i=0;i<=9;i++){
   	var dimmedSpot=Math.floor((Math.random()*100)+1);
   	document.getElementById(dimmedSpot).style.backgroundColor = "black";
   	unavailableSpot.push(dimmedSpot);
   	//refresh available spot
   	if(availableSpot.indexOf(dimmedSpot)!=-1){
   		availableSpot.splice(availableSpot.indexOf(dimmedSpot),1);
   	}
   }
   
  
  //create Player1's position
   randomPosition1=Math.floor((Math.random()*100)+1);
  while(availableSpot.indexOf(randomPosition1)==-1){
  	randomPosition1=Math.floor((Math.random()*100)+1);
  }
  
  player1.position=randomPosition1;
  $('#'+randomPosition1).append('<img src="img/mario.jpg" height="100" width="100">');
 
//create Player2's position
  randomPosition2=Math.floor((Math.random()*100)+1);
  while(availableSpot.indexOf(randomPosition2)==-1 || surroundingCell(randomPosition1).indexOf(randomPosition2)!=-1){
  	randomPosition2=Math.floor((Math.random()*100)+1);
  }
  
  player2.position=randomPosition2;
  $('#'+randomPosition2).append('<img src="img/angrybird.png" height="100" width="100">');

//random Position for weapon
	for(i=0;i<4;i++){
		randomWeapon=Math.floor((Math.random()*100)+1);
		while(availableSpot.indexOf(randomWeapon)==-1 ||randomWeapon==randomPosition1 || randomWeapon==randomPosition2 || randomWeaponObject.indexOf(randomWeapon)!=-1){
			randomWeapon=Math.floor((Math.random()*100)+1);
		}
 		var weaponElement={
 			init:function(name,position,damage){
 				this.name=name;
 				this.position=position;
 				this.damage=damage; 			}
 		}
 		if(i==0){
 			$('#'+randomWeapon).append('<img src="img/cake.png" height="100" width="100">');
 			var damage=Math.floor((Math.random()*100)+1);
 			weaponElement.init('cake',randomWeapon,damage);
 			randomWeaponObject.push(weaponElement);
 		}
 		else if(i==1){
 			$('#'+randomWeapon).append('<img src="img/donut.jpg" height="100" width="100">');
 			var damage=Math.floor((Math.random()*100)+1);
 			weaponElement.init('donut',randomWeapon,damage);
 			randomWeaponObject.push(weaponElement);
 			
 		}
 		else if(i==2){
 			$('#'+randomWeapon).append('<img src="img/pizza.png" height="100" width="100">');
 			var damage=Math.floor((Math.random()*100)+1);
 			weaponElement.init('pizza',randomWeapon,damage);
 			randomWeaponObject.push(weaponElement);
 			
 		}
 		else {
 			$('#'+randomWeapon).append('<img src="img/burger.png" height="100" width="100">');
 			var damage=Math.floor((Math.random()*100)+1);
 			weaponElement.init('burger',randomWeapon,damage);
 			randomWeaponObject.push(weaponElement);
 			
 		}
 		


	}
	 
	$(document).keydown(function(e){
    	if(pressIndex<3){
    		
    	 		switch (e.which){
			    case 37:    //left arrow key
			    	var check=currentPlayer.position-1;			    	
			    		if(availableSpot.indexOf(check)!=-1 && avoidLeftSideMove.indexOf(check)==-1){			    		
			    		var previous=currentPlayer.position;			    
			        	currentPlayer.position--;			        				        				        	
			        	pressIndex++;
			        	weaponCheck(previous,currentPlayer.position);
			        	playersTouch(currentPlayer.position,currentPlayer.target.position);
			    		} 			    	
			        break;
				    case 38:    //up arrow key
				    	var check=currentPlayer.position-10;				       
				        	if(availableSpot.indexOf(check)!=-1){				        		
				        		var previous=currentPlayer.position;
				       			currentPlayer.position-=10;			       							       			
				       			pressIndex++;				       			
				       			weaponCheck(previous,currentPlayer.position);
								playersTouch(currentPlayer.position,currentPlayer.target.position);
				        	}				        				        
       				 break;
				    case 39:    //right arrow key
				        var check=currentPlayer.position+1;				       
				        	if(availableSpot.indexOf(check)!=-1 && avoidRightSideMove.indexOf(check)==-1){				        		
				        		var previous=currentPlayer.position;
				        		currentPlayer.position++;			        						        		
				        		pressIndex++;
				        		weaponCheck(previous,currentPlayer.position);
				        		playersTouch(currentPlayer.position,currentPlayer.target.position);
				        	}				        				        
				        break;
				    case 40:    //bottom arrow key
				        var check = currentPlayer.position+10;				        
				        	if(availableSpot.indexOf(check)!=-1){				        		
				        		var previous=currentPlayer.position;
				        		currentPlayer.position+=10;				        						        		
				        		pressIndex++;
				        		weaponCheck(previous,currentPlayer.position);
				        		playersTouch(currentPlayer.position,currentPlayer.target.position);
				        	}				        				        
				        break;
				    }
								    						   
					    	} 

		//end			    	  		
});

});


	//use key to move
	


 


//check if number in array
function inArray(number){
	for(i=0;i<unavailableSpot.length;i++){
		if(number==unavailableSpot[i]){
			return true;
		}
	}
	return false;
}

function changeStatus(){
	if(pressIndex==3){
		if(currentPlayer==player1){
			currentPlayer=player2;
			pressIndex=0;
		}
		else if(currentPlayer==player2){
			currentPlayer=player1;
			pressIndex=0;
		}
		
	

}
function renderImage(name){
	switch(name){
		case 'donut': return '<img src="img/donut.jpg" height="100" width="100">';
		break;
		case 'cake': return '<img src="img/cake.png" height="100" width="100">';
		break;
		case 'burger': return '<img src="img/burger.png" height="100" width="100">'; 
		break;
		case 'pizza': return '<img src="img/pizza.png" height="100" width="100">';
		break;
	}
}

function weaponCheck(previous,value){

			
	if(moveStatus==1){
		player1.position=value;
		document.getElementById(previous).innerHTML = " ";
		document.getElementById(randomPosition1).innerHTML = '<img src="img/mario.jpg" height="100" width="100">';
	}
	else if( moveStatus==2){
		player2.position=value;
		document.getElementById(previous).innerHTML = " ";
		document.getElementById(randomPosition2).innerHTML = '<img src="img/angrybird.png" height="100" width="100">';
	}	

	for(i=0;i<randomWeaponObject.length;i++){		
		if(value==randomWeaponObject[i].position){
			if(moveStatus==1){								
				
				if(player1.hold==0){								
					player1.hold=1;
				}else if(player1.hold==1){
					var weaponElement={
			 			init:function(name,position,damage){
			 				this.name=name;
			 				this.position=position;
			 				this.damage=damage; 			}
			 		}
			 		weaponElement.init(player1.weaponName,previous,player1.force);
					document.getElementById(previous).innerHTML = renderImage(player1.weaponName);
					randomWeaponObject.push(weaponElement);
					console.log(randomWeaponObject);
					alert('p1 has already picked a weapon');					
				}			
				player1.weaponName=randomWeaponObject[i].name;
				player1.force=randomWeaponObject[i].damage;
				alert(player1.name +' has pick the weapon ' + player1.weaponName + ' and force is '+player1.force);
				randomWeaponObject.splice(i,1);
				console.log(randomWeaponObject);
			}
			else if(moveStatus==2){
				if(player2.hold==0){								
					player2.hold=1;
				}else if(player2.hold==1){
					var weaponElement={
			 			init:function(name,position,damage){
			 				this.name=name;
			 				this.position=position;
			 				this.damage=damage; 			}
			 		}
			 		weaponElement.init(player2.weaponName,previous,player2.force);
					document.getElementById(previous).innerHTML = renderImage(player2.weaponName);
					randomWeaponObject.push(weaponElement);
					console.log(randomWeaponObject);
					alert('p2 has already picked a weapon');					
				}			
				player2.weaponName=randomWeaponObject[i].name;
				player2.force=randomWeaponObject[i].damage;
				alert(player2.name +' has pick the weapon ' + player2.weaponName + ' and force is '+player2.force);
				randomWeaponObject.splice(i,1);
				console.log(randomWeaponObject);

			}
			}
	}
	
}

 function surroundingCell(position){
 	var array = [position-1,position+1,position-10,position+10];
 	return array;
 }
 function playersTouch(p1,p2){
 	surroundingP1=surroundingCell(p1);
	surroundingP2=surroundingCell(p2);
	if(surroundingP1.indexOf(randomPosition2)!=-1 || surroundingP2.indexOf(randomPosition1)!=-1){
		alert("ready to fight");
		console.log('Health of ' +player1.name +' is '+player1.health +' with the force of '+ player1.force);
		console.log('Health of ' +player2.name +' is '+player2.health +' with the force of '+ player2.force);
		if(moveStatus==1){			
			while(player2.health>0 && player1.health>0){
				var choose1 = prompt(player1.name + ' will attack ' + player2.name+'. '+ player2.name + ' can choose 0 to normal attack and 1 for defending.');
					if(choose1==0){ player1.attack(player2);}
					else if(choose1==1){player1.attackWithDefend(player2);}
				
				var choose2 = prompt(player2.name + ' will attack ' + player1.name+'. '+ player1.name + ' can choose 0 to normal attack and 1 for defending.');
					if(choose2==0){ player2.attack(player1);}
					else if(choose2==1){player2.attackWithDefend(player1);}
				
			}			
		} else if(moveStatus==2){
			while(player2.health>0 && player1.health>0){
				var choose2 = prompt(player2.name + ' will attack ' + player1.name+'. '+ player1.name + ' can choose 0 to normal attack and 1 for defending.');
					if(choose2==0){ player2.attack(player1);}
					else if(choose2==1){player2.attackWithDefend(player1);}
				
				var choose1 = prompt(player1.name + ' will attack ' + player2.name+'. '+ player2.name + ' can choose 0 to normal attack and 1 for defending.');
					if(choose1==0){ player1.attack(player2);}
					else if(choose1==1){player1.attackWithDefend(player2);}		
			}	
		}				
	}
	else{
		changeStatus();
	}
 }


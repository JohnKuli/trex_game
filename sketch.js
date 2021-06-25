var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var bird, birdMoving;
var bullet;

var score, highScore;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  birdMoving = loadAnimation("birdupimage.png","birddownimage.png");
  birdCollided = loadAnimation("birddownimage.png");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" ,trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  birdsGroup = createGroup();  
  bulletsGroup = createGroup();
  
  console.log("Hello" + 5);
  
  trex.setCollider("circle",0,0,40);
  trex.debug = true
  
  score = 0;
  highScore = 0;
}

function draw() {
  
  background(160,150,50);
  
  if(score>800) {
    background("black");
  }
  
  //displaying score
  text("Score: "+ score, 500,50);
  text("high score:"+ highScore, 400, 50)
  // console.log("this is ",gameState)
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    //move the ground
    ground.velocityX = -6-score/100;
    //scoring
    score = score + Math.round(getFrameRate()/60);
    if(score%100===0&&score>0) {
      checkPointSound.play();
    }
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    if (highScore<score) {
      highScore=score;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -12;
      jumpSound.play();
    }
    
    if(keyDown("w")) {
     bullets();
    }
      
    if(bulletsGroup.isTouching(birdsGroup)) {
       birdsGroup[0].destroy();
     }
      
   if(birdsGroup.isTouching(trex)) {
     gameState=END;
   }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //spawn the birds
    spawnBirds();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
      dieSound.play();
    }   
  }
   else if (gameState === END) { 
     // console.log("hey")s
      gameOver.visible = true;
      restart.visible = true;
     
      ground.velocityX = 0;
      trex.velocityY = 0;
      birdsGroup.setVelocityXEach(0);
      birdsGroup.setLifetimeEach(-1);
      //birdsGroup.changeAnimationEach("still");
     
      //change the trex animation
      trex.changeAnimation("collided", trex_collided);
     
     if(mousePressedOver(restart)) {
      reset();
     }
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -6-score/100;
   console.log(obstacle.velocityX);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function spawnBirds() {
  //write the code to spawn the birds
  if (frameCount%80 === 0&&score>50) {
    bird = createSprite(600,100,40,10);
    bird.y = Math.round(random(60,100));
    bird.addAnimation("birdflying", birdMoving);
    bird.scale = 0.05;
    bird.velocityX = -3;
    
     //assign lifetime to the variable
    bird.lifetime = 200;
    
    bird.addAnimation("still", birdCollided);
    
    birdsGroup.add(bird)
  }
}

function reset() {
   gameState=PLAY;
   obstaclesGroup.destroyEach();
   cloudsGroup.destroyEach();
   birdsGroup.destroyEach();
   score=0;
   trex.changeAnimation("running", trex_running);
}

function bullets() {
   bullet=createSprite(trex.x,trex.y,7,5);
   bullet.velocityX=3;
   bullet.lifetime=50;
   bulletsGroup.add(bullet);
}
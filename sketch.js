var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;
var feedthedog;
var feedtime
//create feed and lastFed variable here
var feed, LastFed;

function preload(){
sadDog=loadImage("Dog.png");
happyDog=loadImage("happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create feed the dog button here
  feedthedog = createButton("Feed the dog");
  feedthedog.position(700,95);
  feedthedog.mousePressed(feedDog);
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background("white");
  foodObj.display();

  //write code to read fedtime value from the database 
  feedtime = database.ref('feedtime');
  feedtime.on("value",function(data){
    LastFed = data.val();
  });
 
  //write code to display text lastFed time here
  if(LastFed>=12){
    text("LastFed : "+ LastFed%12 + " PM", 350,30);
   }else if(LastFed==0){
     text("LastFed : 12 AM",350,30);
   }else{
    text("LastFed : "+ LastFed + " AM", 350,30);
   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){
  dog.addImage(happyDog);

  //write code here to update food stock and last fed time
  var food_stock_val = foodObj.getFoodStock();
  if (food_stock_val <= 0){
    foodObj.updateFoodStock(food_stock_val*0)
  }else{
    foodObj.updateFoodStock(food_stock_val - 1);
  }
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })

}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

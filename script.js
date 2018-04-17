
//define global variables
var shape=new Object();
var treat=new Object();
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;    
var interval;
var lastKey = 0;
var monster1=new Object();
var monster2=new Object();
var monster3=new Object();
$(document).ready(function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");    
    //start the app
    start();    
} );

function start(){
    board = new Array();
    score = 0;
    pac_color="gold";
    var cnt = 100;
    var food_remain = 50;
    var pacman_remain = 1;
    start_time= new Date();
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2) TODO: more walls- function
        for (var j = 0; j < 10; j++) {
            if((i==3 && j==3)||(i==3 && j==4)||(i==3 && j==5)||(i==6 && j==1)||(i==6 && j==2))
            {
                board[i][j] = 4;
            }
            else if(i==0 && j==0)  //||(i==0 && j==9)||(i==9 && j==9)||(i==9 && j==0)  Todo: more monsters
            {
                monster1.i = i;
                monster1.j = j;
                board[i][j] = 3;
            }
            else if(i==0 && j==9){ // Treat
                board[i][j] = 5;
            }            
            else{
            var randomNum = Math.random();
            if (randomNum <= 1.0 * food_remain / cnt) {
                food_remain--;
                board[i][j] = 1;
            } else if (randomNum < 1.0 * (pacman_remain + food_remain) / cnt) {
                shape.i=i;
                shape.j=j;
                pacman_remain--;
                board[i][j] = 2;
            } else {
                board[i][j] = 0;
            }
            cnt--;
            }
        }        
    }

    while(food_remain>0){
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = 1;
        food_remain--;
    }
    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval=setInterval(UpdatePosition, 100);
    setInterval( UpdatePositionForMonster, 200);
    setInterval(UpdateTreat, 200);
}

/***create the board game***/

/** put walls in the board */

/***fill up the board***/
function findRandomEmptyCell(board){
    var i = Math.floor((Math.random() * 9) + 1);
    var j = Math.floor((Math.random() * 9) + 1);
    while(board[i][j]!=0)
    {
        i = Math.floor((Math.random() * 9) + 1);
        j = Math.floor((Math.random() * 9) + 1);
    }
    return [i,j];             
    }
/***return the key pressed */
function GetKeyPressed() {
    if (keysDown[38]) {
        lastKey = 1;
        return 1;
    }
    if (keysDown[40]) { 
        lastKey = 2;
        return 2;
    }
    if (keysDown[37]) { 
        lastKey = 3;
        return 3;
    }
    if (keysDown[39]) { 
        lastKey = 4;
        return 4;
    }
}
/***draw all the board */
function Draw() {
    canvas.width=canvas.width; //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if (board[i][j] == 2) {
                DrawPacman(center);
            } else if (board[i][j] == 1) {
                DrawBlackCircle(center);
            }
            else if (board[i][j] == 4) {
                DrawWalls(center);
            }
            else if(board[i][j] == 3){
                DrawMonster(center);
            }
            else if(board[i][j] == 5){
                DrawTreat(center);
            }
        }
    }  
}

/**draw Pacman */
function DrawPacman(center) {
    context.beginPath();
    if(lastKey==0) // default
    {
        context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI);
    }
    if(lastKey==1) //up
    {
        context.arc(center.x, center.y, 30, 1.65 * Math.PI, 1.35 * Math.PI);
    }
    if(lastKey==2) //down
    {
        context.arc(center.x, center.y, 30, 0.65 * Math.PI, 0.35 * Math.PI);
    }
    if(lastKey==3) //left
    {
        context.arc(center.x, center.y,30, 1.15 * Math.PI, 0.85 * Math.PI);
    }
    if(lastKey==4) //right
    {
        context.arc(center.x, center.y, 30, 0.15 * Math.PI, 1.85 * Math.PI);
        //context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI);
    }
    context.lineTo(center.x, center.y);
    context.fillStyle = pac_color; //color 
    context.fill();
    
    context.beginPath(); // eye circle
    if(lastKey==0) // default
    {
        context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI);                            
    }
    if(lastKey==1) //up
    {
        context.arc(center.x + 15, center.y - 10, 5, 0, 2 * Math.PI);                            
    }
    if(lastKey==2) //down
    {
        context.arc(center.x + 15, center.y + 10, 5, 0, 2 * Math.PI);                            
    }
    if(lastKey==3) //left
    {
        context.arc(center.x - 5, center.y - 15, 5, 0, 2 * Math.PI);                            
    }
    if(lastKey==4) //right
    {
        context.arc(center.x + 5, center.y - 15, 5, 0, 2 * Math.PI);                            
    }
    context.fillStyle = "black"; //color 
    context.fill();
}

/***draw regular snacks */
function DrawBlackCircle(center) {
    context.beginPath();
    context.arc(center.x, center.y, 15, 0, 2 * Math.PI); // circle
    context.fillStyle = "black"; //color 
    context.fill();
}

/***draw walls */
function DrawWalls(center) {
    context.beginPath();
    context.rect(center.x-30, center.y-30, 60, 60);
    context.fillStyle = "grey"; //color 
    context.fill();
}
/** draw monster */
function DrawMonster(center){
    context.beginPath();
    var img = new Image();
    img.onload = function () {
        context.drawImage(img, center.x-30, center.y-30 , 55 , 55);
    }
    img.src = "monster1.png";
}
/**Draw special treat */
function DrawTreat(center){
    context.beginPath();
    var img = new Image();
    img.onload = function () {
        context.drawImage(img, center.x-30, center.y-30 , 55 , 55);
    }
    img.src = "money.png";
}

/***updtate the position */
function UpdatePosition() {
    board[shape.i][shape.j]=0;
    var x = GetKeyPressed()
    if(x==1)
    {
        if(shape.j>0 && board[shape.i][shape.j-1]!=4 && board[shape.i][shape.j-1]!=3)
        {
            shape.j--;
        }
    }
    if(x==2)
    {
        if(shape.j<9 && board[shape.i][shape.j+1]!=4 && board[shape.i][shape.j+1]!=3)
        {
            shape.j++;
        }
    }
    if(x==3)
    {
        if(shape.i>0 && board[shape.i-1][shape.j]!=4 && board[shape.i-1][shape.j]!=3)
        {
            shape.i--;
        }
    }
    if(x==4)
    {
        if(shape.i<9 && board[shape.i+1][shape.j]!=4 && board[shape.i+1][shape.j]!=3)
        {
            shape.i++;
        }
    }
    if(board[shape.i][shape.j]==1)
    {
        score++;
    }
    board[shape.i][shape.j]=2;
    var currentTime=new Date();
    time_elapsed=(currentTime-start_time)/1000;
    if(score>=20&&time_elapsed<=10) //this is weird
    {
        pac_color="green";
    }
    if(score==50)
    {
        window.clearInterval(interval);
        window.alert("Game completed");
    }
    else
    {
        Draw();
    }
}
    function UpdatePositionForMonster() {
        var xDistance = (shape.i - monster1.i);
        var yDistance = (shape.j - monster1.j);
        board[monster1.i][monster1.j]=0;
        if(Math.abs(xDistance) >= Math.abs(yDistance)){
            if(xDistance < 0 && board[monster1.i-1][monster1.j]!=4){
                monster1.i--;
            }
            else if(xDistance > 0 && board[monster1.i+1][monster1.j]!=4){  //TODO: what if =0
                monster1.i++;
            }
            else if(board[monster1.i-1][monster1.j]==4 || board[monster1.i+1][monster1.j]==4){
                if(yDistance < 0 && board[monster1.i][monster1.j-1]!=4){
                    monster1.j--;
                }
                else if(xDistance > 0 && board[monster1.i][monster1.j+1]!=4){  //TODO: what if =0
                    monster1.j++;
                }
            }            
        }
        else {
            if(yDistance < 0 && board[monster1.i][monster1.j-1]!=4){
                monster1.j--;
            }
            else if(xDistance > 0 && board[monster1.i][monster1.j+1]!=4){  //TODO: what if =0
                monster1.j++;
            }
            else if(board[monster1.i][monster1.j-1]==4 || board[monster1.i][monster1.j+1]==4){
                if(xDistance < 0 && board[monster1.i-1][monster1.j]!=4){
                    monster1.i--;
                }
                else if(xDistance > 0 && board[monster1.i+1][monster1.j]!=4){  //TODO: what if =0
                    monster1.i++;
                }
            }
        }  
        board[monster1.i][monster1.j]=3;
    }

    function UpdateTreat(){
        var flag = false;
        board[treat.i][treat.j]=0;
        var rand = Math.random();
        if(rand<0.25 && board[treat.i-1][treat.j]!=4){
            treat.i--;
        }
        if(rand>=0.25 && rand<0.5 && board[treat.i+1][treat.j]!=4){
            treat.i++;
        }
        if(rand>=0.25 && rand<0.5 && board[treat.i+1][treat.j]!=4){
            treat.i++;
        }
    }



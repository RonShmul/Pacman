
/**define global variables*/
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
var noTreat = false;
var flagForMonster1 = 0;
var flagForMonster2 = 0;
var flagForMonster3 = 0;
var flagForTreat = 0;

/** jQuery- ready */
$(document).ready(function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");
    //start the app
    start();
} );

//initialize the cells in board
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
        for (var j = 0; j < 10; j++) {
            board[i][j] = 0;
        }
    }
    //placeSpecials();
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)  TODO: more walls- function
            if((i==3 && j==3)||(i==3 && j==4)||(i==3 && j==5)||(i==6 && j==1)||(i==6 && j==2))
            {
                board[i][j] = 4;
            }
            else if(i==0 && j==0){
                monster1.i = i;
                monster1.j = j;
            }
            else if(i==0 && j==9){
                monster2.i = i;
                monster2.j = j;
            }
            else if(i==9 && j==0){
                monster3.i = i;
                monster3.j = j;
            }
            else if(i==9 && j==9){
                treat.i = i;
                treat.j = j;
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
    setInterval( UpdatePositionForMonster1, 200);
    setInterval( UpdatePositionForMonster2, 200);
    setInterval( UpdatePositionForMonster3, 200);
    setInterval(UpdateTreat, 200);
}

function placeSpecials(){
    var randomPlace = Math.random();
    if(randomPlace<0.25){
        monster1.i = 0;
        monster1.j = 9;
        monster2.i = 9;
        monster2.j = 0;
        monster3.i = 9;
        monster3.j = 9;
        treat.i = 0;
        treat.j = 0;
        board[0][0] = 5;
        board[0][9] = 3;
        board[9][0] = 3;
        board[9][9] = 3;
    }
    else if(randomPlace<0.5){
        monster1.i = 0;
        monster1.j = 0;
        monster2.i = 9;
        monster2.j = 0;
        monster3.i = 9;
        monster3.j = 9;
        treat.i = 0;
        treat.j = 9;
        board[0][0] = 3;
        board[0][9] = 5;
        board[9][0] = 3;
        board[9][9] = 3;
    }
    else if(randomPlace<0.75){
        monster1.i = 0;
        monster1.j = 0;
        monster2.i = 0;
        monster2.j = 9;
        monster3.i = 9;
        monster3.j = 9;
        treat.i = 9;
        treat.j = 0;
        board[0][0] = 3;
        board[0][9] = 3;
        board[9][0] = 5;
        board[9][9] = 3;
    }
    else{
        monster1.i = 0;
        monster1.j = 0;
        monster2.i = 0;
        monster2.j = 9;
        monster3.i = 9;
        monster3.j = 0;
        treat.i = 9;
        treat.j = 9;
        board[0][0] = 3;
        board[0][9] = 3;
        board[9][0] = 3;
        board[9][9] = 5;
    }
}

/***fill up the board with snacks***/
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
                if(noTreat){
                    board[i][j] == 0;
                }
                else{
                    DrawTreat(center);
                }
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

/***update the position */
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
    if(board[shape.i][shape.j]==5)
    {
        board[shape.i][shape.j] = 0;
        score= score+50;
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
function UpdatePositionForMonster1() {
    board[monster1.i][monster1.j]=flagForMonster1;
    var moves;
    moves = Manhattan(monster1);
    monster1.i = moves[0];
    monster1.j = moves[1];
    if(board[monster1.i][monster1.j] == 1){
        flagForMonster1 = 1;
    }
    else{
        flagForMonster1 = 0;
    }
    board[monster1.i][monster1.j]=3;
}

function UpdatePositionForMonster2(){
    board[monster2.i][monster2.j]=flagForMonster2;
    var moves;
    moves = Manhattan(monster2);
    monster2.i = moves[0];
    monster2.j = moves[1];
    if(board[monster2.i][monster2.j] == 1){
        flagForMonster2 = 1;
    }
    else{
        flagForMonster2 = 0;
    }
    board[monster2.i][monster2.j]=3;
}

function UpdatePositionForMonster3(){
    board[monster3.i][monster3.j]=flagForMonster1;
    var moves;
    moves = Manhattan(monster3);
    monster3.i = moves[0];
    monster3.j = moves[1];
    if(board[monster3.i][monster3.j] == 1){
        flagForMonster3 = 1;
    }
    else{
        flagForMonster3 = 0;
    }
    board[monster3.i][monster3.j]=3;
}

function Manhattan(anyMonster){
    var distance = 10000;
    var temp;
    var move;

    if(anyMonster.i>0 && board[anyMonster.i-1][anyMonster.j] < 4 ){ //left
        distance = Math.abs(shape.i - (anyMonster.i-1)) + Math.abs(shape.j - anyMonster.j);
        move = [anyMonster.i-1, anyMonster.j];
    }
    if(anyMonster.i<9 && board[anyMonster.i+1][anyMonster.j] < 4 ){ //right
        temp = Math.abs(shape.i - (anyMonster.i+1)) + Math.abs(shape.j - anyMonster.j);
        if(temp<distance){
            distance = temp;
            move = [anyMonster.i+1, anyMonster.j];
        }
    }
    if(anyMonster.j>0 && board[anyMonster.i][anyMonster.j-1] < 4 ){ //up
        temp = Math.abs(shape.i - anyMonster.i) + Math.abs(shape.j - (anyMonster.j-1));
        if(temp<distance){
            distance = temp;
            move = [anyMonster.i, anyMonster.j-1];
        }
    }
    if(anyMonster.j<9 && board[anyMonster.i][anyMonster.j+1] < 4 ){ //down
        temp = Math.abs(shape.i - anyMonster.i) + Math.abs(shape.j - (anyMonster.j+1));
        if(temp<distance){
            move = [anyMonster.i, anyMonster.j+1];
        }
    }
    return(move);
}

function UpdateTreat(){
    var flag = true;
    board[treat.i][treat.j]=flagForTreat;
    while(flag){
        var rand = Math.random();
        if(treat.i>0 && rand<0.25 && board[treat.i-1][treat.j]!=4 && board[treat.i-1][treat.j]!=2){
            treat.i--;
            flag = false;
        }
        if(treat.i<9 && rand>=0.25 && rand<0.5 && board[treat.i+1][treat.j]!=4 && board[treat.i+1][treat.j]!=2){
            treat.i++;
            flag = false;
        }
        if(treat.j>0 && rand>=0.5 && rand<0.75 && board[treat.i][treat.j-1]!=4 && board[treat.i][treat.j-1]!=2){
            treat.j--;
            flag = false;
        }
        if(treat.j<9 && rand>=0.75 && board[treat.i][treat.j+1]!=4 && board[treat.i][treat.j+1]!=2){
            treat.j++;
            flag = false;
        }
    }
    if(board[treat.i][treat.j] == 1){
        flagForTreat = 1;
    }
    else{
        flagForTreat = 0;
    }
    board[treat.i][treat.j]=5;
    if(board[treat.i][treat.j]== board[shape.i][shape.j]){
        noTreat = true;
    }
}



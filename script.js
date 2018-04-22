
/**define global variables*/
var pacman;
var treat;
var board;
var pointsBoard;
var score;
var pac_color;
var start_time;
var life;
var time_elapsed;
var interval;
var intervalMon1;
var intervalMon2;
var intervalMon3;
var intervalTreat;
var intervalAid;
var intervalClock;
var intervalForDrawing;
var lastKey = 0;
var monster1;
var monster2;
var monster3;
var flagForTreat;
var numOfMonsters;
var numOfPoints;
var time;

/** jQuery- ready */
$(document).ready(function() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext("2d");
    monster1=new Object();
    monster2=new Object();
    monster3=new Object();
    pacman=new Object();
    treat=new Object();
} );

/**initialize the cells in board*/
function start(){
    board = new Array();
    pointsBoard = new Array();
    score = 0;
    pac_color="gold";
    start_time= new Date();
    life = 3;
    flagForTreat = false;
    numOfMonsters = monsterInput.value;
    numOfPoints = pointInput.value;
    time = parseInt(timeInput.value);
    //initial life if needed
    restoreLife();
    //initial the board with zeros
    for (var i = 0; i < 10; i++) {
        board[i] = new Array();
        pointsBoard[i] = new Array();
        for (var j = 0; j < 10; j++) {
            board[i][j] = 0;
            pointsBoard[i][j] = 0;
        }
    }
    putWalls();
    //initial monsters and treat
    placeSpecials();
    //initial pac-man and snacks
    var pacPlace = findRandomEmptyCell(board);
    board[pacPlace[0]][pacPlace[1]]  = 2;
    pacman.i=pacPlace[0];
    pacman.j=pacPlace[1];
    placeSnacks();

    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.keyCode] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.keyCode] = false;
    }, false);
    interval=setInterval(UpdatePosition, 100);

    intervalMon1 = setInterval( UpdatePositionForMonster1, 300);
    if(numOfMonsters >= 2){
        intervalMon2 = setInterval( UpdatePositionForMonster2, 400);
    }
    if(numOfMonsters == 3){
        intervalMon3 = setInterval( UpdatePositionForMonster3, 400);
    }
    intervalTreat = setInterval(UpdateTreat, 300);
    intervalAid = setInterval(setLifeAdder, 450);
    intervalClock = setInterval(setTimeAdder, 450);
    //intervalForDrawing = setInterval(Draw, 5);
}

function setDrawing(){
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            var center = new Object();
            center.x = i * 60 + 30;
            center.y = j * 60 + 30;
            if(board[i][j] == 3){
                if(monster1.i == i && monster1.j == j){
                    DrawMonster(center, "monster1.svg");
                }
                if(monster2.i == i && monster2.j == j){
                    DrawMonster(center, "monster2.svg");
                }
                if(monster3.i == i && monster3.j == j){
                    DrawMonster(center, "monster3.svg");
                }
            }
        }
    }
}
function putWalls(){
    board[1][2] = 4;
    pointsBoard[1][2] = 4;
    board[4][4] = 4;
    pointsBoard[4][4] = 4;
    board[5][4] = 4;
    pointsBoard[5][4] = 4;
    board[7][8] = 4;
    pointsBoard[7][8] = 4;
    board[8][8] = 4;
    pointsBoard[8][8] = 4;
}

function placeSpecials(){
    monster1.i = 0;
    monster1.j = 0;
    if(!flagForTreat){
        treat.i = 9;
        treat.j = 9;
        board[9][9] = 5;
    }
    board[0][0] = 3;
    if(numOfMonsters >= 2){
        monster2.i = 0;
        monster2.j = 9;
        board[0][9] = 3;
        if(numOfMonsters == 3){
            monster3.i = 9;
            monster3.j = 0;
            board[9][0] = 3;
        }
    }
}

function placeSnacks() {
    var sPoints = parseInt(numOfPoints*0.6);
    var mPoints = parseInt(numOfPoints*0.3);
    var lPoints = numOfPoints - mPoints - sPoints;
    var emptyCell;
    while(sPoints > 0) {
        emptyCell = findRandomEmptyCell(pointsBoard);
        if(board[emptyCell[0]][emptyCell[1]] == 0){
            pointsBoard[emptyCell[0]][emptyCell[1]] = 1;
            sPoints--;
        }
    }
    while(mPoints > 0) {
        emptyCell = findRandomEmptyCell(pointsBoard);
        if(board[emptyCell[0]][emptyCell[1]] == 0) {
            pointsBoard[emptyCell[0]][emptyCell[1]] = 6;
            mPoints--;
        }
    }
    while(lPoints > 0) {
        emptyCell = findRandomEmptyCell(pointsBoard);
        if(board[emptyCell[0]][emptyCell[1]] == 0) {
            pointsBoard[emptyCell[0]][emptyCell[1]] = 7;
            lPoints--;
        }
    }
}

/**start the app*/
function startGame() {
    themeSong = document.getElementById("theme");
    themeSong.play();
    toggle('canvas-div');
    start();
    return false;
}
/***fill up the board with snacks***/
function findRandomEmptyCell(someBoard){
    var i = Math.floor(Math.random() * 10);
    var j = Math.floor(Math.random() * 10);
    while(someBoard[i][j]!=0)
    {
        i = Math.floor(Math.random() * 10);
        j = Math.floor(Math.random() * 10);
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
            }
            else if (board[i][j] == 4) {
                DrawWalls(center);
            }
            else if(board[i][j] == 3){
                if(monster1.i == i && monster1.j == j){
                    DrawMonster(center, "monster1.svg");
                }
                if(monster2.i == i && monster2.j == j){
                    DrawMonster(center, "monster2.svg");
                }
                if(monster3.i == i && monster3.j == j){
                    DrawMonster(center, "monster3.svg");
                }
            }
            else if(board[i][j] == 5){
                DrawTreat(center);
            }
            else if (pointsBoard[i][j] == 1) {
                var fill = "white";
                var size = 9;
                DrawSnacks(center, fill, size);
            }
            else if (pointsBoard[i][j] == 6) {
                var fill = "GreenYellow";
                var size = 14;
                DrawSnacks(center, fill, size);
            }
            else if (pointsBoard[i][j] == 7) {
                var fill = "RosyBrown";
                var size = 18;
                DrawSnacks(center, fill, size);
            }
            else if (pointsBoard[i][j] == 8) {
                DrawAid(center);
            }
            else if (pointsBoard[i][j] == 9) {
                DrawClock(center);
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
function DrawSnacks(center, fill, size) {
    context.beginPath();
    context.arc(center.x, center.y, size, 0, 2 * Math.PI); // circle
    context.fillStyle = fill; //color
    context.fill();
}

/***draw walls */
function DrawWalls(center) {
    context.beginPath();
    context.rect(center.x-30, center.y-30, 60, 60);
    context.fillStyle = "#2691a5"; //color
    context.fill();
}

/** draw monster */
function DrawMonster(center , pic){
    context.beginPath();
    var img = new Image();
    img.src = pic;
    img.onload = function () {
        context.drawImage(img, center.x-30, center.y-30 , 55 , 55);
    }
    img.src = pic;
}

/**Draw special treat */
function DrawTreat(center){
    context.beginPath();
    var img = new Image();
    img.src = "candy.png";
    img.onload = function () {
        context.drawImage(img, center.x-30, center.y-30 , 35 , 60);
    }
    img.src = "candy.png";
}

function DrawAid(center) {
    context.beginPath();
    var img = new Image();
    img.src = "aid.svg";
    img.onload = function () {
        context.drawImage(img, center.x-30, center.y-30 , 55 , 55);
    }
    img.src = "aid.svg";
}
function DrawClock(center) {
    context.beginPath();
    var img = new Image();
    img.src = "clock.svg";
    img.onload = function () {
        context.drawImage(img, center.x-30, center.y-30 , 55 , 55);
    }
    img.src = "clock.svg";
}

/***update the position */
function UpdatePosition() {
    board[pacman.i][pacman.j]=0;
    pointsBoard[pacman.i][pacman.j]=0;
    var x = GetKeyPressed()
    if(x==1)
    {
        if(pacman.j>0 && (board[pacman.i][pacman.j-1]!=4 && board[pacman.i][pacman.j-1]!=3))
        {
            pacman.j--;
        }
    }
    if(x==2)
    {
        if(pacman.j<9 && (board[pacman.i][pacman.j+1]!=4 && board[pacman.i][pacman.j+1]!=3))
        {
            pacman.j++;
        }
    }
    if(x==3)
    {
        if(pacman.i>0 && (board[pacman.i-1][pacman.j]!=4 && board[pacman.i-1][pacman.j]!=3))
        {
            pacman.i--;
        }
    }
    if(x==4)
    {
        if(pacman.i<9 && (board[pacman.i+1][pacman.j]!=4 && board[pacman.i+1][pacman.j]!=3))
        {
            pacman.i++;
        }
    }
    if(pointsBoard[pacman.i][pacman.j]==1)
    {
        score=score+5;
    }
    if(pointsBoard[pacman.i][pacman.j]==6)
    {
        score=score+15;
    }
    if(pointsBoard[pacman.i][pacman.j]==7)
    {
        score=score+25;
    }
    if(board[pacman.i][pacman.j]==5)
    {
        window.clearInterval(intervalTreat);
        flagForTreat  = true;
        score= score+50;
    }
    if(pointsBoard[pacman.i][pacman.j]==8) {
        addLife();
    }
    if(pointsBoard[pacman.i][pacman.j]==9) {
        time = time + 10;
    }
    board[pacman.i][pacman.j]=2;
    var currentTime=new Date();
    time_elapsed = parseInt(time - ((currentTime-start_time)/1000));
    if(time_elapsed <= 0) {
        gameOver();
    }
    else
    {
        Draw();
    }
}
var count = 0;
function UpdatePositionForMonster1() {
    board[monster1.i][monster1.j] = 0;
    var moves;
    moves = Manhattan(monster1);
    monster1.i = moves[0];
    monster1.j = moves[1];
    if(board[monster1.i][monster1.j] == 2){
        life--;
        reduceLife();
        if(life>0){
            restartBoard();
        }
        else{
            gameOver();
        }
    }
    else{
        board[monster1.i][monster1.j]=3;
    }
}

function UpdatePositionForMonster2(){
    board[monster2.i][monster2.j]=0;
    shortestPath();
    // monster2.i = moves[0];
    // monster2.j = moves[1];
    if(board[monster2.i][monster2.j] == 2){
        life--;
        reduceLife();
        if(life>0){
            restartBoard();
        }
        else{
            gameOver();
        }
    }
    else{
    board[monster2.i][monster2.j]=3;
    }
}

function UpdatePositionForMonster3(){
    board[monster3.i][monster3.j]= 0;
    var moves;
    moves = Manhattan(monster3);
    monster3.i = moves[0];
    monster3.j = moves[1];
    if(board[monster3.i][monster3.j] == 2){
        life--;
        reduceLife();
        if(life>0){
            restartBoard();
        }
        else{
            gameOver();
        }
    }
    else{
    board[monster3.i][monster3.j]=3;
    }
}

function Manhattan(anyMonster){
    var distance = 10000;
    var temp;
    var move;

    if(anyMonster.i>0 && board[anyMonster.i-1][anyMonster.j] != 4 ){ //left
        distance = Math.abs(pacman.i - (anyMonster.i-1)) + Math.abs(pacman.j - anyMonster.j);
        move = [anyMonster.i-1, anyMonster.j];
    }
    if(anyMonster.i<9 && board[anyMonster.i+1][anyMonster.j] != 4 ){ //right
        temp = Math.abs(pacman.i - (anyMonster.i+1)) + Math.abs(pacman.j - anyMonster.j);
        if(temp<distance){
            distance = temp;
            move = [anyMonster.i+1, anyMonster.j];
        }
    }
    if(anyMonster.j>0 && board[anyMonster.i][anyMonster.j-1] != 4 ){ //up
        temp = Math.abs(pacman.i - anyMonster.i) + Math.abs(pacman.j - (anyMonster.j-1));
        if(temp<distance){
            distance = temp;
            move = [anyMonster.i, anyMonster.j-1];
        }
    }
    if(anyMonster.j<9 && board[anyMonster.i][anyMonster.j+1] != 4 ){ //down
        temp = Math.abs(pacman.i - anyMonster.i) + Math.abs(pacman.j - (anyMonster.j+1));
        if(temp<distance){
            move = [anyMonster.i, anyMonster.j+1];
        }
    }
    return(move);
}

function shortestPath(){
    var xDistance = Math.abs(pacman.i - monster2.i);
    var yDistance = Math.abs(pacman.j - monster2.j);
    if(xDistance < yDistance){
        if(xDistance ==0){
            goToY();
        }
        else{
            goToX();
        }
    }
    else if(xDistance > yDistance){
        if(yDistance ==0){
            goToX();
        }
        else {
            goToY();
        }
    }
    else{
        var helper= Math.random();
        if(helper >= 0.5){
            goToX();
        }
        else{
            goToY();
        }
    }
}

function goToY(){
    if(monster2.j<9 && pacman.j > monster2.j && board[monster2.i][monster2.j+1] != 4){
        monster2.j++;
    }
    else if(monster2.j>0 && pacman.j < monster2.j && board[monster2.i][monster2.j-1] != 4){
        monster2.j--;
    }
    else{
        if(monster2.i<9 && board[monster2.i+1][monster2.j] != 4){
            monster2.i++;
        }
        else if(monster2.i>0 && board[monster2.i-1][monster2.j] != 4){
            monster2.i--;
        }
    }
}

function goToX() {
    if(monster2.i<9 && pacman.i > monster2.i && board[monster2.i+1][monster2.j] != 4){
        monster2.i++;
    }
    else if(monster2.i>0 && pacman.i < monster2.i && board[monster2.i-1][monster2.j] != 4){
        monster2.i--;
    }
    else{
        if(monster2.j<9 && board[monster2.i][monster2.j+1] != 4){
            monster2.j++;
        }
        else if(monster2.j>0 && board[monster2.i][monster2.j-1] != 4){
            monster2.j--;
        }
    }
}


function UpdateTreat(){
    var flag = true;
    board[treat.i][treat.j] = 0;
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
    board[treat.i][treat.j]=5;
}

function restartBoard(){
    board[monster1.i][monster1.j] = 0;
    if(numOfMonsters>=2)
        board[monster2.i][monster2.j] = 0;
    if(numOfMonsters==3)
        board[monster3.i][monster3.j] = 0;
    board[treat.i][treat.j] = 0;
    placeSpecials();
    board[pacman.i][pacman.j] = 0;
    var newPac = findRandomEmptyCell(board);
    pacman.i = newPac[0];
    pacman.j = newPac[1];
    if(pointsBoard[pacman.i][pacman.j] == 1){
        score= score +5;
    }
    if(pointsBoard[pacman.i][pacman.j] == 6){
        score= score +15;
    }
    if(pointsBoard[pacman.i][pacman.j] == 7){
        score= score +25;
    }
    board[pacman.i][pacman.j] = 2;
}

function gameOver() {
    themeSong.pause();
    themeSong.currentTime = 0;

    var gameOverSong = document.getElementById("gameOverSound");
    var gameOverTxt = document.getElementById("gameOverText");
    if(life == 0){
        gameOverTxt.innerHTML = "You lost!";
    }
    else if(score < 150){
        gameOverTxt.innerHTML = "You can do better...";
    }
    else{
        gameOverTxt.innerHTML = "We have a winner!";
    }
    gameOverTxt.style.display = 'block';
    gameOverSong.currentTime = 0;
    gameOverSong.play();
    setTimeout(function() {
        gameOverTxt.style.display = 'none';
        toggle('enter-game');
    }, 3000);
    window.clearInterval(interval);
    window.clearInterval(intervalMon1);
    window.clearInterval(intervalMon2);
    window.clearInterval(intervalMon3);
    window.clearInterval(intervalTreat);
    window.clearInterval(intervalClock);
    window.clearInterval(intervalAid);
}

function reduceLife() {
    var hearts = document.getElementsByClassName("heart");
    for(var i = hearts.length-1; i>= 0; i--) {
        if(hearts[i].style.display != 'none') {
            hearts[i].style.display = 'none';
            break;
        }
    }
}
function restoreLife() {
    var hearts = document.getElementsByClassName("heart");
    for(var i = hearts.length-1; i>= 0; i--) {
        if(hearts[i].style.display == 'none') {
            hearts[i].style.display = 'inline-block';
        }
        if(i >= 3) {
            $("#life img:last-child").remove();
        }
    }
}
function addLife() {
    $('#life').append('<img class="heart" src="heart.png" alt="heart">');
    life++;
}

function setLifeAdder() {
    if((time_elapsed <= time * 0.8) && isEmpty()) {
        var cell = findRandomEmptyCell(pointsBoard);
        pointsBoard[cell[0]][cell[1]] = 8;
        window.clearInterval(intervalAid);
    }
}

function setTimeAdder() {

    if((time_elapsed <= time * 0.5) && isEmpty()) {
        var cell = findRandomEmptyCell(pointsBoard);
        pointsBoard[cell[0]][cell[1]] = 9;
        window.clearInterval(intervalClock);
    }
}

function isEmpty() {
    var isAvailable = false;
    for(var i = 0; i < 10; i++) {
        for(var j = 0; j < 10; j++) {
            if(pointsBoard[i][j] == 0) {
                isAvailable = true;
                break
            }
        }
    }
    return isAvailable;
}

function stopGame() {
    document.getElementById("login-form").reset();
    document.getElementById("register-form").reset();
    restartBoard();
    themeSong.pause();
    themeSong.currentTime = 0;
    window.clearInterval(interval);
    window.clearInterval(intervalMon1);
    window.clearInterval(intervalMon2);
    window.clearInterval(intervalMon3);
    window.clearInterval(intervalTreat);
    window.clearInterval(intervalAid);
    window.clearInterval(intervalClock);

}
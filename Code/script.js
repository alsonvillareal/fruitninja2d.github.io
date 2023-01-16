const playButton = document.getElementById('startGameBtn');
const startGameContainer = document.getElementById('startGame');
const inGameContainer = document.getElementById('inGameContainer');

let isSwordSoundPlaying = false;
//Sound Effect - Sword
const playSwordSound = ()=>{
    let swordAudio = new Audio(`../Assets/Audio/sword-unsheathing.mp3`);
    swordAudio.play();
    isSwordSoundPlaying = true;
    swordAudio.addEventListener('ended',()=>{
        isSwordSoundPlaying = false;
    })

}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        isGamePause = false;
    } else {
        isGamePause = true;
    }

})

//Play Button
playButton.addEventListener('click', () => {
    startGameContainer.style.display = 'none';
    inGameContainer.style.display = 'flex';
    alertTimer();
    //Set Score to  0 
    score = 0;
    updateScore(0);
    isGameStarted = true;
    isGameEnd = false;

    setTimeout(() => {
        animate();
        startRenderingFruitsInterval();
        startGameTimer();
    }, 4000)
})

//Count Down Function
const alertTimer = () => {
    const countDownContainer = document.getElementById('countDownContainer');
    let currentSecond = 3;
    let timerInterval = setInterval(() => {
        countDownContainer.innerHTML = ``;
        countDownContainer.innerHTML = `<h1>${currentSecond}</h1>`;
        currentSecond -= 1;
        if (currentSecond < 0) {
            clearInterval(timerInterval);
            countDownContainer.innerHTML = ``;
            isGamePause = false;
            return
        }
    }, 1000)
}

//Game timer function 
const startGameTimer = () => {
    if (!isGameStarted) {
        return
    }
    //Number of Minutes the game should run.
    let minutesInGame = 1;
    let totalTime = minutesInGame * 60;

    //Interval to update the timer
    let interval = setInterval(() => {

        let min = Math.floor(totalTime / 60);
        let sec = totalTime % 60;

        document.getElementById('gameMinuteAndSecond').innerHTML = `${min < 10 ? '0' + min : min} : ${sec < 10 ? '0' + sec : sec}`

        totalTime--;
        //When the time is over
        if (totalTime < 0) {
            clearInterval(interval);
            document.getElementById('gameMinuteAndSecond').innerHTML = `00 : 00`;
            endGameContainer.style.display = 'flex';
            document.getElementById('endGameScore').innerHTML = score;
            isGameEnd = true;
            isGameStarted = false;
            //Clearing the canvas
            fruitArray = [];
            fruitParticlesArray = [];
        }
    }, 1000)
}

let score = 0;

//Function to update score
const updateScore = (noOfScore) => {
    //If noOfScore is in negative
    if (noOfScore + score < 0) {
        score = 0;
        return
    }
    score = score + noOfScore;
    document.getElementById('score').innerHTML = score;
}

updateScore(0);

//Main Logic for canvas

const canvas = document.getElementById('canvas');

const context = canvas.getContext('2d');

//Set canvas to full Screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//All Elements array
let fruitArray = [];
let fruitParticlesArray = [];
//Fruit Class
function Fruit() {

    this.x = Math.floor(Math.random() * window.innerWidth);
    this.y = Math.floor(window.innerHeight);
    this.size = Math.floor((Math.random() * 10) + 35);
    this.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;

    this.speedY = 10;
    this.speedX = Math.round((Math.random() - 0.5) * 4);

    this.img = new Image();
    this.randomFruit = Math.floor(Math.random() * 5) + 1
    switch (this.randomFruit) {
        case 1 : this.img.src = '../Assets/Images/game_fruit_red.png'; this.fruitColor = "red"; this.fruitScore = 25; break;
        case 2 : this.img.src = '../Assets/Images/game_fruit_orange.png'; this.fruitColor = "orange"; this.fruitScore = 20; break; 
        case 3 : this.img.src = '../Assets/Images/game_fruit_yellow.png'; this.fruitColor = "yellow"; this.fruitScore = 10; break; 
        case 4 : this.img.src = '../Assets/Images/game_fruit_green.png'; this.fruitColor = "green"; this.fruitScore = 5; break;
        case 5 : this.img.src = '../Assets/Images/game_fruit_blue.png'; this.fruitColor = "blue"; this.fruitScore = 30; break;
        case 6 : this.img.src = '../Assets/Images/game_fruit_purple.png'; this.fruitColor = "purple"; this.fruitScore = 15; break;
    }

    //Updating Fruit Position
    this.update = () => {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.speedY -= .1;
    }

    //Rendering or Drawing Fruit on the canvas
    this.draw = () => {
        this.size = 60;
        context.drawImage(this.img, this.x-(this.size), this.y-(this.size));
    }
}

function renderFruits() {
    for (let i = 0; i < fruitArray.length; i++) {
        fruitArray[i].draw();
        fruitArray[i].update();

        //Detection Collision of Mouse Position and Fruit Position
        let distanceBetweenMouseAndFruit = Math.hypot(mouseX - fruitArray[i].x, mouseY - fruitArray[i].y)

        //If Mouse is on the fruit i.e Collision
        if (distanceBetweenMouseAndFruit - fruitArray[i].size < 1) {

            //Rendering Fruit Particles
            fruitParticlesArray.push(new FruitParticles(fruitArray[i].x, fruitArray[i].y, fruitArray[i].fruitColor, "l"));
            fruitParticlesArray.push(new FruitParticles(fruitArray[i].x, fruitArray[i].y, fruitArray[i].fruitColor, "r"));

            let timeNow = new Date().getTime()
            let scoreToUpdate = fruitArray[i].fruitScore;
            updateScore(scoreToUpdate)

            //Splicing the fruit from the array
            fruitArray.splice(i, 1);
            i--;
            return
        }

        //Splice the fruit if it reached the bottom of the screen
        if (fruitArray[i].y > window.innerHeight + 10) {
            fruitArray.splice(i, 1);
            i--;
        }
    }
}

//Fruit Particles Class
function FruitParticles(x, y, fruitColor, side) {

    this.x = x;
    this.y = y;
    this.size = Math.floor(Math.random() * 3 + 8);

    this.speedY = Math.round((Math.random() - 0.5) * 10);
    this.speedX = Math.round((Math.random() - 0.5) * 10);

    this.img = new Image();
    this.img.src = `../Assets/Images/game_fruit_${fruitColor}_${side}.png`

    //Updating Fruit Particle
    this.update = () => {    
        this.y += this.speedY;
        this.x += this.speedX;
    }

    //Rendering or Drawing Fruit on the canvas
    this.draw = () => {
        context.drawImage(this.img, this.x, this.y);
    }
}

function renderFruitParticles() {
    for (let i = 0; i < fruitParticlesArray.length; i++) {
        fruitParticlesArray[i].draw();
        fruitParticlesArray[i].update();

        //If fruit particles size is too small splice from the array
        if (fruitParticlesArray[i].size <= .2) {
            fruitParticlesArray.splice(i, 1);
            i--;
        }
    }
}

let numberOfFruitsToRender = [1, 2, 3, 4, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1, 2, 3, 4, 1];

//SetInterval to render the fruits on an interval of 1 second
const startRenderingFruitsInterval = () => {
    let interval = setInterval(() => {
        //Clear the interval if the game is end.
        if (isGameEnd) {
            clearInterval(interval)
            return;
        }
        //Return if the game is pause
        if (isGamePause) {
            return
        }
        const numberOfFruits = Math.round(Math.random() * numberOfFruitsToRender.length);
        let indexOf = numberOfFruitsToRender[numberOfFruits];

        //Number of fruits to be rendered on the canvas using for loop
        for (let i = 0; i < indexOf; i++) {
            fruitArray.push(new Fruit())
        }

    }, 2000)
}

//Game Status Variables
let isGameStarted = false;
let isGamePause = false;
let isGameEnd = false;

function renderMouseLines() {
    for (let i = 0; i < linesArray.length; i++) {
        context.strokeStyle = 'white';
        context.beginPath();

        context.moveTo(linesArray[i].x, linesArray[i].y);
        context.lineTo(linesArray[i].pMouseX, linesArray[i].pMouseY);
        context.stroke();
        context.lineWidth= 4;
        context.closePath();
    }
    //If the length of this array is greater then 4 splice the first object of this array using shift();
    if (linesArray.length > 4) {
        if (!isSwordSoundPlaying) {
            playSwordSound();
        }
        linesArray.shift();
        linesArray.shift();
    }
}

let animationId;

//Animate function to render every....
function animate() {
    context.img = new Image();
    context.img.src = '../Assets/Images/game_bg.jpg';
    context.drawImage(context.img, 0, 0);
    context.drawImage(context.img, 500, 0);
    context.drawImage(context.img, 1000, 0);

    renderFruits();
    renderFruitParticles();
    renderMouseLines();
    //Cancel animation when the game is end.
    if (isGameEnd) {
        cancelAnimationFrame(animationId);
        return
    }
    animationId = requestAnimationFrame(animate);
}

let mouseX = 0;
let mouseY = 0;
let prevMouseX = 0;
let prevMouseY = 0;
let isMouseClicked = false;

let linesArray = [];

//Event listener to detect when left button of mouse is clicked
canvas.addEventListener('mousedown', (e) => {
    prevMouseX = mouseX;
    prevMouseY = mouseY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMouseClicked = true;
})

//When mouse is moving
canvas.addEventListener('mousemove', (e) => {
    if (isMouseClicked) {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;
        linesArray.push({x: mouseX,y:mouseY,pMouseX: prevMouseX,pMouseY: prevMouseY})
    }
})

//When the mouse button is released
canvas.addEventListener('mouseup', () => {
    mouseX = 0;
    mouseY = 0;
    linesArray = [];
    isMouseClicked = false;
})
//When the mouse is out of the tab or window
canvas.addEventListener('mouseout', () => {
    mouseX = 0;
    linesArray = [];
    mouseY = 0;
    isMouseClicked = false;
})

//Function and imports to return home when game is end.
const returnHomeButton = document.getElementById('returnHome');
const endGameContainer = document.getElementById('gameEndDiv');

returnHomeButton.addEventListener('click',()=>{
    if (!isGameEnd) {
        return
    }
    endGameContainer.style.display = 'none';
    startGameContainer.style.display = 'flex';
    inGameContainer.style.display = 'none';
})
//Board Size
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//Bird
let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

// physics 
let velocityX = -2; 
let velocityY = 0;
let gravity = 0.2;

let gameOver = false;
let score = 0;

let gameStatus = document.getElementById('gameStatus');



window.onload =  function() {
    board = document.getElementById('board')
    board.height = boardHeight
    board.width = boardWidth
    context = board.getContext('2d')

//ilustrasi bird
    // context.fillStyle = 'green';
    // context.fillRect(
    //     bird.x,
    //     bird.y,
    //     bird.width,
    //     bird.height,
    // )

// bird with image
    birdImg = new Image()
    birdImg.src = './assets/flappybird.png';
    birdImg.onload = function() {
        context.drawImage(birdImg,
            bird.x,
            bird.y,
            bird.width,
            bird.height
        )
    }

    // topPipeLine Image
    topPipeImg = new Image()
    topPipeImg.src = './assets/toppipe.png';

    // botPipeLine IMage
    botPipeImg = new Image()
    botPipeImg.src = './assets/bottompipe.png';

    requestAnimationFrame(update);
    setInterval(placePipes, 1000);
    document.addEventListener("keydown", moveBird);
    
    function update() {
        requestAnimationFrame(update);
        if(gameOver) {
            return;
        }
        context.clearRect(0, 0, board.width, board.height)

        velocityY += gravity;
        // bird.y += velocityY;
        bird.y = Math.max(bird.y + velocityY, 0);
        // bird
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height)

        if (bird.y > board.height) {
            gameOver = true;
        }

        // pipes
        for (let i = 0; i < pipeArray.length; i++) {
            let pipe = pipeArray[i];
            pipe.x += velocityX;
            context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

            if(!pipe.passed && bird.x > pipe.x + pipe.width) {
                score += 0.5;
                pipe.passed = true;
            }

            if(detectColation(bird, pipe)) {
                gameOver = true;
            }
        }

        while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
            pipeArray.shift();
        }

        context.fillStyle = 'white';
        context.font = '30px Arial';
        context.fillText(score, 10, 30);

        if(gameOver) {
            context.fillText('Game Over', 5, 90)
        }


    } 

    function placePipes() {

        if(gameOver) {
            return;
        }

        let randomPipeY = pipeY - pipeHeight/4 - Math.random() * (pipeHeight/2);
        let openingSpace = board.height/4;

        let topPipe = {
            img : topPipeImg,
            x : pipeX,
            y : randomPipeY,
            width : pipeWidth,
            height : pipeHeight,
            passed : false
        }

        pipeArray.push(topPipe)

        let botPipe = {
            img : botPipeImg,
            x : pipeX,
            y : randomPipeY + pipeHeight + openingSpace,
            width : pipeWidth,
            height : pipeHeight,
            passed : false
        }
        pipeArray.push(botPipe)
    }    

    function moveBird(e) {
        if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {

            velocityY = -5 ;

            if(gameOver) {
                bird.y = birdY
                pipeArray = []
                score = 0;
                gameOver = false;
            }
        }
    }

    function detectColation(a, b) {
        return a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y;
    }



}
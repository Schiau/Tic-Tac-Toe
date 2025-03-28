const MAX_WINING_ROUNDS = 3;

const gameSpotTags = Array.from(document.getElementsByClassName("game-spot"));
const scoreTag = document.getElementById("score");

const btnPlayerNamesTag = document.getElementById('btn-submite-player-names');
const player1InputNameTag = document.getElementById('player1');
const player2InputNameTag = document.getElementById('player2');

const startDialogTag = document.getElementById('dialogInputNames');
const player1NameTag = document.getElementById('player1-name');
const player2NameTag = document.getElementById('player2-name');

const dialogWinnerTag = document.getElementById('game-over-dialog');
const winnerTag = document.getElementById('winner');
const closeBtn = document.getElementById('close-btn');

const higlightWinnerCell = (elem) =>{
    elem.classList.add("highlight");
}

const gameBoard = (function() {
    let gameSate = [...Array(9)];

    const resetGame = () => {
        gameSate = [...Array(9)];
        gameSpotTags.forEach((element) => {
            element.textContent = '';
            element.classList.remove('highlight');
        });
    }

    const isFinished = () =>{
        for(let i = 0; i < 9; i+=3){ 
            if (gameSate[i] === gameSate[i+1] && gameSate[i+1] === gameSate[i+2] && gameSate[i] !== undefined){
                gameSpotTags[i].classList.add('highlight');
                gameSpotTags[i+1].classList.add('highlight');
                gameSpotTags[i+2].classList.add('highlight');
                return { won: true, winner: gameSate[i], tie:false };
            }
        }
        
        for(let i = 0; i < 3; i++){ 
            if (gameSate[i] === gameSate[i+3] && gameSate[i+3] === gameSate[i+6] && gameSate[i] !== undefined){
                gameSpotTags[i].classList.add('highlight');
                gameSpotTags[i+3].classList.add('highlight');
                gameSpotTags[i+6].classList.add('highlight');
                return { won: true, winner: gameSate[i], tie:false };
            }
        }

        if (gameSate[0] === gameSate[4] && gameSate[4] === gameSate[8] && gameSate[0] !== undefined){
            gameSpotTags[0].classList.add('highlight');
            gameSpotTags[4].classList.add('highlight');
            gameSpotTags[8].classList.add('highlight');
            return { won: true, winner: gameSate[0], tie:false };
        }
        
        if (gameSate[2] === gameSate[4] && gameSate[4] === gameSate[6] && gameSate[2] !== undefined){
            gameSpotTags[2].classList.add('highlight');
            gameSpotTags[4].classList.add('highlight');
            gameSpotTags[6].classList.add('highlight');
            return { won: true, winner: gameSate[2], tie:false };
        }

        let tie = true;
        for(let i = 0; i < 9; i++){
            if(gameSate[i] === undefined){
                tie = false;
            }
        }
        return { won: tie, winner: undefined, tie };
    }

    const makeMove = (postion, sign) => 
    {
        if(gameSate[postion] !== undefined){
            return false;
        }
        gameSate[postion] = sign;
        gameSpotTags.forEach((element, index) => {
            if (gameSate[index] !== undefined)
            {
                element.textContent = gameSate[index] ? 'X' : 'O';
            }
        });

        return true;
    } 

    return {makeMove, isFinished, resetGame};
}())

const player = (sign) => {
    let score = 0;
    let currnetName = 'player'

    const setName = (name) => currnetName = name;
    const getName = () => currnetName;
    const incresScore = () => score ++;
    const getScore = () => score;
    const hasWon = () => MAX_WINING_ROUNDS === score;
    const resetScore = () => score = 0;

    return {sign, setName, getName, incresScore, resetScore, getScore, hasWon};
}

const game = (function(){
    const player1 = player(true);
    const player2 = player(false);
    let currnetPlayer = player1;
    let resetGameState = false;

    const resetGame = (name1, name2) => {
        gameBoard.resetGame();
        player1.setName(name1);
        player2.setName(name2)
        player1.resetScore();
        player2.resetScore();
        currnetPlayer = player1;
        resetGameState = false;
    }

    const makeMove = (position) => {
        if(resetGameState){
            currnetPlayer = player1;
            resetGameState = false;
            gameBoard.resetGame();
        }
        if(gameBoard.makeMove(position, currnetPlayer.sign))
        {
            currnetPlayer = currnetPlayer === player1? player2 : player1;
        }
        roundeIsFinished();
    }

    const roundeIsFinished = () => {
        const {won, winner, tie} = gameBoard.isFinished();

        if(!won){
            return undefined;
        }

        if(tie){
            resetGameState = true;
            return 'It is a tie';
        }

        const winnerName = winner? player1.getName() : player2.getName() ;
        winner? player1.incresScore() : player2.incresScore();
        resetGameState = true;
        return winnerName; 
    }

    const gameIsFinished = () => {
        if(player1.hasWon()){
            return {gameIsFinished: true, winner: player1.getName() };
        }  
        if(player2.hasWon()){
            return {gameIsFinished: true, winner: player2.getName() };
        }  
        return {gameIsFinished: false, winner: undefined};
    }

    const getScore = () => `${player1.getScore()} - ${player2.getScore()}`
    return {getScore, makeMove, roundeIsFinished, gameIsFinished, resetGame};
}())

gameSpotTags.forEach((element, index) => {
    element.addEventListener('click', () =>{
        game.makeMove(index);
        let gameState = game.gameIsFinished();
        if(gameState.gameIsFinished){
            winnerTag.textContent = gameState.winner;
            dialogWinnerTag.showModal();
        }
        scoreTag.textContent = game.getScore();
    });
});

btnPlayerNamesTag.addEventListener('click', () => {
    player1NameTag.textContent = player1InputNameTag.value;
    player2NameTag.textContent = player2InputNameTag.value;
    game.resetGame(player1InputNameTag.value, player1InputNameTag.value);
    player1NameTag.textContent = player1InputNameTag.value;
    player2NameTag.textContent = player2InputNameTag.value;
    scoreTag.textContent = game.getScore();
});

closeBtn.addEventListener('click', () =>{
    dialogWinnerTag.close();
    startDialogTag.showModal();
})

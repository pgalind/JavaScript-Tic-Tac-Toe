// Tic Tac Toe implementation in JavaScript

// Global handle to board div, controls div, and message div
let boardNode;
let controlsNode;
let messageNode;

// Global variables
const dims = 3
const numToWin = 3
let freeSpaces = dims * dims;

// 2D array that forms the 3x3 grid
// accessed as buttonsArr[r][c], where r is row and c is column
const board = []

// Assoc array of the other buttons
const controls = {}

// Assoc array of marks
// Player is "X" by default unless AiFirst button is clicked
let marks = {player:"X", ai:"O"}

// If the player starts, the AiFirst button is disabled for the rest of the game
// and will only become enabled again if the user clicks the Reset button.
// Places marks on the board and checks for winner.
// If a player wins, call endGame and pass their mark as argument
// After each turn decrement freeSpaces, and if it reaches 0 before there is a winner,
// game will end in a draw.
// If there is no winner and no draw, call aiGo.
const boardOnClick = function() {
    this.innerHTML = marks.player
    this.disabled = true
    controls["AiFirst"].disabled = true
    --freeSpaces
    // check for winner
    if(checkWinner(marks.player)){
        endGame(marks.player)
    }
    // check for draw
    else if(freeSpaces == 0){
        endGame("-")
    }
    else{
        aiGo()
    }
}

// Clears the board, resets freeSpaces to 9, resets mark assoc array to default,
// and enablese the AiFirst button again
const resetOnClick = () => {
    for(let r = 0; r < dims; r++){
         for(let c = 0; c < dims; c++){
             board[r][c].disabled = false
            board[r][c].innerHTML = "_"
        }
    }
    while(messageNode.firstChild){
        messageNode.removeChild(messageNode.firstChild)
    }
    freeSpaces = dims * dims
    marks.player = "X"
    marks.ai = "O"
    controls["AiFirst"].disabled = false
}

// Set ai mark to "X", disable the button and call aiGo
const aiFirstOnClick = function() {
    this.disabled = true
    marks.player = "O"
    marks.ai = "X"
    aiGo()
}

// generates random row and column values until it finds an empty space
// then puts the AIs mark in that space
const aiGo = () => {
    let randR
    let randC
    do{
        randR = Math.floor(Math.random() * dims)
        randC = Math.floor(Math.random() * dims)
    } while(board[randR][randC].innerHTML !== "_")

    board[randR][randC].innerHTML = marks["ai"]
    board[randR][randC].disabled = true
    --freeSpaces
    // check for winner
    if(checkWinner(marks.ai)){
        endGame(marks.ai)
    }
    // check for draw
    else if(freeSpaces == 0){
        endGame("-")
    }

}

// takes current player's mark as argument, and checks that there are 3 matching 
// marks in a row. If so returns true, otherwise returns false
const checkWinner = (mark) => {
    let inARow;
    // horizontal
    for(let r = 0; r < dims; r++){
        inARow = 0;
        for(let c = 0; c < dims; c++){
            if(board[r][c].innerHTML == mark) inARow++
        }
        if(inARow == numToWin) return true;
    }
    // vertical
    for(let c = 0; c < dims; c++){
        inARow = 0;
        for(let r = 0; r < dims; r++){
            if(board[r][c].innerHTML == mark) inARow++
        }
        if(inARow == numToWin) return true;
    }
    // diagonal1
    inARow = 0;
    for(let r = 0; r < dims; r++){
        let c = r
        if(board[r][c].innerHTML == mark) inARow++
    }
    if(inARow == numToWin) return true;
    
    // diagonal2
    inARow = 0;
    for(let r = 0; r < dims; r++){
        let c = dims-1 - r
        if(board[r][c].innerHTML == mark) inARow++
    }
    if(inARow == numToWin) return true;
}

// disables all buttons except for the Reset button
// displays winner or tie information
const endGame = function(mark) {
    for(let r = 0; r < dims; r++){
        for(let c = 0; c < dims; c++){
            board[r][c].disabled = true
        }
    }
    if(mark == "-"){
        const msgDraw = document.createTextNode("Draw!")
        messageNode.appendChild(msgDraw)
        document.body.insertBefore(messageNode, boardNode)
    }
    else{
        const msgWinner = document.createTextNode("Player " + mark + " won!")
        messageNode.appendChild(msgWinner)
        document.body.insertBefore(messageNode, boardNode)
    }
}

// called when page finishes loading
// populates boardNode and controlNode
// builds out buttons and saves them in control assoc array
// and adds them into controlNode
const load = () => {
    boardNode = document.getElementById("board")
    controlsNode = document.getElementById("controls")
    messageNode = document.getElementById("message")

    // create the 3x3 grid and add buttons to the boardNode
    for(let i = 0; i < dims; i++){
        const row = []
        board.push(row)
        const rowDiv = document.createElement("div")
        boardNode.appendChild(rowDiv)

        for(let j = 0; j < dims; j++){
            const button = document.createElement("button")
            button.innerHTML = "_"
            rowDiv.appendChild(button)
            row.push(button)
            button.onclick = boardOnClick
        }
    }

    // create AI go first button and add it to control array
    const aiButton = document.createElement("button")
    aiButton.innerHTML = "AI go first"
    controlsNode.append(aiButton)
    controls["AiFirst"] = aiButton
    aiButton.onclick = aiFirstOnClick

    // create Reload button and add it to control array
    const resetButton = document.createElement("button")
    resetButton.innerHTML = "Reset"
    controlsNode.append(resetButton)
    controls["Reset"] = resetButton
    resetButton.onclick = resetOnClick  
    
}

// when the page finishes loading, calls function load
window.addEventListener("load", load);
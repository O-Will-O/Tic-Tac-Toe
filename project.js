const takenPlaces = new Array()
var gameOver = false;
if(document.readyState == "loading") //Checks and makes sure that the document it loaded before we access the different parts of it
{
    document.addEventListener("DOMContentLoaded", ready)
}
else
{
    ready()
}
var activePlayer = 'X';
var prevWinner = "O"
var playerXScore = 0
var playerOScore = 0
var TieCounter = 0
const winningConditions = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 5, 9],
    [3, 5, 7]
 ];
 var Xpos = new Array()
 var Opos = new Array()

function ready() {
    const items = document.getElementsByClassName("grid-item");//Retreives all of the grid items
    for (let i = 0; i < items.length; i++) //loops through all of the grid-items and adds and event listener to them that tracks when they are clicked and if so runs handleGridItemClick function
    {
        const button = items[i];
        button.addEventListener("click", handleGridItemClick);
    }
    const resetBtn = document.getElementsByClassName("reset")[0]//gets the reset button 
    resetBtn.addEventListener('click' , reset)//adds a evenlistener that tracks when the button is clicked and if so runs the reset function
}

function handleGridItemClick(event) 
{
    if (!gameOver) //checks if the game is not over when a grid-item is clicked
    {
        const itemPlace = parseInt(event.target.getAttribute('name'));//gets the grid-item that was clicked and pull it's name as a number
        if (!checkPlace(itemPlace)) //if the grid-item is empty run the add turn function
        {
            addTurn(event);
        } 
        else //if the grid-item is not empty then it does not allow the user to click on that grid-item
        {
            // Handle the case where the position is already taken
            alert("Position already taken!");
        }
    } 
    if(gameOver === true) //checks if the game ended when a grid-item is clicked
    {
        // Game is over, further moves are disabled
        alert("Game over. Please reset the game.");
    }
}

function checkPlace(position) 
{
    return takenPlaces.includes(String(position)); // Check if the position is already taken
}

function addTurn(x)
{
    prevWinner = activePlayer;
    let item = x.srcElement //grabs the element that was clicked on
    item.innerText = activePlayer //changes the text of the item that was clicked on to the symbol of the current turns player
    //the set timeout is there to delay checking if either player has won
    setTimeout(() => {if (activePlayer === 'X') //checks if the active player is X
    {
        pos(x, 'X') //grabs the postion of the most recent turn of player X
        if (checkWin(Xpos)) //checks if the X player has won or not
        {
            // Player X wins
            alert("Player X wins!");
            //updates the score
            playerXScore +=1
            let appendScorePos = document.getElementsByClassName("player1Score")[0]
            let p = appendScorePos.getElementsByTagName("p")[0]
            p.innerText = playerXScore
        } 
        else if (checkTie()) //checks if there is a tie 
        {
            // Game ends in a tie
            alert("It's a tie!");
            //updates the score
            TieCounter += 1
            let appendScorePos = document.getElementsByClassName("TieCounter")[0]
            let p = appendScorePos.getElementsByTagName("p")[0]
            p.innerText = TieCounter
        }
    } 
    else if (activePlayer === 'O') //checks if the active player is O
    {
        pos(x, 'O')//Gets the postion of the most recent turn of player O
        if (checkWin(Opos)) //checks if player O has won or not
        {
            // Player O wins
            alert("Player O wins!");
            //updates the score
            playerOScore +=1
            let appendScorePos = document.getElementsByClassName("player2Score")[0]
            let p = appendScorePos.getElementsByTagName("p")[0]
            p.innerText = playerOScore
        } else if (checkTie()) //checks if there is a tie
        {
            // Game ends in a tie
            alert("It's a tie!");
            //updates the score
            TieCounter += 1
            let appendScorePos = document.getElementsByClassName("TieCounter")[0]
            let p = appendScorePos.getElementsByTagName("p")[0]
            p.innerText = TieCounter
             
        }
    }
    if (checkWin(Xpos) || checkWin(Opos) || checkTie()) //once the game ends and someone has won this disables the players from making further moves
    {
        gameOver = true;
    }}, 100);
    //swaps the player and displays it as well
    setTimeout(() => {activePlayer = Swap()
        let activePlayerText = document.getElementsByClassName("activePlayer")[0]
        let letter = activePlayerText.getElementsByTagName('h5')[0]
        letter.innerText = activePlayer;}, 100);
}

function Swap() //swaps the active player
{
    if(activePlayer == "X")
    {
        return 'O';
    }
    else if(activePlayer == "O")
    {
        return 'X';
    }
}

function pos(x, y)
{
    let item = x.srcElement;
    const position = item.getAttribute("name"); //get the name value from whatever Item was clicked last
    takenPlaces.push(position); // Push to the general takenPlaces array
    if (activePlayer === "X") {
        Xpos.push(position); // Push to Xpos if the active player is X
    }
    if (activePlayer === "O") 
    {
        Opos.push(position); // Push to Opos if the active player is O
    }
}

function checkWin(playerPositions) 
{
    let prevWinPos = new Array() //keeps track of the postions of the win
    return winningConditions.some(condition => {
        if (condition.every(pos => playerPositions.includes(pos.toString()))) 
        {
            prevWinPos = condition.slice(); // Copy the winning condition to prevWinPos
            updateWinningStyles(prevWinPos)
            return true; // Return true to indicate a win
        }
        return false;
    });
    return prevWinPos;
}

function updateWinningStyles(prevWinPos) //changes the style of the grid-items in the winning positions
{
    const gridItems = document.getElementsByClassName("grid-item");//grabs all the grid items
    for (let i = 0; i < gridItems.length; i++) //loops through all the grid-items
    {
        const item = gridItems[i];//grabs the current item in the loop
        const itemName = item.getAttribute("name");//gets the name of that item
        if (prevWinPos.includes(Number(itemName))) //checks if that item is a winning item
        {
            item.classList.add("winning-item"); // Add a class for winning items
        } 
    }
}

function checkTie() 
{
    return takenPlaces.length === 9; // If all positions are taken and there's no winner
}

function reset()
{
     // Clear the board - reset all the necessary variables and elements
     takenPlaces.length = 0;
     Xpos.length = 0;
     Opos.length = 0;
     const gridItems = document.getElementsByClassName("grid-item"); //gets all the grid-items
     for (let i = 0; i < gridItems.length; i++) //loops through all the grid-items
     {
        gridItems[i].innerText = ''; // Clear the marks on the board
        gridItems[i].classList.remove("winning-item")//removes the winning-item class from all grid-items
     }
     activePlayer = prevWinner;// Reset activePlayer to the prevWinner
     let activePlayerText = document.getElementsByClassName("activePlayer")[0]//gets the active player div
     let letter = activePlayerText.getElementsByTagName('h5')[0]// gets the h5 tag within the active player div
     letter.innerText = activePlayer; //sets the text within the h5 to the active player
     gameOver = false;//resets the game over so you can click on the grid again
}
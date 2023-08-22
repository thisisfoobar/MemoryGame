const gameContainer = document.getElementById("game");
const totalClicksDisplay = document.querySelector("#totalClicks");
const newGameBtn = document.querySelector("#newGameBtn");
const winningMessage = document.querySelector("#winningMessage");
const highScoreDisplay = document.querySelector("#highScore");
let gameTiles;
let cardClicks = [];
let totalClicks = 0;
let highScore;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  let id = 1;
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);
    newDiv.id = color + id;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
    id++;
  }
  gameTiles = document.querySelectorAll("div:not(#game)");
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  const colorClass = event.target.className;

  let matchingCount = 0;

  // change card background color and add to array for tracking
  if (cardClicks.length <= 1) {
    cardClicks.push({ id: event.target.id, class: colorClass });
    event.target.style.backgroundColor = event.target.className;
    totalClicks++;
    if (cardClicks.length === 2) {
      if (cardClicks[0].id === event.target.id) {
        const warningNote = document.querySelector("#warningNote");
        warningNote.innerHTML = "You can't click the same card twice!";
        setTimeout(function () {
          warningNote.innerHTML = "";
        }, 1500);
        cardClicks.pop();
        totalClicks--;
      } else if (cardClicks[0].class === cardClicks[1].class) {
        cardClicks.forEach((click) => {
          document
            .querySelector("#" + click.id)
            .removeEventListener("click", handleCardClick);
        });
        cardClicks = [];
      } else if (cardClicks[0].class !== cardClicks[1].class) {
        // if cards don't match, revert background color to white
        setTimeout(function () {
          cardClicks.forEach((click) => {
            document.querySelector("#" + click.id).style.backgroundColor = "";
          });

          cardClicks = [];
        }, 1000);
      }
    }
  }
  totalClicksDisplay.innerHTML = totalClicks;
  for (tile of gameTiles) {
    if (tile.style.backgroundColor !== "") {
      matchingCount++;
    }
  }

  // end the game and display win message
  if (matchingCount === 10) {
    winningMessage.innerHTML = "Winner Winner Chicken Dinner!!!";

    highScore = JSON.parse(localStorage.getItem("highScore"));
    if (highScore === 0) {
      highScore = totalClicks
    }
    if (highScore < totalClicks) {
      highScoreDisplay.innerHTML = highScore;
      localStorage.setItem("highScore", highScore);
    } else {
      highScoreDisplay.innerHTML = totalClicks;
      localStorage.setItem("highScore", totalClicks);
    }
  }
}

newGameBtn.addEventListener("click", resetGame);

function resetGame() {
  for (tile of gameTiles) {
    tile.removeEventListener("click", handleCardClick);
    tile.remove();
  }

  shuffledColors = shuffle(COLORS);
  createDivsForColors(shuffledColors);
  winningMessage.innerHTML = "";
  totalClicksDisplay.innerHTML = 0;
  totalClicks = 0;
  cardClicks = [];
}

// when the DOM loads
createDivsForColors(shuffledColors);

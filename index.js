const dice = document.querySelectorAll(".die");
const rollButton = document.querySelector("#roll-button");
const rollsLeft = document.querySelector("#rolls-left");
const scoreColumns = document.querySelectorAll(".score-column");
let rollCount = 2;
let dieValues = [0, 0, 0, 0, 0];

initialize();

// Hold toggle
dice.forEach((die) => {
  die.addEventListener("click", (event) => {
    event.target.classList.toggle("hold");
  });
});

// Roll button click event
rollButton.addEventListener("click", () => {
  rollCount--;
  rollDice();
  updateRollsLeft();
  previewScore();
});

// Score columns click event
scoreColumns.forEach((col) => {
  col.addEventListener("click", score);
});

function initialize() {
  dice.forEach((die) => die.classList.remove("hold"));
  rollCount = 2;
  rollDice();
  updateRollsLeft();
  previewScore();
  rollButton.removeAttribute("disabled");
}

function rollDice() {
  dice.forEach((die, index) => {
    if (!die.classList.contains("hold"))
      die.innerHTML = dieValues[index] = Math.floor(Math.random() * 6 + 1);
  });
}

function updateRollsLeft() {
  if (rollCount === 2) rollsLeft.innerHTML = "2 rolls remaining";
  if (rollCount === 1) rollsLeft.innerHTML = "Last roll!";
  else if (rollCount === 0) {
    rollsLeft.innerHTML = "Select a column to score";
    rollButton.setAttribute("disabled", true);
  }
}

function score(event) {
  if (!event.target.classList.contains("scored")) {
    event.target.classList.add("scored");
    initialize();
  }
}

function previewScore() {
  calculateUpperSection();
  calculateLowerSection();
}

function calculateUpperSection() {
  let totalScore = 0;

  for (let i = 0; i < 6; i++) {
    if (!scoreColumns[i].classList.contains("scored")) {
      scoreColumns[i].innerHTML = dieValues.reduce((acc, curr) => {
        if (curr === i + 1) return (acc += curr);
        else return acc;
      }, 0);
    } else {
      totalScore += Number.parseInt(scoreColumns[i].innerHTML);
    }
  }

  scoreColumns[6].innerHTML = totalScore;

  if (totalScore >= 63) scoreColumns[7].innerHTML = 35;
  else scoreColumns[7].innerHTML = 0;

  scoreColumns[15].innerHTML =
    totalScore + Number.parseInt(scoreColumns[7].innerHTML);

  scoreColumns[17].innerHTML =
    Number.parseInt(scoreColumns[15].innerHTML) +
    Number.parseInt(scoreColumns[16].innerHTML);
}

function calculateLowerSection() {
  let totalScore = 0;

  // Number of ones, twos, threes, etc.
  const kindCount = [0, 0, 0, 0, 0, 0];
  dieValues.forEach((dieValue) => {
    kindCount[dieValue - 1]++;
  });

  // 3 of a kind
  if (!scoreColumns[8].classList.contains("scored"))
    scoreColumns[8].innerHTML = kindCount.find((count) => count >= 3)
      ? sumOf(dieValues)
      : 0;
  else totalScore += Number.parseInt(scoreColumns[8].innerHTML);

  // 4 of a kind
  if (!scoreColumns[9].classList.contains("scored"))
    scoreColumns[9].innerHTML = kindCount.find((count) => count >= 4)
      ? sumOf(dieValues)
      : 0;
  else totalScore += Number.parseInt(scoreColumns[9].innerHTML);

  // Full House
  if (!scoreColumns[10].classList.contains("scored"))
    scoreColumns[10].innerHTML =
      kindCount.includes(3) && kindCount.includes(2) ? 25 : 0;
  else totalScore += Number.parseInt(scoreColumns[10].innerHTML);

  // Small Straight
  if (!scoreColumns[11].classList.contains("scored"))
    scoreColumns[11].innerHTML = longestStraight(kindCount) >= 4 ? 30 : 0;
  else totalScore += Number.parseInt(scoreColumns[11].innerHTML);

  // Large Straight
  if (!scoreColumns[12].classList.contains("scored"))
    scoreColumns[12].innerHTML = longestStraight(kindCount) === 5 ? 40 : 0;
  else totalScore += Number.parseInt(scoreColumns[12].innerHTML);

  // Yahtzee
  if (!scoreColumns[13].classList.contains("scored"))
    scoreColumns[13].innerHTML = kindCount.find((count) => count === 5)
      ? 50
      : 0;
  else totalScore += Number.parseInt(scoreColumns[13].innerHTML);

  // Chance
  if (!scoreColumns[14].classList.contains("scored"))
    scoreColumns[14].innerHTML = sumOf(dieValues);
  else totalScore += Number.parseInt(scoreColumns[14].innerHTML);

  scoreColumns[16].innerHTML = totalScore;

  scoreColumns[17].innerHTML =
    Number.parseInt(scoreColumns[15].innerHTML) +
    Number.parseInt(scoreColumns[16].innerHTML);
}

// Utility Functions

function longestStraight(kindCount) {
  let longest = 0;
  let tempLongest = 0;

  kindCount.forEach((count) => {
    if (count !== 0) {
      tempLongest++;
      longest = Math.max(longest, tempLongest);
    } else {
      tempLongest = 0;
    }
  });

  return longest;
}

function sumOf(array) {
  return array.reduce((acc, curr) => (acc += curr));
}

/*
 * Create a list that holds all of your cards
 */
 let cards = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt',
          'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb', 'fa-diamond',
          'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf',
          'fa-bicycle', 'fa-bomb'];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function generateBoard() {
  shuffle(cards).forEach(card => {
    let li = document.createElement('li');
    li.classList.add('card');
    li.setAttribute('data-card', card);
    let i = document.createElement('i');
    i.classList.add('fa', card);
    i.setAttribute('data-card', card);
    li.appendChild(i);
    document.getElementById('deck').appendChild(li);
  });
};
generateBoard();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    };

    return array;
};


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */


let openCards = [];
let lastFlipped = null;
let count = 0;
let moves = 3;
let movesSpan = document.getElementById('moves');
let pause = false;
let restart = document.getElementById('restart');
let resetModal = document.getElementById('restartGame');
let initialClick = false;
let stars = document.getElementById('stars');
let currentPerformance = 'good';

function checkPerformance() {
 // good(3) = 9 moves or less
 if(count <= 9) {
   // nothing
 };

 // average(2) = 10 - 19
 if(count > 9 && count < 20) {
   if(currentPerformance === 'average') {
     return;
   };
   else {
     currentPerformance = 'average';
     stars.removeChild(stars.children[stars.children.length - 1]);
   };
 };

 // poor(1) 20+
 if(count >= 20) {
   if(currentPerformance === 'poor') {
     return;
   }
   else {
     currentPerformance = 'poor';
     stars.removeChild(stars.children[stars.children.length - 1]);
   };
 };
};

function activateCards() {
  let allCards = document.querySelectorAll('.card');
  allCards.forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (initialClick === false) {
        initialClick = true;
        startTimer();
      };
      if (card === lastFlipped || pause || openCards.includes(card)) {
        return;
      }
      card.classList.add('open', 'show');
      if (lastFlipped && lastFlipped != card) {
        console.log(card, lastFlipped);
        let thisCard = card.getAttribute('data-card');
        let lastCard = lastFlipped.getAttribute('data-card');
        console.log(lastCard, thisCard);
        count++;
        checkPerformance();
        movesSpan.innerText = count;
        if (lastCard === thisCard) {
          console.log('match');
          card.classList.add('match');
          lastFlipped.classList.add('match');
          openCards.push(card);
          openCards.push(lastFlipped);
          lastFlipped = null;
        } else {
          console.log('noMatch');
          pause = true;
          setTimeout(function() {
            card.classList.remove('open', 'show');
            lastFlipped.classList.remove('open', 'show');
            lastFlipped = null;
            pause = false;
          }, 1000);
        };
        if (openCards.length == 16) {
          gameOver();
        }
      } else {
        lastFlipped = card;
      };
    });
  });
};

activateCards();

//timer funtions to control timer
// Timer functions
let sec = 0;
let min = 0;
let timer;
let gameCurrentTime;
let gameTimer = document.getElementById('timer');

function startTimer() {
timer = setInterval(function(){
  sec++;
  if(sec === 60) {
    min++;
    sec = 0;
  }
  renderTime();
}, 1000);
}

function stopTimer() {
  clearInterval(timer);
};

function renderTime() {
  let minCount = min < 10 ? `0${min}` : String(min);
  let secCount = sec < 10 ? `0${sec}` : String(sec);
  gameCurrentTime = `${minCount}:${secCount}`;
  gameTimer.innerText = gameCurrentTime;
};

function resetGame() {
  document.getElementById('deck').innerHTML = '';
   openCards = [];
   lastFlipped = null;
   count = 0;
   moves = 3;
   pause = false;
   initialClick = false;
   sec = 0;
   min = 0;
   clearInterval(timer);
   renderTime();
   movesSpan.innerText = count;
   stars.innerHTML = '';
   for (let i = 0; i < moves; i++){
     stars.innerHTML += '<li><i class="fa fa-star"></i></li>';
   };
   generateBoard();
   activateCards();
};

//restart button
restart.addEventListener('click', function(){
  resetGame();
});

resetModal.addEventListener('click', function() {
  resetGame();
});

function gameOver() {
  stopTimer();
  $('#myModal').modal('show');
  document.getElementById('timerEnd').innerText = gameCurrentTime;
  document.getElementById('starsEnd').innerText = stars.children.length + ' ' + currentPerformance;
  document.getElementById('movesEnd').innerText = count;
};

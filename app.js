
let scores, roundScore, activePlayer, winningscore;

winningscore = 100;

// UI inicializálás új kör kezdéskor

function init() {

  scores = [0, 0];
  roundScore = 0;
  activePlayer = 0;

  // ha töltve van a mező...
  if (document.querySelector('.final-score').value !== "") {
    if (isNaN(document.querySelector('.final-score').value)) {
      // ha nem számot írt be akkor marad az előző érték amit visszaírunk
      document.getElementsByClassName('final-score')[0].value = winningscore;
    } else {
      // ha számot írt be akkor kivesszük
      winningscore = parseInt(document.querySelector('.final-score').value);
    }
  } else {
    // ha nincs töltve az input field akkor beletesszük a default értéket
    document.getElementsByClassName('final-score')[0].placeholder = winningscore;
  };

  // beállítjuk a kezdő értékeket a UI-on is
  document.querySelector('#score-0').textContent = 0;
  document.querySelector('#score-1').textContent = 0;
  document.querySelector('#current-0').textContent = 0;
  document.querySelector('#current-1').textContent = 0;

  // a játék kezdetekor a két kockát eltüntetjük:
  document.querySelector('#dice-1').style.display = 'none';
  document.querySelector('#dice-2').style.display = 'none';

  // a gombokat megjelenítjük
  document.querySelector('.btn-roll').style.display = 'block';
  document.querySelector('.btn-hold').style.display = 'block';

  document.querySelector('#name-0').textContent = 'Player 1';
  document.querySelector('#name-1').textContent = 'Player 2';

  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');

  document.querySelector('.player-1-panel').classList.remove('active');
  document.querySelector('.player-0-panel').classList.add('active');
}

init();

// új játék kezdete...
document.querySelector('.btn-new').addEventListener('click', init);

// ha a roll dice gombra kattint a user...
document.querySelector('.btn-roll').addEventListener('click', function () {

  let dice1 = Math.floor(Math.random() * 6) + 1;
  let dice2 = Math.floor(Math.random() * 6) + 1;

  let diceDOM1 = document.querySelector('#dice-1');
  diceDOM1.style.display = 'block';
  diceDOM1.setAttribute('src', 'dice-' + dice1 + '.png');
  let diceDOM2 = document.querySelector('#dice-2');
  diceDOM2.style.display = 'block';
  diceDOM2.setAttribute('src', 'dice-' + dice2 + '.png');

  // Ha a ha játékos legalább egy 1-est dob, a roundScore értékét elveszti és a másik jön

  if (dice1 !== 1 && dice2 !== 1) {
    roundScore = roundScore + dice1 + dice2;
    document.querySelector('#current-' + activePlayer).textContent = roundScore;
  } else {
    nextPlayer();
  }
});

function nextPlayer() {
  // roundScore értéket nullázzuk a UI-on is:
  document.querySelector('#current-' + activePlayer).textContent = 0;
  // a következő játékos jön
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }
  roundScore = 0;
  // toggle: ha rajta volt a class akkor leveszi, ha nem volt rajta
  // akkor rárakja...
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');
}


// ha a hold gombra rányom a játékos
document.querySelector('.btn-hold').addEventListener('click', function () {
  // a játékos megszerzi a kör alatt szerzett pontjait
  // az előző érték plusz a mostani...
  scores[activePlayer] = scores[activePlayer] + roundScore;
  // update the UI
  document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];

  // ellenőrizzük hogy van e nyertes:
  if (scores[activePlayer] >= winningscore) {
    // játék vége
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');

    document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
    document.querySelector('#dice-1').style.display = 'none';
    document.querySelector('#dice-2').style.display = 'none';
    document.querySelector('.btn-roll').style.display = 'none';
    document.querySelector('.btn-hold').style.display = 'none';

    // ha nincs nyertes, akkor a következő játékos jön
  } else {
    nextPlayer();
  }
});
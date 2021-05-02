
//kell két új változó: lastRolls = utolsó dobásokat rögzíti, winningscore: nyerési pontszám paraméterehzető
let scores, roundScore, activePlayer, lastRolls, winningscore;

winningscore = 100;

// UI inicializálás új kör kezdéskor
function init() {
  // pontszámok kezdő értékei
  scores = [0, 0];
  lastRolls = [0, 0];
  roundScore = 0;
  activePlayer = 0;


  //nyerési pontszámot update-eljük ha volt változtatás, ha nem akkor meg beírjuk a defaultot

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

  // a játék kezdetekor a kockák eltűntetése, gombok UI-ra - induló állapot
  document.querySelector('#dice-1').style.display = 'none';
  document.querySelector('#dice-2').style.display = 'none';
  document.querySelector('.btn-roll').style.display = 'block';
  document.querySelector('.btn-hold').style.display = 'block';

  document.querySelector('#name-0').textContent = 'Player 1';
  document.querySelector('#name-1').textContent = 'Player 2';

  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');

  document.querySelector('.player-1-panel').classList.remove('active');
  document.querySelector('.player-0-panel').classList.add('active');
}

// játékos váltás hold, 1-es vagy dupla 6-os esetén
function nextPlayer() {
  // roundScore értéket nullázzuk a UI-on
  document.querySelector('#current-' + activePlayer).textContent = 0;
  // a következő játékos jön
  if (activePlayer === 0) {
    activePlayer = 1;
  } else {
    activePlayer = 0;
  }
  //nullázzuk a current score-t és az előző dobás értékét
  roundScore = 0;
  lastRolls[activePlayer] = 0;
  // toggle: ha rajta volt a class akkor leveszi, ha nem volt rajta
  document.querySelector('.player-0-panel').classList.toggle('active');
  document.querySelector('.player-1-panel').classList.toggle('active');
}

// Innen indul a játék logika...

// indító képernyő inicializálása
init();

// új játék gomb lenyomásra inító képernyő...
document.querySelector('.btn-new').addEventListener('click', init);

// ha a roll dice gombra kattint a user...
document.querySelector('.btn-roll').addEventListener('click', function () {
  let dice = Math.floor(Math.random() * 6) + 1;

  // ha nem 6-ost dob...
  if (dice !== 6) {
    // az előző dobás rögzített értéke lastRolls[activePlayer] nem számít + töröljük a második kockát ha aktív volt
    let diceDOM = document.querySelector('#dice-2');
    diceDOM.style.display = 'none';
    lastRolls[activePlayer] = 0;

    // megjelenítjük a dobást az első kockán
    diceDOM = document.querySelector('#dice-1');
    diceDOM.setAttribute('src', 'dice-' + dice + '.png')
    diceDOM.style.display = 'block';

    // ha 1-est dob, a roundScore értékét elveszti és a másik jön
    if (dice !== 1) {
      roundScore = roundScore + dice;
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
    } else {
      nextPlayer();
    }
    // ha 6-ost dob
  } else {
    // ...az első 6-osnál még semmi extra csak rögzítjük a dobást értékét a lastRolls változóban
    lastRolls[activePlayer] = lastRolls[activePlayer] + dice;
    if (lastRolls[activePlayer] !== 12) {
      roundScore = roundScore + dice;
      document.querySelector('#current-' + activePlayer).textContent = roundScore;
      let diceDOM = document.querySelector('#dice-1');
      diceDOM.style.display = 'block';
      diceDOM.setAttribute('src', 'dice-' + dice + '.png');
      // második 6-ost jelző kockát levesszük ha esetleg ott volt a megelőző dobás után
      diceDOM = document.querySelector('#dice-2');
      diceDOM.style.display = 'none';

    } else {
      // a második 6-osnál a második kocka is megjelenik felső alatt és a játékos bukja a hold-olt pontjait + csere van
      scores[activePlayer] = 0;
      document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
      let diceDOM2 = document.querySelector('#dice-2');
      diceDOM2.setAttribute('src', 'dice-' + dice + '.png')
      diceDOM2.style.display = 'block';
      nextPlayer();
    }
  }
});

// ha a hold gombra rányom a játékos
document.querySelector('.btn-hold').addEventListener('click', function () {
  // a játékos megszerzi a kör alatt szerzett pontjait
  scores[activePlayer] = scores[activePlayer] + roundScore;
  document.querySelector('#score-' + activePlayer).textContent = scores[activePlayer];
  // van-e nyertes?
  if (scores[activePlayer] >= winningscore) {
    // ha igen akkor vége a játéknak
    document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
    document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
    document.querySelector('#name-' + activePlayer).textContent = 'Winner!';
    document.querySelector('.dice').style.display = 'none';
    document.querySelector('.btn-roll').style.display = 'none';
    document.querySelector('.btn-hold').style.display = 'none';
    // ha nincs nyertes, akkor a következő játékos jön
  } else {
    nextPlayer();
  }
});
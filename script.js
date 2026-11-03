const noButton = document.getElementById('nancy-no');
const reactions = ["That was a very Nancy answer.", "Oh dear. There goes that tail again.", "She's quite sure. For now.", "Even the biggest ‘no’ can leave room for a little curiosity."];
let noCount = 0;
noButton.addEventListener('click', () => {
  noButton.classList.remove('wobble');
  void noButton.offsetWidth;
  noButton.classList.add('wobble');
  document.getElementById('no-reaction').textContent = reactions[noCount++ % reactions.length];
});
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('share-book').addEventListener('click', async () => {
  const status = document.getElementById('share-status');
  const url = 'https://negativenancys.com/';
  try {
    if (navigator.share) await navigator.share({title:'Negative Nancys',text:'A little squirrel. A very big NO. A children’s book by Piper & Matt Carolan.',url});
    else if (navigator.clipboard && window.isSecureContext) {await navigator.clipboard.writeText(url); status.textContent = 'Link copied. Share a little Nancy!';}
    else status.textContent = 'Share this link: ' + url;
  } catch(error) { if (error.name !== 'AbortError') status.textContent = 'Share this link: ' + url; }
});

// Little discoveries, with bounded effects and no sound or tracking.
const surpriseTimers = new WeakMap();
function later(element, callback, delay) {
  clearTimeout(surpriseTimers.get(element));
  surpriseTimers.set(element, setTimeout(callback, delay));
}
function replay(element, className) {
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
}
const tailButton = document.querySelector('.tail-tickle');
const cover = document.querySelector('.cover-book');
const tailSpeech = document.querySelector('.tail-speech');
let tickles = 0;
tailButton.addEventListener('click', () => {
  tickles = Math.min(tickles + 1, 4);
  const answers = ['Hee! That tickles!', 'Not the tail!', 'Oh! There it goes!', 'My tail has a mind of its own!'];
  cover.style.setProperty('--tail-speed', `${.7 - tickles * .1}s`);
  cover.style.setProperty('--tail-angle', `${tickles * .65}deg`);
  cover.classList.add('tail-active');
  tailSpeech.textContent = answers[tickles - 1];
  tailSpeech.classList.add('is-visible');
  document.getElementById('tail-status').textContent = answers[tickles - 1];
  later(cover, () => {
    cover.classList.remove('tail-active');
    tailSpeech.classList.remove('is-visible');
    tickles = 0;
  }, 2200);
});

document.querySelectorAll('[data-flower]').forEach(flower => {
  flower.addEventListener('click', () => {
    const kind = flower.dataset.flower;
    const speech = flower.querySelector('.flower-speech');
    const messages = {hello: 'Hello, curious you!', sneeze: 'A-choo!', spin: 'Wheee!'};
    const classes = {hello: 'flower-greeting', sneeze: 'flower-sneezing', spin: 'flower-spinning'};
    replay(flower, classes[kind]);
    speech.textContent = messages[kind];
    speech.classList.add('is-visible');
    document.getElementById('flower-status').textContent = messages[kind];
    flower.querySelectorAll('.pollen').forEach(p => p.remove());
    if (kind === 'sneeze') {
      for (let i = 0; i < 7; i++) {
        const pollen = document.createElement('span');
        pollen.className = 'pollen';
        pollen.setAttribute('aria-hidden', 'true');
        const angle = i * Math.PI * 2 / 7;
        pollen.style.setProperty('--pollen-x', `${Math.cos(angle) * 50}px`);
        pollen.style.setProperty('--pollen-y', `${Math.sin(angle) * 50 - 15}px`);
        flower.appendChild(pollen);
      }
    }
    later(flower, () => {
      speech.classList.remove('is-visible');
      flower.classList.remove(classes[kind]);
      flower.querySelectorAll('.pollen').forEach(p => p.remove());
    }, 1700);
  });
});

document.querySelectorAll('.cottage-scene').forEach(cottage => {
  const door = cottage.querySelector('.cottage-door');
  const speech = cottage.querySelector('.cottage-speech');
  const replies = cottage.classList.contains('cafe-cottage')
    ? ['Welcome to Meadow Cafe!', 'One scoop of curiosity, coming up!', "Today's special? Trying something new!"]
    : cottage.classList.contains('mushroom-cottage')
      ? ['Psst... is that a curious explorer?', 'Just polishing my mushroom roof!', "It is cosy under this little cap!"]
      : ["Who is rustling in the flowers?", 'Oh! A visitor. Come say hello!', 'Mind the daisies on your way out!'];
  let knocks = 0;
  door.addEventListener('click', () => {
    knocks++;
    cottage.classList.add('cottage-awake');
    replay(cottage, 'cottage-knocking');
    const message = replies[(knocks - 1) % replies.length];
    speech.textContent = message;
    speech.classList.add('is-visible');
    document.getElementById('cottage-status').textContent = message;
    later(cottage, () => {
      cottage.classList.remove('cottage-awake', 'cottage-knocking');
      speech.classList.remove('is-visible');
      knocks = 0;
    }, 4000);
  });
});

// Meadow discoveries. All progress stays in this browser tab.
const natureMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const discoveryMessage = document.getElementById('discovery-message');
const natureParticles = document.getElementById('nature-particles');
function announceDiscovery(message, duration = 2600) {
  discoveryMessage.textContent = message;
  discoveryMessage.classList.add('is-visible');
  later(discoveryMessage, () => discoveryMessage.classList.remove('is-visible'), duration);
}
function scatterNature(x, y, celebrate = false) {
  natureParticles.replaceChildren();
  if (natureMotion.matches) return;
  for (let i = 0; i < (celebrate ? 36 : 9); i++) {
    const spark = document.createElement('span');
    spark.className = 'nature-spark' + (celebrate ? ' celebration' : '');
    spark.style.left = (celebrate ? 15 + Math.random() * 70 : x / window.innerWidth * 100) + 'vw';
    spark.style.top = (celebrate ? 25 + Math.random() * 25 : y / window.innerHeight * 100) + 'vh';
    const angle = i * Math.PI * 2 / 9;
    spark.style.setProperty('--spark-x', Math.cos(angle) * (celebrate ? 160 : 45) + 'px');
    spark.style.setProperty('--spark-y', (celebrate ? 160 + Math.random() * 150 : Math.sin(angle) * 45 - 20) + 'px');
    natureParticles.appendChild(spark);
  }
  later(natureParticles, () => natureParticles.replaceChildren(), 2100);
}
document.querySelectorAll('.bounce-mushroom').forEach(mushroom => {
  mushroom.addEventListener('click', () => {
    replay(mushroom, 'mushroom-bouncing');
    const rect = mushroom.getBoundingClientRect();
    scatterNature(rect.left + rect.width / 2, rect.top + 15);
    announceDiscovery('Boing! That mushroom is ticklish.');
    later(mushroom, () => mushroom.classList.remove('mushroom-bouncing'), 1000);
  });
});

const acornButtons = [...document.querySelectorAll('[data-acorn]')];
const acornIds = new Set(acornButtons.map(button => button.dataset.acorn));
const foundAcorns = new Set();
try {
  const stored = JSON.parse(sessionStorage.getItem('nancy-acorns-v1') || '[]');
  if (Array.isArray(stored)) stored.filter(id => acornIds.has(id)).forEach(id => foundAcorns.add(id));
} catch { /* The hunt still works when browser storage is unavailable. */ }
const acornBasket = document.getElementById('acorn-basket');
const restartHunt = document.getElementById('restart-hunt');
function showAcornProgress() {
  acornButtons.forEach(button => {
    const found = foundAcorns.has(button.dataset.acorn);
    button.classList.toggle('is-found', found);
    button.disabled = found;
  });
  acornBasket.hidden = foundAcorns.size === 0;
  document.getElementById('acorn-count').textContent = `${foundAcorns.size} / ${acornButtons.length} found`;
  restartHunt.hidden = foundAcorns.size !== acornButtons.length;
  try { sessionStorage.setItem('nancy-acorns-v1', JSON.stringify([...foundAcorns])); } catch {}
}
acornButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (foundAcorns.has(button.dataset.acorn)) return;
    foundAcorns.add(button.dataset.acorn);
    const rect = button.getBoundingClientRect();
    showAcornProgress();
    const complete = foundAcorns.size === acornButtons.length;
    scatterNature(rect.left + rect.width / 2, rect.top, complete);
    announceDiscovery(complete ? 'All five! You stayed curious!' : `You found an acorn! ${foundAcorns.size} of ${acornButtons.length}.`, complete ? 5000 : 2400);
    // Keep keyboard users near the discovery rather than losing focus to the page.
    if (document.activeElement === button) {
      if (complete) restartHunt.focus({preventScroll:true});
      else {
        const nextControl = button.parentElement.querySelector('button:not(:disabled), a[href]');
        if (nextControl) nextControl.focus({preventScroll:true});
        else button.blur();
      }
    }
  });
});
restartHunt.addEventListener('click', () => {
  foundAcorns.clear();
  showAcornProgress();
  announceDiscovery('Five acorns are hiding again. Happy exploring!');
  acornButtons[0].focus({preventScroll:false});
});
showAcornProgress();

const butterfly = document.getElementById('curious-butterfly');
let butterflyTimer;
let butterflyRestTimer;
let butterflyPaused = false;
function freezeButterfly() {
  const rect = butterfly.getBoundingClientRect();
  butterfly.style.transition = 'none';
  butterfly.style.left = rect.left + 'px';
  butterfly.style.top = rect.top + 'px';
  void butterfly.offsetWidth;
}
function planButterflyFlight(delay = 7000) {
  clearTimeout(butterflyTimer);
  if (document.hidden || natureMotion.matches || butterflyPaused) return;
  butterflyTimer = setTimeout(() => {
    butterfly.style.transition = '';
    const maxX = Math.max(12, window.innerWidth - 90);
    const maxY = Math.max(90, window.innerHeight - 160);
    butterfly.style.left = Math.min(maxX, Math.max(12, window.innerWidth * (.12 + Math.random() * .73))) + 'px';
    butterfly.style.top = Math.min(maxY, Math.max(90, window.innerHeight * (.2 + Math.random() * .46))) + 'px';
    planButterflyFlight();
  }, delay);
}
butterfly.addEventListener('click', () => {
  clearTimeout(butterflyTimer);
  clearTimeout(butterflyRestTimer);
  freezeButterfly();
  butterflyPaused = true;
  butterfly.classList.add('is-landed');
  butterfly.querySelector('.butterfly-message').textContent = 'Hello!';
  announceDiscovery('You caught the curious butterfly! A little rest, then off we go.');
  butterflyRestTimer = setTimeout(() => {
    butterfly.classList.remove('is-landed');
    butterflyPaused = butterfly.matches(':hover') || document.activeElement === butterfly;
    planButterflyFlight(1000);
  }, 3500);
});
function pauseButterfly() {
  butterflyPaused = true;
  clearTimeout(butterflyTimer);
  freezeButterfly();
}
function resumeButterfly() {
  if (butterfly.classList.contains('is-landed') || document.activeElement === butterfly) return;
  butterflyPaused = false;
  planButterflyFlight(2000);
}
butterfly.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') pauseButterfly(); });
butterfly.addEventListener('pointerleave', resumeButterfly);
butterfly.addEventListener('focus', pauseButterfly);
butterfly.addEventListener('blur', resumeButterfly);
document.addEventListener('visibilitychange', () => {
  clearTimeout(butterflyTimer);
  if (!document.hidden) planButterflyFlight();
});
natureMotion.addEventListener('change', () => {
  clearTimeout(butterflyTimer);
  freezeButterfly();
  planButterflyFlight();
});
window.addEventListener('resize', () => {
  freezeButterfly();
  butterfly.style.left = Math.max(12, Math.min(parseFloat(butterfly.style.left), window.innerWidth - 80)) + 'px';
  butterfly.style.top = Math.max(50, Math.min(parseFloat(butterfly.style.top), window.innerHeight - 120)) + 'px';
  planButterflyFlight();
});
planButterflyFlight();

// The butterfly yields whenever its flight passes an uncollected acorn.
// Check the actual rendered rectangles, including during flight and scrolling.
function keepAcornsClear() {
  if (document.hidden) return;
  const b = butterfly.getBoundingClientRect();
  const nearAcorn = acornButtons.some(acorn => {
    if (acorn.disabled) return false;
    const a = acorn.getBoundingClientRect();
    return a.bottom > 0 && a.top < window.innerHeight &&
      b.left < a.right + 16 && b.right > a.left - 16 &&
      b.top < a.bottom + 16 && b.bottom > a.top - 16;
  });
  butterfly.classList.toggle('is-near-acorn', nearAcorn);
}
setInterval(keepAcornsClear, 120);
window.addEventListener('scroll', keepAcornsClear, {passive:true});
window.addEventListener('resize', keepAcornsClear);
keepAcornsClear();

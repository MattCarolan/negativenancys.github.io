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
  let knocks = 0;
  door.addEventListener('click', () => {
    knocks++;
    cottage.classList.add('cottage-awake');
    replay(cottage, 'cottage-knocking');
    const message = knocks === 1 ? 'Knock, knock... anyone home?' : (knocks % 2 ? 'Oh, hello again!' : 'Who could that be?');
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

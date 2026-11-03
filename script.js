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

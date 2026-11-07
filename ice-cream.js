(() => {
  const shop = document.getElementById('meadow-ice-cream');
  const art = shop.querySelector('.ice-cream-art');
  const message = shop.querySelector('.ice-cream-message');
  const nameLabel = shop.querySelector('.ice-cream-name');
  const serveButton = shop.querySelector('[data-ice-action="serve"]');
  const removeButton = shop.querySelector('[data-ice-action="remove"]');
  const flavours = [
    {name:'Strawberry Blossom', colour:'#ed9cad'},
    {name:'Sunny Vanilla', colour:'#f8d979'},
    {name:'Blueberry Bloom', colour:'#a4b9e8'},
    {name:'Minty Meadow', colour:'#a9d8b6'},
    {name:'Chocolate Acorn', colour:'#b78565'},
    {name:'Lavender Cloud', colour:'#c9afe2'}
  ];
  const names = ['The Wobbly Blossom', 'Nancy\'s Maybe Sundae', 'The Squirrelly Swirl', 'The Meadow Bloom', 'The Giggleberry Surprise', 'The Very Silly Flower'];
  let scoops = [];
  const toppings = new Set();
  let sillyName = 'My meadow masterpiece';
  let nameIndex = 0;
  let celebrationTimer;

  function star(x, y, angle = 0) {
    const points = Array.from({length:10},(_,i) => {
      const radius = i % 2 ? 1.9 : 4.3;
      const a = -Math.PI / 2 + i * Math.PI / 5;
      return (Math.cos(a)*radius).toFixed(2)+','+(Math.sin(a)*radius).toFixed(2);
    }).join(' ');
    return `<g class="ice-chocolate-star" transform="translate(${x} ${y}) rotate(${angle})"><polygon points="${points}" transform="translate(.45 .7)" fill="#513124" opacity=".24"/><polygon points="${points}" fill="#80513b" stroke="#593525" stroke-width=".55" stroke-linejoin="round"/><path d="M-2.5 -1.1 -1.1 -1.5 0 -3.1 .7 -1.6" fill="none" stroke="#b98664" stroke-opacity=".8" stroke-width=".65" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  }
  function iceSugarFlower(x, y, angle, colour) {
    let flower = `<g class="ice-sugar-flower" transform="translate(${x} ${y}) rotate(${angle})"><ellipse cx=".4" cy="1.2" rx="4.2" ry="3.3" fill="#634331" opacity=".18"/>`;
    for (let petal=0;petal<5;petal++) flower += `<ellipse cx="0" cy="-2.1" rx="1.65" ry="2.4" transform="rotate(${petal*72})" fill="${colour}" stroke="#b7847844" stroke-width=".45"/>`;
    return flower + '<circle cx="0" cy="0" r="1.45" fill="#ecc265"/><path d="M-1.3 -3.2 -.9 -2.5" stroke="#fffaf0" stroke-opacity=".8" stroke-width=".8" stroke-linecap="round"/></g>';
  }
  function iceSprinkle(x, y, angle, colour, length = 4.6) {
    const half = length / 2;
    return `<g class="ice-sprinkle" transform="translate(${x} ${y}) rotate(${angle})"><path d="M${-half} .65H${half}" stroke="#634331" stroke-opacity=".2" stroke-width="2.1" stroke-linecap="round"/><path d="M${-half} 0H${half}" stroke="${colour}" stroke-width="1.7" stroke-linecap="round"/><path d="M${-half+.6} -.35H${half-.6}" stroke="#fff9ec" stroke-opacity=".45" stroke-width=".45" stroke-linecap="round"/></g>`;
  }
  function drawIceCream() {
    const top = 140;
    let svg = '<svg viewBox="0 0 280 340" role="img" aria-label="Your meadow ice cream"><ellipse cx="140" cy="322" rx="55" ry="7" fill="#284d3918"/><defs><clipPath id="ice-cone-clip"><path d="M100 200H180L141 318Z"/></clipPath><clipPath id="ice-petal-surface"><path d="M140 140C111 122 114 83 140 73C166 83 169 122 140 140Z"/></clipPath><clipPath id="ice-flower-centre"><circle cx="140" cy="140" r="24"/></clipPath></defs><path d="M100 200H180L141 318Z" fill="#dfb16a" stroke="#ae7c44" stroke-width="3" stroke-linejoin="round"/><g clip-path="url(#ice-cone-clip)" stroke="#b27e45" stroke-width="2" opacity=".65">';
    for(let i=0;i<7;i++) svg += `<path d="M75 ${190+i*23}l115 81M204 ${190+i*23}l-115 81"/>`;
    svg += '</g>';
    if (!scoops.length) {
      svg += '<g fill="none" stroke="#849c83" stroke-width="2" stroke-dasharray="4 5">';
      for (let petal=0; petal<10; petal++) svg += `<path d="M140 140C111 122 114 83 140 73C166 83 169 122 140 140Z" transform="rotate(${petal*36} 140 140)"/>`;
      svg += '</g><circle cx="140" cy="140" r="25" fill="#eef0e3"/><text x="140" y="136" text-anchor="middle" font-size="13" fill="#49664b" font-family="Georgia,serif">Pick a</text><text x="140" y="152" text-anchor="middle" font-size="13" fill="#49664b" font-family="Georgia,serif">flavour</text>';
    } else {
      svg += '<ellipse cx="140" cy="201" rx="40" ry="8" fill="#f5e7bf" stroke="#ae7c4455" stroke-width="2"/><g class="ice-flower">';
      for (let petal=0; petal<10; petal++) {
        const colour = flavours[scoops[petal % scoops.length]].colour;
        let petalSprinkles = '';
        if (toppings.has('sprinkles')) {
          const sprinkleColours = ['#db6383','#e5ac39','#5e9ab6','#9973b6','#fff3db','#76a87a'];
          const positions = [[132,95],[146,108],[138,123]];
          petalSprinkles = '<g clip-path="url(#ice-petal-surface)">';
          positions.forEach(([x,y],i) => {
            const offset = (petal % 3 - 1) * 1.5;
            petalSprinkles += iceSprinkle(x + offset, y + (petal % 2 ? 2 : -1), (petal * 73 + i * 61) % 180, sprinkleColours[(petal * 2 + i) % sprinkleColours.length], 4 + (petal + i) % 3 * .5);
          });
          petalSprinkles += '</g>';
        }
        let petalCandy = '';
        if (toppings.has('stars') || toppings.has('flowers')) {
          petalCandy = '<g clip-path="url(#ice-petal-surface)">';
          if (toppings.has('stars') && petal % 2 === 0) petalCandy += star(143, 96 + petal % 3 * 7, 17 + petal * 19);
          if (toppings.has('flowers') && petal % 2 === 1) petalCandy += iceSugarFlower(137, 101 + petal % 3 * 6, petal * 27, petal % 3 ? '#f5d3db' : '#fff1d5');
          petalCandy += '</g>';
        }
        svg += `<g transform="rotate(${petal*36} 140 140)"><path class="ice-flower-petal" d="M140 140C111 122 114 83 140 73C166 83 169 122 140 140Z" fill="${colour}" stroke="#6a604455" stroke-width="1.5"/><path d="M136 90Q125 103 132 118" fill="none" stroke="#ffffff55" stroke-width="4" stroke-linecap="round"/>${petalSprinkles}${petalCandy}</g>`;
      }
      svg += '<circle cx="140" cy="140" r="25" fill="#f8d979" stroke="#d2ac5c" stroke-width="2"/><g fill="#fff1b6"><circle cx="130" cy="132" r="3"/><circle cx="143" cy="128" r="2.5"/><circle cx="151" cy="138" r="3"/><circle cx="135" cy="145" r="2.5"/><circle cx="145" cy="151" r="2.5"/></g></g>';
    }
    if (scoops.length && toppings.has('sprinkles')) {
      const colours = ['#db6383','#5e9ab6','#fff3db','#9973b6','#76a87a','#e5ac39'];
      const positions = [[132,126,32],[146,125,109],[154,135,66],[143,137,151],[126,139,87],[131,151,18],[146,153,126],[154,146,38],[139,145,73]];
      svg += '<g clip-path="url(#ice-flower-centre)">';
      positions.forEach(([x,y,angle],i) => { svg += iceSprinkle(x,y,angle,colours[i % colours.length],4.2); });
      svg += '</g>';
    }
    if (scoops.length && (toppings.has('stars') || toppings.has('flowers'))) {
      svg += '<g clip-path="url(#ice-flower-centre)">';
      if (toppings.has('stars')) svg += star(130,132,-18) + star(150,144,28);
      if (toppings.has('flowers')) svg += iceSugarFlower(147,130,12,'#f5d3db') + iceSugarFlower(130,148,-24,'#fff1d5') + iceSugarFlower(143,151,35,'#f5d3db');
      svg += '</g>';
    }
    if (scoops.length && toppings.has('cherry')) {
      svg += '<defs><linearGradient id="ice-cherry-glaze" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e16c72"/><stop offset=".55" stop-color="#c64853"/><stop offset="1" stop-color="#93323f"/></linearGradient></defs><g class="ice-cherry"><g clip-path="url(#ice-petal-surface)"><ellipse cx="140" cy="78.5" rx="7" ry="2.1" fill="#764737" opacity=".27"/></g><path d="M140 62Q137 45 152 42" fill="none" stroke="#496644" stroke-width="2.1" stroke-linecap="round"/><path class="ice-cherry-fruit" d="M140 61C132 56 127 63 129 71C130 78 136 81 140 79C144 81 151 77 152 70C154 62 147 57 140 61Z" fill="url(#ice-cherry-glaze)" stroke="#9f3a43" stroke-width=".6"/><path d="M132.5 64Q131 67 133 69" fill="none" stroke="#ffe3d6" stroke-opacity=".75" stroke-width="1.6" stroke-linecap="round"/></g>';
    }
    svg+='</svg>';
    art.innerHTML=svg;
    art.querySelector('svg').setAttribute('aria-label', scoops.length ? 'Your flower-shaped ice cream, with petals made from: '+scoops.map(i=>flavours[i].name).join(', ') : 'An empty cone with a flower outline, ready for your first flavour');
    nameLabel.textContent=sillyName;
    shop.querySelector('.scoop-count').textContent=`${scoops.length} / 3 flavours`;
    serveButton.disabled=!scoops.length;
    removeButton.disabled=!scoops.length;
    shop.querySelectorAll('[data-ice-flavour]').forEach(button => button.disabled=scoops.length===3);
    shop.querySelectorAll('[data-ice-topping]').forEach(button => {
      const selected=toppings.has(button.dataset.iceTopping);
      button.setAttribute('aria-pressed',String(selected));
      button.classList.toggle('is-selected',selected);
    });
  }
  function clearServed() {shop.classList.remove('is-served');clearTimeout(celebrationTimer);}
  shop.querySelectorAll('[data-ice-flavour]').forEach(button => button.addEventListener('click',()=>{
    const index=Number(button.dataset.iceFlavour);
    if(scoops.length>=3 || !flavours[index])return;
    clearServed();scoops.push(index);drawIceCream();
    message.textContent=scoops.length===3?'Three flavours in one flower! Add toppings, or remove a flavour to try another.':flavours[index].name+' petals added. What else shall we try?';
  }));
  shop.querySelectorAll('[data-ice-topping]').forEach(button => button.addEventListener('click',()=>{
    clearServed();const topping=button.dataset.iceTopping;
    if(toppings.has(topping))toppings.delete(topping);else toppings.add(topping);
    drawIceCream();message.textContent='A little sprinkle of imagination. Choose as many toppings as you like!';
  }));
  shop.querySelector('[data-ice-action="name"]').addEventListener('click',()=>{
    clearServed();sillyName=names[nameIndex++%names.length];drawIceCream();message.textContent='Introducing... '+sillyName+'!';
  });
  removeButton.addEventListener('click',()=>{clearServed();scoops.pop();drawIceCream();message.textContent='Room for another possibility!';});
  shop.querySelector('[data-ice-action="reset"]').addEventListener('click',()=>{
    clearServed();scoops=[];toppings.clear();sillyName='My meadow masterpiece';drawIceCream();message.textContent='A fresh cone. What will you make this time?';
  });
  serveButton.addEventListener('click',()=>{
    if(!scoops.length)return;
    clearServed();void shop.offsetWidth;shop.classList.add('is-served');
    message.textContent='Nancy says: “I said no... but maybe one little taste of '+sillyName+'!”';
    celebrationTimer=setTimeout(()=>shop.classList.remove('is-served'),1600);
  });
  shop.querySelector('[data-ice-action="close"]').addEventListener('click',()=>shop.close());
  shop.addEventListener('click',event=>{
    if(event.target!==shop)return;
    const rect=shop.getBoundingClientRect();
    if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)shop.close();
  });
  shop.addEventListener('close',()=>{document.body.classList.remove('ice-shop-open');clearServed();});
  window.openMeadowIceCream=()=>{
    if(shop.open)return;
    drawIceCream();shop.showModal();shop.scrollTop=0;document.body.classList.add('ice-shop-open');
  };
  drawIceCream();
})();

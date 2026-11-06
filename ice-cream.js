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

  function star(x,y) {
    return `<path d="M${x} ${y-6}l2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z" fill="#77503c"/>`;
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
        svg += `<g transform="rotate(${petal*36} 140 140)"><path class="ice-flower-petal" d="M140 140C111 122 114 83 140 73C166 83 169 122 140 140Z" fill="${colour}" stroke="#6a604455" stroke-width="1.5"/><path d="M136 90Q125 103 132 118" fill="none" stroke="#ffffff55" stroke-width="4" stroke-linecap="round"/>${petalSprinkles}</g>`;
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
    if(scoops.length && toppings.has('stars')) for(let i=0;i<6;i++) svg+=star(116+i*11,top-12+(i%2)*23);
    if(scoops.length && toppings.has('flowers')) for(let i=0;i<4;i++) {
      const x=119+i*14,y=top-8+(i%2)*20;
      svg+=`<g fill="${i%2?'#ef9eae':'#fff0ba'}"><circle cx="${x-4}" cy="${y}" r="4"/><circle cx="${x+4}" cy="${y}" r="4"/><circle cx="${x}" cy="${y-4}" r="4"/><circle cx="${x}" cy="${y+4}" r="4"/></g><circle cx="${x}" cy="${y}" r="2.5" fill="#f5c84f"/>`;
    }
    if(scoops.length && toppings.has('cherry')) svg+=`<path d="M142 ${top-87}q-3-21 12-21" fill="none" stroke="#47734a" stroke-width="3"/><circle cx="140" cy="${top-86}" r="10" fill="#cb5558"/><circle cx="137" cy="${top-90}" r="2.5" fill="#ffffff77"/>`;
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

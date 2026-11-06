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
  const names = ['The Wobbly Flower Tower', 'Nancy\'s Maybe Sundae', 'The Squirrelly Swirl', 'The Meadow Mountain', 'The Giggleberry Surprise', 'The Very Silly Scoop'];
  let scoops = [];
  const toppings = new Set();
  let sillyName = 'My meadow masterpiece';
  let nameIndex = 0;
  let celebrationTimer;

  function star(x,y) {
    return `<path d="M${x} ${y-6}l2 4 5 1-4 3 1 5-4-2-4 2 1-5-4-3 5-1Z" fill="#77503c"/>`;
  }
  function drawIceCream() {
    const top = 176 - (scoops.length - 1) * 48;
    let svg = '<svg viewBox="0 0 280 340" role="img" aria-label="Your meadow ice cream"><ellipse cx="140" cy="322" rx="55" ry="7" fill="#284d3918"/><defs><clipPath id="ice-cone-clip"><path d="M100 200H180L141 318Z"/></clipPath></defs><path d="M100 200H180L141 318Z" fill="#dfb16a" stroke="#ae7c44" stroke-width="3" stroke-linejoin="round"/><g clip-path="url(#ice-cone-clip)" stroke="#b27e45" stroke-width="2" opacity=".65">';
    for(let i=0;i<7;i++) svg += `<path d="M75 ${190+i*23}l115 81M204 ${190+i*23}l-115 81"/>`;
    svg += '</g>';
    if (!scoops.length) svg += '<circle cx="140" cy="164" r="39" fill="none" stroke="#849c83" stroke-width="2" stroke-dasharray="5 7"/><text x="140" y="163" text-anchor="middle" font-size="14" fill="#49664b" font-family="Georgia,serif">Pick a scoop</text><text x="140" y="182" text-anchor="middle" font-size="17" fill="#49664b">✿</text>';
    scoops.forEach((index, layer) => {
      const y = 176 - layer*48;
      svg += `<g><circle cx="140" cy="${y}" r="39" fill="${flavours[index].colour}" stroke="#6a604455" stroke-width="2"/><path d="M108 ${y+20}q7 18 17 4 8 17 18 2 11 14 19-3 10 9 13-4" fill="${flavours[index].colour}" stroke="#6a604433" stroke-width="2"/><ellipse cx="126" cy="${y-17}" rx="12" ry="6" transform="rotate(-25 126 ${y-17})" fill="#ffffff44"/></g>`;
    });
    if (scoops.length && toppings.has('sprinkles')) {
      const colours=['#ee887b','#f3c94f','#79b1cb','#ad84be','#5eaa7e'];
      for(let i=0;i<17;i++) {const x=113+(i*17%55),y=top-20+(i*13%42);svg+=`<path d="M${x} ${y}l${i%2?4:-4} 5" stroke="${colours[i%5]}" stroke-width="3" stroke-linecap="round"/>`;}
    }
    if(scoops.length && toppings.has('stars')) for(let i=0;i<6;i++) svg+=star(116+i*11,top-12+(i%2)*23);
    if(scoops.length && toppings.has('flowers')) for(let i=0;i<4;i++) {
      const x=119+i*14,y=top-8+(i%2)*20;
      svg+=`<g fill="${i%2?'#ef9eae':'#fff0ba'}"><circle cx="${x-4}" cy="${y}" r="4"/><circle cx="${x+4}" cy="${y}" r="4"/><circle cx="${x}" cy="${y-4}" r="4"/><circle cx="${x}" cy="${y+4}" r="4"/></g><circle cx="${x}" cy="${y}" r="2.5" fill="#f5c84f"/>`;
    }
    if(scoops.length && toppings.has('cherry')) svg+=`<path d="M142 ${top-43}q-3-21 12-21" fill="none" stroke="#47734a" stroke-width="3"/><circle cx="140" cy="${top-42}" r="10" fill="#cb5558"/><circle cx="137" cy="${top-46}" r="2.5" fill="#ffffff77"/>`;
    svg+='</svg>';
    art.innerHTML=svg;
    art.querySelector('svg').setAttribute('aria-label', scoops.length ? 'Your ice cream: '+scoops.map(i=>flavours[i].name).join(', ') : 'An empty cone, ready for your first scoop');
    nameLabel.textContent=sillyName;
    shop.querySelector('.scoop-count').textContent=`${scoops.length} / 3 scoops`;
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
    message.textContent=scoops.length===3?'Three lovely scoops! Add toppings, or remove the top scoop to try another.':flavours[index].name+' added. What else shall we try?';
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

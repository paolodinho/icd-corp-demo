(function(){
  var toggle=document.querySelector('.menu-toggle'),drawer=document.querySelector('.drawer');
  if(toggle&&drawer){
    toggle.addEventListener('click',function(){var open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));drawer.classList.toggle('open',!open);document.body.classList.toggle('menu-open',!open)});
    drawer.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){toggle.setAttribute('aria-expanded','false');drawer.classList.remove('open');document.body.classList.remove('menu-open')})});
  }
  var mm=document.querySelector('.mbar__menu');
  if(mm&&toggle){mm.addEventListener('click',function(){toggle.click();mm.setAttribute('aria-expanded',toggle.getAttribute('aria-expanded'))})}
  var slides=[].slice.call(document.querySelectorAll('.hero-slide')),dots=[].slice.call(document.querySelectorAll('.hero-dot')),count=document.querySelector('.hero-count'),cur=0,timer;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function show(i){cur=(i+slides.length)%slides.length;slides.forEach(function(s,n){s.classList.toggle('active',n===cur)});dots.forEach(function(d,n){d.classList.toggle('active',n===cur)});if(count)count.textContent=('0'+(cur+1)).slice(-2)+' / '+('0'+slides.length).slice(-2)}
  function auto(){clearInterval(timer);if(!reduce&&slides.length>1)timer=setInterval(function(){show(cur+1)},5600)}
  if(slides.length){dots.forEach(function(d,i){d.addEventListener('click',function(){show(i);auto()})});auto()}
  var hb=document.querySelector('.hero-badge'),hi=hb?[].slice.call(hb.querySelectorAll('li')):[];
  if(hb&&hi.length>1){
    var nv=document.createElement('div');nv.className='hero-badge__nav';nv.innerHTML='<button type="button" class="hb-up" aria-label="Previous"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 15l6-6 6 6"/></svg></button><span class="hb-count"></span><button type="button" class="hb-down" aria-label="Next"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>';hb.appendChild(nv);
    var cnt=nv.querySelector('.hb-count'),bi=-1,bt;
    function go(n,dir){var p=bi;bi=(n+hi.length)%hi.length;hb.classList.toggle('rev',dir<0);if(p>-1&&p!==bi){hi[p].classList.remove('active');hi[p].classList.add('leave');(function(el){setTimeout(function(){el.classList.remove('leave')},700)})(hi[p])}hi[bi].classList.add('active');cnt.textContent=(bi+1)+'/'+hi.length}
    function loop(){clearInterval(bt);if(!reduce)bt=setInterval(function(){go(bi+1,1)},4800)}
    nv.querySelector('.hb-up').addEventListener('click',function(){go(bi-1,-1);loop()});
    nv.querySelector('.hb-down').addEventListener('click',function(){go(bi+1,1);loop()});
    hb.classList.add('js');go(0,1);loop();
  }
  var els=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!reduce){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});els.forEach(function(el){io.observe(el)})}
  else els.forEach(function(el){el.classList.add('in')});
  var lbs=[].slice.call(document.querySelectorAll('[data-lightbox]'));
  if(lbs.length){
    var lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.innerHTML='<button class="lb__x" aria-label="Close">×</button><button class="lb__p" aria-label="Prev">‹</button><img alt=""><button class="lb__n" aria-label="Next">›</button><div class="lb__c"></div>';document.body.appendChild(lb);
    var li=lb.querySelector('img'),lc=lb.querySelector('.lb__c'),group=[],gi=0;
    function open(a){group=[].slice.call(a.closest('.album').querySelectorAll('[data-lightbox]'));gi=group.indexOf(a);show();lb.classList.add('open');document.body.style.overflow='hidden'}
    function show(){li.src=group[gi].href;lc.textContent=(gi+1)+' / '+group.length}
    function step(d){gi=(gi+d+group.length)%group.length;show()}
    function close(){lb.classList.remove('open');document.body.style.overflow='';li.removeAttribute('src')}
    lbs.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();open(a)})});
    lb.querySelector('.lb__x').onclick=close;lb.querySelector('.lb__p').onclick=function(){step(-1)};lb.querySelector('.lb__n').onclick=function(){step(1)};
    lb.addEventListener('click',function(e){if(e.target===lb)close()});
    addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')step(1);if(e.key==='ArrowLeft')step(-1)});
  }
  var aip=document.getElementById('ai-sum'),aib=document.querySelector('[data-ai-open]');
  if(aip&&aib){
    var body=aip.querySelector('.ai-sum__body'),loaded=false;
    function render(items){body.innerHTML='';var ul=document.createElement('ul');items.forEach(function(t){var li=document.createElement('li');li.textContent=t;ul.appendChild(li)});body.appendChild(ul)}
    function load(){
      if(loaded)return;var key='icdai:'+aip.dataset.lang+':'+aip.dataset.post;
      try{var c=sessionStorage.getItem(key);if(c){render(JSON.parse(c));loaded=true;return}}catch(e){}
      body.innerHTML='<p class="ai-sum__load"><i></i><i></i><i></i></p>';
      fetch(aip.dataset.api+(aip.dataset.api.indexOf('?')>-1?'&':'?')+'id='+aip.dataset.post+'&lang='+aip.dataset.lang).then(function(r){return r.json()}).then(function(d){
        if(d&&d.ok){render(d.items);loaded=true;try{sessionStorage.setItem(key,JSON.stringify(d.items))}catch(e){}}else{body.innerHTML='<p class="ai-sum__err"></p>';body.firstChild.textContent=aip.dataset.err}
      }).catch(function(){body.innerHTML='<p class="ai-sum__err"></p>';body.firstChild.textContent=aip.dataset.err});
    }
    aib.addEventListener('click',function(){aip.hidden=false;load();aip.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'})});
    aip.querySelector('[data-ai-close]').addEventListener('click',function(){aip.hidden=true});
  }
  var toc=document.querySelector('.toc');
  if(toc&&'IntersectionObserver' in window){
    var tl=[].slice.call(toc.querySelectorAll('a')),hs=tl.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))}).filter(Boolean);
    var tio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){tl.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-90px 0px -70% 0px'});
    hs.forEach(function(h){tio.observe(h)});
    if(innerWidth<1100){var dt=toc.querySelector('details');if(dt)dt.removeAttribute('open')}
  }
  var ct=document.getElementById('ct-topic'),cp=document.querySelector('.ct-position');
  if(ct&&cp){var sync=function(){cp.hidden=ct.value!=='Tuyển dụng'};ct.addEventListener('change',sync);sync()}
  var back=document.querySelector('.backtop');
  if(back){addEventListener('scroll',function(){back.classList.toggle('show',scrollY>650)},{passive:true});back.addEventListener('click',function(){scrollTo({top:0,behavior:'smooth'})})}
})();

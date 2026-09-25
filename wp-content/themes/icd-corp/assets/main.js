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

/* Chống chữ mồ côi (1 từ trên 1 dòng) - dán vào JS của mọi site.
   Nối bằng NBSP từ cuối cùng với từ liền trước trong mọi tiêu đề, đoạn, mục danh sách, nút, chú thích.
   Đi kèm CSS: h1..h6,.title{text-wrap:balance} p,li,figcaption{text-wrap:pretty} */
(function () {
  var SEL = 'h1,h2,h3,h4,h5,h6,p,li,figcaption,blockquote,dd,dt,.btn,.kicker,[data-nowrap-tail]';
  function glue(root) {
    (root || document).querySelectorAll(SEL).forEach(function (el) {
      if (el.dataset.orphanDone) return;
      var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), last = null, n;
      while ((n = w.nextNode())) if (n.nodeValue.trim()) last = n;
      if (!last) return;
      var t = last.nodeValue.replace(/\s+$/, ''), m = t.match(/^([\s\S]*\S)\s+(\S+)$/);
      if (m && /\S\s+\S/.test(t)) last.nodeValue = m[1] + ' ' + m[2] + last.nodeValue.slice(t.length);
      else if (last.previousSibling === null && last.parentNode !== el) return; /* từ cuối nằm riêng trong thẻ con: bỏ qua */
      el.dataset.orphanDone = '1';
    });
  }
  if (document.readyState !== 'loading') glue(); else document.addEventListener('DOMContentLoaded', function () { glue(); });
  window.icdGlueOrphans = glue;
})();

/* Tiếng Trung: tách theo từ (Intl.Segmenter) rồi giữ nguyên từ trên một dòng, tránh ngắt giữa "绿色" hay "解决方案" */
(function () {
  if (document.documentElement.lang !== 'zh-CN' || typeof Intl === 'undefined' || !Intl.Segmenter) return;
  var seg = new Intl.Segmenter('zh', { granularity: 'word' });
  var SEL = 'h1,h2,h3,h4,.kicker,.btn,figcaption,li,p,dt,dd,.abs-chip,.abs-logo__cap b,.abs-logo__cap em,.abs-num__item span,.overview__item span,.abs-flow__card span,.abs-flow__card b';
  document.querySelectorAll(SEL).forEach(function (el) {
    if (el.closest('.article__body,.gallery-content,.toc')) return;
    var dsp = getComputedStyle(el).display; if (dsp.indexOf('flex') > -1 || dsp.indexOf('grid') > -1) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), n, nodes = [];
    while ((n = w.nextNode())) if (/[一-鿿]/.test(n.nodeValue) && n.parentNode.tagName !== 'SCRIPT' && !n.parentNode.classList.contains('zh-w')) nodes.push(n);
    nodes.forEach(function (t) {
      var text = t.nodeValue; if (text.length > 260) return;
      var frag = document.createDocumentFragment();
      for (var s of seg.segment(text)) {
        if (s.isWordLike && /[一-鿿]/.test(s.segment) && s.segment.length > 1) { var sp = document.createElement('span'); sp.className = 'zh-w'; sp.textContent = s.segment; frag.appendChild(sp); }
        else frag.appendChild(document.createTextNode(s.segment));
      }
      t.parentNode.replaceChild(frag, t);
    });
  });
})();

/* Thư viện ảnh: mục lục nhảy album + gấp gọn mỗi album còn 8 ảnh, bấm để xem thêm */
(function(){
  var g=document.querySelector('.gallery-content');if(!g)return;
  var lang=(document.documentElement.lang||'vi').slice(0,2);
  var L={vi:['Xem thêm %d ảnh','Thu gọn','Chuyển nhanh đến album'],en:['Show %d more photos','Show less','Jump to album'],zh:['查看更多 %d 张照片','收起','快速跳转相册']}[lang]||['Xem thêm %d ảnh','Thu gọn','Chuyển nhanh đến album'];
  var KEEP=8,heads=[].slice.call(g.querySelectorAll('h2'));
  if(heads.length>1){
    var nav=document.createElement('nav');nav.className='album-nav';nav.setAttribute('aria-label',L[2]);
    heads.forEach(function(h,i){h.id=h.id||'album-'+(i+1);var a=document.createElement('a');a.href='#'+h.id;a.textContent=h.textContent;nav.appendChild(a)});
    g.insertBefore(nav,g.firstChild);
  }
  [].forEach.call(g.querySelectorAll('.album'),function(al){
    var n=al.querySelectorAll('.album__item').length;if(n<=KEEP+2)return;
    al.classList.add('album--fold');
    var b=document.createElement('button');b.type='button';b.className='album-more';b.textContent=L[0].replace('%d',n-KEEP);
    b.addEventListener('click',function(){var o=al.classList.toggle('album--open');b.textContent=o?L[1]:L[0].replace('%d',n-KEEP);b.setAttribute('aria-expanded',o)});
    al.parentNode.insertBefore(b,al.nextSibling);
  });
})();

/* Tìm kiếm cho BẢN DEMO tĩnh (GitHub Pages): site thật dùng tìm kiếm WordPress. */
(function(){
  var base=document.currentScript.src.replace(/demo-search\.js.*$/,'');
  var m=location.pathname.match(/\/(en|zh)(\/|$)/),lang=m?m[1]:'vi',data=null;
  var T={vi:['Kết quả cho','Không tìm thấy kết quả phù hợp.','Đóng'],en:['Results for','No results found.','Close'],zh:['搜索结果:','未找到相关结果。','关闭']}[lang];
  function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d')}
  function load(cb){if(data)return cb();var x=new XMLHttpRequest();x.open('GET',base+'search-index.json');x.onload=function(){data=JSON.parse(x.responseText);cb()};x.send()}
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function show(q){
    var words=norm(q).split(/\s+/).filter(Boolean),list=(data[lang]||[]).map(function(it){var t=norm(it.t),e=norm(it.e),sc=0;
      for(var i=0;i<words.length;i++){if(t.indexOf(words[i])>-1)sc+=3;else if(e.indexOf(words[i])>-1)sc+=1;else return null}return{it:it,sc:sc}}).filter(Boolean).sort(function(a,b){return b.sc-a.sc}).slice(0,20);
    var o=document.getElementById('demo-search')||document.createElement('div');o.id='demo-search';
    o.style.cssText='position:fixed;inset:0;z-index:9999;background:rgba(6,30,18,.72);overflow:auto;padding:5vh 16px';
    o.innerHTML='<div style="max-width:760px;margin:0 auto;background:#fff;padding:24px 26px;font:400 16px/1.5 Be Vietnam Pro,sans-serif"><div style="display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:14px"><b style="font-size:18px">'+T[0]+' “'+esc(q)+'” ('+list.length+')</b><button type="button" style="border:1px solid #1F8A4C;background:#fff;color:#1F8A4C;padding:8px 14px;cursor:pointer">'+T[2]+'</button></div>'+
      (list.length?list.map(function(r){return'<a href="'+base+r.it.u+'" style="display:block;padding:12px 0;border-top:1px solid #DEE5E0;color:#16241C;text-decoration:none"><b style="display:block;font-size:16px">'+esc(r.it.t)+'</b><span style="color:#5A6B62;font-size:14px">'+esc(r.it.e)+'</span></a>'}).join(''):'<p>'+T[1]+'</p>')+'</div>';
    document.body.appendChild(o);o.querySelector('button').onclick=function(){o.remove()};o.onclick=function(e){if(e.target===o)o.remove()};
  }
  document.addEventListener('submit',function(e){var f=e.target;if(!f.matches||!f.matches('.topbar__search,.drawer__search'))return;e.preventDefault();var q=f.querySelector('input[name=s]').value.trim();if(q)load(function(){show(q)})},true);
})();

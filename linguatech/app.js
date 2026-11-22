(function(){
  var h=document.querySelector('header'),menu=document.getElementById('menu'),bur=document.getElementById('burger');
  function setH(){if(h)document.documentElement.style.setProperty('--hh',h.getBoundingClientRect().bottom+'px')}
  addEventListener('scroll',function(){h.classList.toggle('shrink',scrollY>30);setH()},{passive:true});
  addEventListener('resize',setH);setH();
  if(bur){
    bur.addEventListener('click',function(){setH();var o=menu.classList.toggle('open');bur.setAttribute('aria-expanded',o)});
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');bur.setAttribute('aria-expanded','false')})});
  }

  /* reveal */
  var rv=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
      var s=[].filter.call(e.target.parentNode.children,function(c){return c.classList.contains('rv')});
      e.target.style.transitionDelay=(s.indexOf(e.target)%4*90)+'ms';e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    rv.forEach(function(e){io.observe(e)});
  }else rv.forEach(function(e){e.classList.add('in')});

  /* counters */
  var cs=document.querySelectorAll('[data-count]');
  function run(el){var t=+el.dataset.count,suf=el.dataset.suf||'',t0=null;
    function f(ts){if(!t0)t0=ts;var p=Math.min((ts-t0)/1400,1);el.textContent=Math.round(t*(1-Math.pow(1-p,3)))+suf;if(p<1)requestAnimationFrame(f)}
    requestAnimationFrame(f)}
  if('IntersectionObserver' in window){
    var ic=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){run(e.target);ic.unobserve(e.target)}})},{threshold:.5});
    cs.forEach(function(c){ic.observe(c)});
  }else cs.forEach(function(c){c.textContent=c.dataset.count+(c.dataset.suf||'')});

  /* slider */
  var sl=document.querySelector('.slider');
  if(sl){
    var slides=sl.querySelectorAll('.slide'),dots=sl.querySelectorAll('.dots button'),i=0,tm;
    function go(n){i=(n+slides.length)%slides.length;
      slides.forEach(function(s,k){s.classList.toggle('on',k===i);s.setAttribute('aria-hidden',k!==i)});
      dots.forEach(function(d,k){d.classList.remove('on');void d.offsetWidth;d.classList.toggle('on',k===i)});
      clearTimeout(tm);if(!matchMedia('(prefers-reduced-motion:reduce)').matches)tm=setTimeout(function(){go(i+1)},6000)}
    sl.querySelector('.prev').addEventListener('click',function(){go(i-1)});
    sl.querySelector('.next-s').addEventListener('click',function(){go(i+1)});
    dots.forEach(function(d,k){d.addEventListener('click',function(){go(k)})});
    var x0=null;
    sl.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
    sl.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(i+(dx<0?1:-1));x0=null});
    go(0);
  }

  /* tabs built from data */
  document.querySelectorAll('[data-tabs]').forEach(function(box){
    var data=window[box.dataset.tabs];if(!data)return;
    var bar=box.querySelector('.tabs'),panel=box.querySelector('.tabpanel');
    Object.keys(data).forEach(function(k,n){var b=document.createElement('button');b.type='button';b.textContent=k;if(!n)b.className='on';bar.appendChild(b);
      b.addEventListener('click',function(){bar.querySelectorAll('button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');show(k)})});
    function show(k){panel.innerHTML='';data[k].forEach(function(it,j){var d=document.createElement('div');d.className='item';d.style.animationDelay=(j*60)+'ms';
      d.innerHTML='<div class="em" aria-hidden="true">'+it[0]+'</div><div><h4></h4><p></p></div>';d.querySelector('h4').textContent=it[1];d.querySelector('p').textContent=it[2];panel.appendChild(d)})}
    show(Object.keys(data)[0]);
  });

  /* form: preselect from ?c= is not allowed in all hosts, use hash */
  var f=document.querySelector('form[name=inscription]');
  if(f){
    var hs=location.hash.replace('#','');
    if(hs){var r=f.querySelector('input[name=categorie][value="'+hs+'"]');if(r)r.checked=true}
    if(!/netlify\.app$|jinhaigrp\.com$/.test(location.hostname)){
      f.addEventListener('submit',function(e){e.preventDefault();document.getElementById('fnote').classList.add('show')});
    }
  }
})();

// NAV scroll
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  ham.addEventListener('click', () => mob.classList.toggle('open'));
  function closeMob(){ mob.classList.remove('open'); }

  // Reveal
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e,i) => { if(e.isIntersecting){ setTimeout(() => e.target.classList.add('visible'), i*60); obs.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(r => obs.observe(r));

  // -- HERO CAROUSEL --
  const hTrack = document.getElementById('hcarTrack');
  const hSlides = hTrack.querySelectorAll('.hcar-slide');
  const hDotsWrap = document.getElementById('hcarDots');
  let hIdx = 0, hAuto;
  hSlides.forEach((_,i) => {
    const d = document.createElement('button');
    d.className = 'hcar-dot' + (i===0?' active':'');
    d.addEventListener('click', () => hGo(i));
    hDotsWrap.appendChild(d);
  });
  function hGo(n){
    hIdx = (n + hSlides.length) % hSlides.length;
    hTrack.style.transform = `translateX(-${hIdx*100}%)`;
    document.querySelectorAll('.hcar-dot').forEach((d,i) => d.classList.toggle('active', i===hIdx));
    resetHAuto();
  }
  function resetHAuto(){ clearInterval(hAuto); hAuto = setInterval(() => hGo(hIdx+1), 4500); }
  document.getElementById('hcarPrev').addEventListener('click', () => hGo(hIdx-1));
  document.getElementById('hcarNext').addEventListener('click', () => hGo(hIdx+1));
  resetHAuto();

  // -- VIDEO CAROUSEL --
  const vTrack = document.getElementById('vcarTrack');
  let vIdx = 0;
  function getVVisible(){ return window.innerWidth < 720 ? 1 : window.innerWidth < 960 ? 2 : 3; }
  function vGo(dir){
    const slides = vTrack.querySelectorAll('.vcar-slide');
    const vis = getVVisible();
    const max = slides.length - vis;
    vIdx = Math.max(0, Math.min(vIdx + dir, max));
    const w = vTrack.querySelector('.vcar-slide').offsetWidth + 20;
    vTrack.style.transform = `translateX(-${vIdx * w}px)`;
  }
  document.getElementById('vcarPrev').addEventListener('click', () => vGo(-1));
  document.getElementById('vcarNext').addEventListener('click', () => vGo(1));
  window.addEventListener('resize', () => { vIdx=0; vTrack.style.transform=''; });

  // Video modal
  function openVideo(url){ document.getElementById('vidFrame').src = url + '?autoplay=1'; document.getElementById('vidModal').classList.add('open'); }
  function closeVideo(){ document.getElementById('vidModal').classList.remove('open'); document.getElementById('vidFrame').src = ''; }
  document.getElementById('vidModal').addEventListener('click', function(e){ if(e.target===this) closeVideo(); });

  // -- GALLERY --
  const galItems = document.querySelectorAll('.gal-item');
  let lbItems = [], lbCur = 0;
  document.querySelectorAll('.gal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.gal-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.gal;
      galItems.forEach(item => {
        const match = cat==='all' || item.dataset.cat===cat;
        item.style.display = match ? '' : 'none';
        if(match){ item.style.animation='none'; requestAnimationFrame(() => { item.style.animation=''; }); }
      });
    });
  });
  galItems.forEach((item, i) => {
    item.addEventListener('click', () => {
      lbItems = [...document.querySelectorAll('.gal-item[style=""], .gal-item:not([style])')].filter(el => el.style.display !== 'none');
      lbCur = lbItems.indexOf(item);
      if(lbCur === -1){ lbItems = [...galItems]; lbCur = i; }
      showLb();
    });
  });
  function showLb(){
    const item = lbItems[lbCur];
    document.getElementById('lbImg').src = item.dataset.img;
    document.getElementById('lbCap').textContent = item.dataset.label || '';
    document.getElementById('lightbox').classList.add('open');
  }
  function lbNav(dir){ lbCur = (lbCur + dir + lbItems.length) % lbItems.length; showLb(); }
  function closeLb(){ document.getElementById('lightbox').classList.remove('open'); }
  document.getElementById('lightbox').addEventListener('click', function(e){ if(e.target===this) closeLb(); });

  // Facilities tabs
  document.querySelectorAll('.fac-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.fac-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.fac-group').forEach(g => g.classList.remove('active'));
      tab.classList.add('active');
      const grp = document.getElementById('g-' + tab.dataset.group);
      grp.classList.add('active');
      grp.querySelectorAll('.fac-item').forEach((el,i) => {
        el.style.opacity=0; el.style.transform='translateY(14px)';
        setTimeout(() => { el.style.transition='opacity .35s ease,transform .35s ease'; el.style.opacity=1; el.style.transform='none'; }, i*55);
      });
    });
  });

  // Keyboard escape
  document.addEventListener('keydown', e => { if(e.key==='Escape'){ closeVideo(); closeLb(); } });


const bootMsgs=[
  '$ initializing environment...',
  '$ loading developer: Abdullah Iqbal',
  '$ mounting React/Node.js/PHP stack... <span style="color:#00ff88">OK</span>',
  '$ importing 17 skills... <span style="color:#00ff88">OK</span>',
  '$ loading 6 projects... <span style="color:#00ff88">OK</span>',
  '$ brewing coffee... <span style="color:#ff9830">INFINITE</span>',
  '$ entering first-person mode... <span style="color:#00d4ff">IMMERSIVE ✓</span>',
];
const bootEl=document.getElementById('boot-lines');
bootMsgs.forEach((msg,i)=>{
  const p=document.createElement('p');
  p.className='bl';
  p.innerHTML=msg;
  p.style.animationDelay=(i*.28+.5)+'s';
  bootEl.appendChild(p);
});
setTimeout(()=>document.getElementById('boot').classList.add('gone'), bootMsgs.length*280+1200);


// CURSOR
const cur=document.getElementById('cur');
const dot=document.getElementById('dot');
let mx=0,my=0,dx=0,dy=0;

document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cur.style.left=mx+'px';cur.style.top=my+'px';
  handleParallax(e);
  handleTooltip(e);
});

// Smooth dot trail
(function trailLoop(){
  dx+=(mx-dx)*.12;dy+=(my-dy)*.12;
  dot.style.left=dx+'px';dot.style.top=dy+'px';
  requestAnimationFrame(trailLoop);
})();

// Cursor hover state
document.querySelectorAll('[onclick],[href],button,a').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('on'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('on'));
});

// Click ripple
document.addEventListener('click',e=>{
  const r=document.createElement('div');
  r.className='rpl';
  r.style.left=e.clientX+'px';r.style.top=e.clientY+'px';
  document.body.appendChild(r);
  setTimeout(()=>r.remove(),560);
});

// PARALLAX LOOK-AROUND

const layers=document.querySelectorAll('.lyr');
const MAX=28; 

function handleParallax(e){
  const nx=(e.clientX/window.innerWidth-.5); 
  const ny=(e.clientY/window.innerHeight-.5);
  layers.forEach(l=>{
    const d=parseFloat(l.dataset.d||0);
    const sx=-nx*d*MAX*2;
    const sy=-ny*d*MAX*1.2;
    l.style.transform=`translate(${sx}px,${sy}px)`;
  });
}

// TOOLTIP
const tip=document.getElementById('tip');
function handleTooltip(e){
  const t=e.target.closest('[title]');
  if(t&&t.title&&!t.closest('.ovl')){
    tip.textContent='[ '+t.title+' ]';
    tip.classList.add('on');
    tip.style.left=(e.clientX+18)+'px';
    tip.style.top=(e.clientY-12)+'px';
  } else {
    tip.classList.remove('on');
  }
}

// OVERLAY SYSTEM
function open_(name){
  document.getElementById('ovl-'+name)?.classList.add('show');
}
function close_(name){
  document.getElementById('ovl-'+name)?.classList.remove('show');
}

// Click backdrop to close
document.querySelectorAll('.ovl').forEach(o=>{
  o.addEventListener('click',e=>{ if(e.target===o) o.classList.remove('show'); });
});

// ESC to close
document.addEventListener('keydown',e=>{
  if(e.key==='Escape') document.querySelectorAll('.ovl.show').forEach(o=>o.classList.remove('show'));
});

//  KEYBOARD ANIMATION
const allKeys=[...document.querySelectorAll('.k')];
const staticLit=['kE','kS','kA','kN','kB'];
staticLit.forEach(id=>document.getElementById(id)?.classList.add('lit'));

// Random key tap
setInterval(()=>{
  const k=allKeys[Math.floor(Math.random()*allKeys.length)];
  if(!staticLit.includes(k.id)){
    k.classList.add('lit');
    setTimeout(()=>k.classList.remove('lit'),110);
  }
},190);

// HAND TYPING ANIMATION
const hnds=[...document.querySelectorAll('.hnd')];
let phase=0;
(function handLoop(){
  phase+=.03;
  hnds[0].style.transform=`translateY(${Math.sin(phase)*2.5}px)`;
  hnds[1].style.transform=`translateY(${Math.sin(phase+Math.PI*.65)*2.5}px)`;
  requestAnimationFrame(handLoop);
})();

//  RAIN DROPS
const winEl=document.getElementById('win');
function spawnRain(){
  const r=document.createElement('div');
  r.className='raindrop';
  const h=clamp(8,1.5,20);
  r.style.cssText=`
    left:${Math.random()*100}%;
    height:${h}px;
    animation-duration:${.4+Math.random()*.5}s;
    animation-delay:${Math.random()*2}s;
  `;
  winEl.appendChild(r);
  setTimeout(()=>r.remove(),2000);
}
function clamp(a,b,c){return Math.max(a,Math.min(c,b))}
setInterval(spawnRain,180);

const wallLyr=document.getElementById('lyr-wall');
function spawnDust(){
  const d=document.createElement('div');
  d.className='dust';
  const sz=Math.random()*2+.8;
  d.style.cssText=`
    width:${sz}px;height:${sz}px;
    left:${50+Math.random()*15}%;
    top:${25+Math.random()*30}%;
    animation-duration:${6+Math.random()*8}s;
    animation-delay:${Math.random()*2}s;
    opacity:${Math.random()*.5};
  `;
  wallLyr.appendChild(d);
  setTimeout(()=>d.remove(),18000);
}
setInterval(spawnDust,700);

const wGlow=document.getElementById('wall-glow');
function flicker(){
  const v=.85+Math.random()*.3;
  wGlow.style.opacity=v;
  setTimeout(flicker,1800+Math.random()*3500);
}
flicker();

//   CONTACT FORM
function sendMsg(){
  const btn=document.querySelector('.csend');
  btn.innerHTML='<i class="fas fa-check"></i> Sent! (wire up backend to activate)';
  btn.style.background='linear-gradient(135deg,#00aa55,#007733)';
  setTimeout(()=>{
    btn.innerHTML='<i class="fas fa-paper-plane"></i> Send Message';
    btn.style.background='';
  },3000);
}

document.addEventListener('contextmenu',e=>e.preventDefault());



// Lamp Day/Night Context
window.toggleDayNight = function() {
    const isDay = document.documentElement.getAttribute('data-theme') === 'day';
    document.documentElement.setAttribute('data-theme', isDay ? 'night' : 'day');
    
    // Toggle actual lamp light objects
    const cone = document.getElementById('lamp-cone');
    const glow = document.getElementById('wall-glow');
    if (cone) cone.style.display = isDay ? 'block' : 'none';
    if (glow) glow.style.display = isDay ? 'block' : 'none';
};

// Lofi Radio
let audio = null;
window.toggleRadio = function() {
    const anim = document.getElementById('r-anim');
    const label = document.querySelector('#radio-player .hlabel');
    if (!audio) {
        audio = new Audio('https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3');
        audio.loop = true;
    }
    if (audio.paused) {
        audio.play();
        anim.classList.add('playing');
        label.innerHTML = '📻 Lo-Fi (Click to Pause)';
    } else {
        audio.pause();
        anim.classList.remove('playing');
        label.innerHTML = '📻 Lo-Fi (Click to Play)';
    }
};

// Weather
window.toggleWeather = function() {
    if (document.body.classList.contains('raining')) {
        document.body.classList.remove('raining');
        document.body.classList.remove('lightning-active');
    } else {
        document.body.classList.add('raining');
        triggerLightning();
    }
};

function triggerLightning() {
    if (!document.body.classList.contains('raining')) return;
    setTimeout(() => {
        document.body.classList.add('lightning-active');
        setTimeout(() => document.body.classList.remove('lightning-active'), 400);
        if (document.body.classList.contains('raining')) {
            triggerLightning();
        }Reaso
    }, 4000 + Math.random() * 12000);
}

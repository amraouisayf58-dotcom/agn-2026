'use strict';
const $ = id => document.getElementById(id);
const canvas=$('field'), ctx=canvas.getContext('2d');
let high=0; try { const saved=Number(localStorage.getItem('agn-record'));high=Number.isFinite(saved)&&saved>=0?Math.floor(saved):0; } catch(_) {}
let score=0,lives=3,time=60,x=200,items=[],spawn=0,last=0,active=false,paused=false,frame=0,keys={left:false,right:false};
$('record').textContent=high;
function show(id){document.body.classList.toggle('playing',id==='play');for(const name of ['home','play','result']) $(name).classList.toggle('hidden',name!==id);if(id==='play')fitField();}
function hud(){ $('score').textContent=score+' pts';$('lives').textContent=Array(lives).fill('♥').join(' ');$('clock').textContent=Math.ceil(time)+' s'; }
function start(){cancelAnimationFrame(frame);score=0;lives=3;time=60;x=200;items=[];spawn=0;last=0;keys.left=keys.right=false;active=true;paused=false;$('pause').textContent='Pause';$('announcement').textContent='';show('play');hud();frame=requestAnimationFrame(tick);}
function end(){active=false;cancelAnimationFrame(frame);if(score>high){high=score;try{localStorage.setItem('agn-record',String(high));}catch(_){}}$('record').textContent=high;$('finalScore').textContent=score+' points';$('finalRecord').textContent='Meilleur score : '+high+' points';show('result');}
function home(){active=false;cancelAnimationFrame(frame);show('home');}
window.pauseGame=()=>{if(active&&!paused){paused=true;keys.left=keys.right=false;$('pause').textContent='Reprendre';$('announcement').textContent='Partie en pause';}};
function togglePause(){if(!active)return;if(paused){paused=false;last=0;$('pause').textContent='Pause';$('announcement').textContent='';frame=requestAnimationFrame(tick);}else window.pauseGame();}
function draw(){ctx.clearRect(0,0,400,520);ctx.fillStyle='#c8e4d2';for(let i=0;i<6;i++)ctx.fillRect(i*80,0,1,520);ctx.fillStyle='#b5d8c2';ctx.fillRect(0,477,400,43);ctx.font='30px system-ui';ctx.textAlign='center';for(const item of items)ctx.fillText(item.bad?'🚧':'📦',item.x,item.y+10);ctx.fillStyle='#174f3d';ctx.fillRect(x-34,451,68,32);ctx.strokeStyle='#63e6b0';ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,452,20,Math.PI,0);ctx.stroke();ctx.fillStyle='#e9fff2';ctx.font='bold 13px system-ui';ctx.fillText('AGN',x,473);}
function tick(t){if(!active||paused)return;const dt=last?Math.min((t-last)/1000,.05):0;last=t;time=Math.max(0,time-dt);if(keys.left)x-=300*dt;if(keys.right)x+=300*dt;x=Math.max(35,Math.min(365,x));spawn+=dt;const elapsed=60-time;if(spawn>=Math.max(.38,.85-elapsed*.007)){spawn=0;items.push({x:25+Math.random()*350,y:-30,bad:Math.random()<.25,v:110+elapsed*2});}
for(let i=items.length-1;i>=0;i--){const item=items[i];item.y+=item.v*dt;if(item.y>=436&&item.y<=491&&Math.abs(item.x-x)<46){items.splice(i,1);if(item.bad){lives--; $('announcement').textContent='Obstacle ! Il reste '+lives+' vies.';}else{score+=10;}if(lives<=0){hud();end();return;}}else if(item.y>550)items.splice(i,1);}
hud();draw();if(time<=0){end();return;}frame=requestAnimationFrame(tick);}
function move(e){if(!active||paused)return;const r=canvas.getBoundingClientRect();x=Math.max(35,Math.min(365,(e.clientX-r.left)*400/r.width));draw();}
canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);move(e);});canvas.addEventListener('pointermove',e=>{if(e.buttons)move(e);});
for(const direction of ['left','right']){const button=$(direction);button.addEventListener('pointerdown',e=>{button.setPointerCapture(e.pointerId);keys[direction]=true;});for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,()=>keys[direction]=false);}
document.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)&&active){e.preventDefault();keys[e.key==='ArrowLeft'?'left':'right']=true;}});document.addEventListener('keyup',e=>{if(e.key==='ArrowLeft')keys.left=false;if(e.key==='ArrowRight')keys.right=false;});document.addEventListener('visibilitychange',()=>{if(document.hidden)window.pauseGame();});window.addEventListener('blur',window.pauseGame);
$('start').onclick=start;$('again').onclick=start;$('back').onclick=home;$('quit').onclick=home;$('pause').onclick=togglePause;$('about').onclick=()=>openInfo();$('closeInfo').onclick=()=>closeInfo();

function openInfo(){$('info').classList.remove('hidden');$('closeInfo').focus();}
function closeInfo(){$('info').classList.add('hidden');$('about').focus();}
$('privacyButton').onclick=()=>{window.pauseGame();$('privacy').classList.remove('hidden');$('closePrivacy').focus();};
function closePrivacy(){$('privacy').classList.add('hidden');$('privacyButton').focus();}
$('closePrivacy').onclick=closePrivacy;
window.handleBack=()=>{if(!$('privacy').classList.contains('hidden')){closePrivacy();return true;}if(!$('info').classList.contains('hidden')){closeInfo();return true;}if(active){home();return true;}if(!$('result').classList.contains('hidden')){home();return true;}return false;};
document.addEventListener('keydown',e=>{if(e.key==='Escape')window.handleBack();});

// Brief branded opening; local game is ready before this script runs.
setTimeout(()=>{document.body.classList.remove("loading");$("splash").remove();},1200);

function fitField(){
 if($('play').classList.contains('hidden'))return;
 const main=document.querySelector('main'),header=document.querySelector('header'),play=$('play');
 const landscape=matchMedia('(orientation:landscape) and (min-width:560px) and (max-height:600px)').matches;
 let width;
 if(landscape){const availableHeight=innerHeight-header.getBoundingClientRect().height-40;const availableWidth=play.clientWidth-216;width=Math.min(availableWidth,Math.max(120,availableHeight)*400/520);}
 else{let occupied=header.getBoundingClientRect().height+40;for(const child of play.children){if(child===canvas)continue;const style=getComputedStyle(child);occupied+=child.getBoundingClientRect().height+parseFloat(style.marginTop)+parseFloat(style.marginBottom);}width=Math.min(play.clientWidth,Math.max(130,innerHeight-occupied-8)*400/520);}
 canvas.style.width=Math.floor(width)+'px';canvas.style.height=Math.floor(width*520/400)+'px';
}
window.addEventListener('resize',fitField);

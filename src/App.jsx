import { useState, useEffect, useRef } from "react";

const BASE_USERS = [
  { id:'alon',   name:'Alon',   password:'alon123',   color:'#818cf8', admin:true },
  { id:'libi',   name:'Libi',   password:'libi123',   color:'#f472b6' },
  { id:'daniel', name:'Daniel', password:'daniel123', color:'#38bdf8' },
  { id:'ariel',  name:'Ariel',  password:'ariel123',  color:'#34d399' },
  { id:'tzippy', name:'Tzippy', password:'tzippy123', color:'#fbbf24' },
  { id:'ami',    name:'Ami',    password:'ami123',    color:'#a78bfa' },
  { id:'dylan',  name:'Dylan',  password:'dylan123',  color:'#fb7185' },
];
const GUEST   = { id:'guest', name:'Guest', password:'', color:'#94a3b8', guest:true };
const getFam  = d => [...BASE_USERS, ...(d?.dynamicUsers||[])];
const getUser = (id, dyn=[]) => [...BASE_USERS, ...dyn, GUEST].find(u => u.id===id) || GUEST;
const UCOLS   = ['#818cf8','#f472b6','#38bdf8','#34d399','#fbbf24','#a78bfa','#fb7185','#f97316','#22d3ee','#a3e635','#e879f9'];

const BASE_CHORES = [
  {id:'c1',  name:'Wash the dishes',         points:10, emoji:'🍽️'},
  {id:'c2',  name:'Vacuum living room',       points:15, emoji:'🧹'},
  {id:'c3',  name:'Take out the trash',       points:10, emoji:'🗑️'},
  {id:'c4',  name:'Clean the bathroom',       points:20, emoji:'🚿'},
  {id:'c5',  name:'Mop the floors',           points:20, emoji:'🪣'},
  {id:'c6',  name:'Do laundry',               points:15, emoji:'👕'},
  {id:'c7',  name:'Fold & put away clothes',  points:10, emoji:'👚'},
  {id:'c8',  name:'Clean kitchen counters',   points:10, emoji:'✨'},
  {id:'c9',  name:'Feed the pets',            points:5,  emoji:'🐾'},
  {id:'c10', name:'Water the plants',         points:5,  emoji:'🌿'},
  {id:'c11', name:'Set or clear the table',   points:5,  emoji:'🍴'},
  {id:'c12', name:'Sweep outdoor area',       points:15, emoji:'🌳'},
];
const BASE_SHOP_ITEMS = [
  {id:'s1',name:'Pick the family dessert',    emoji:'🍰',cost:40, desc:"You choose tonight's sweet treat!"},
  {id:'s2',name:'Family movie night pick',    emoji:'🎬',cost:50, desc:"You're the director tonight!"},
  {id:'s3',name:'30-min later bedtime',       emoji:'😴',cost:60, desc:"Stay up a little longer!"},
  {id:'s4',name:'1 hour extra screen time',   emoji:'🎮',cost:80, desc:"Level up your gaming session!"},
  {id:'s5',name:'Choose dinner for the night',emoji:'🍕',cost:100,desc:"You're the chef of decisions!"},
  {id:'s6',name:'Assign a chore to someone',  emoji:'👑',cost:150,desc:"Delegate like a boss!"},
  {id:'s7',name:'Streak Saver',               emoji:'🛡️',cost:15, desc:"Restore a broken streak — stores in your inventory!",streakSaver:true},
  {id:'s8',name:'Family Restaurant Visit',    emoji:'🍽️',cost:500,desc:"The ultimate family outing!",boss:true},
];
const BASE_RECURRING = [
  {id:'r1',name:'Replace cat water', dayOfMonth:7, points:10,emoji:'🐱',frequency:'monthly'},
  {id:'r2',name:'Replace air filter',dayOfMonth:22,points:25,emoji:'💨',frequency:'monthly'},
  {id:'r3',name:'Clean the fridge',  dayOfMonth:15,points:20,emoji:'❄️',frequency:'monthly'},
  {id:'r4',name:'Deep clean oven',   dayOfMonth:1, points:30,emoji:'🔥',frequency:'monthly'},
];
const TIERS = [
  {name:'Bronze',  min:0,  emoji:'🥉',color:'#cd7f32',bg:'rgba(205,127,50,0.18)'},
  {name:'Silver',  min:25, emoji:'🥈',color:'#c0c0c0',bg:'rgba(192,192,192,0.18)'},
  {name:'Gold',    min:50, emoji:'🥇',color:'#ffd700',bg:'rgba(255,215,0,0.18)'},
  {name:'Platinum',min:75, emoji:'💠',color:'#e2e8f0',bg:'rgba(226,232,240,0.18)'},
  {name:'Diamond', min:100,emoji:'💎',color:'#7dd3fc',bg:'rgba(125,211,252,0.18)'},
  {name:'Obsidian',min:125,emoji:'🖤',color:'#a855f7',bg:'rgba(168,85,247,0.18)'},
];
const BACKGROUNDS = [
  {id:'bg0', name:'Default',        cost:0, free:true,emoji:'🌑',desc:'Classic deep purple',  preview:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'},
  {id:'bg1', name:'Northern Lights',cost:15,emoji:'🌌',desc:'Animated aurora borealis',        preview:'linear-gradient(135deg,#011c2e,#005f4e,#00b894)'},
  {id:'bg2', name:'Cherry Blossoms',cost:10,emoji:'🌸',desc:'Soft pink spring vibes',          preview:'linear-gradient(135deg,#1a0521,#4a1040,#7b2d6e)'},
  {id:'bg3', name:'Midnight Ocean', cost:15,emoji:'🌊',desc:'Animated deep ocean waves',       preview:'linear-gradient(135deg,#020c1b,#0a2240,#1565c0)'},
  {id:'bg4', name:'Sunset Haze',    cost:10,emoji:'🌅',desc:'Warm purple to orange',           preview:'linear-gradient(135deg,#1a0533,#7b1f3f,#d4621a)'},
  {id:'bg5', name:'Galaxy',         cost:10,emoji:'✨',desc:'Deep starry night sky',           preview:'linear-gradient(135deg,#020010,#0d0025,#1a0533)'},
  {id:'bg6', name:'Rainbow Depth',  cost:10,emoji:'🌈',desc:'Vivid dark gradient',             preview:'linear-gradient(135deg,#2d0033,#001a66,#013300,#664400)'},
  {id:'bg7', name:'Cotton Candy',   cost:10,emoji:'🍭',desc:'Dreamy pastel swirl',             preview:'linear-gradient(135deg,#2d0a35,#1a1545,#0a2535)'},
  {id:'bg8', name:'Autumn Forest',  cost:10,emoji:'🍂',desc:'Warm fall colors',                preview:'linear-gradient(135deg,#1a0800,#5c1f00,#8b3a0f)'},
  {id:'bg9', name:'Neon City',      cost:15,emoji:'🌃',desc:'Animated cyberpunk neon',         preview:'linear-gradient(135deg,#000,#0d001a,#001a0d)'},
  {id:'bg10',name:'Mint Fresh',     cost:10,emoji:'🌿',desc:'Cool refreshing mint',            preview:'linear-gradient(135deg,#001a13,#003328,#004d38)'},
];
const BG_APP = {
  bg0:{css:'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)'},
  bg1:{cls:'app-bg-bg1'},bg2:{css:'linear-gradient(135deg,#1a0521,#4a1040,#7b2d6e)'},
  bg3:{cls:'app-bg-bg3'},bg4:{css:'linear-gradient(135deg,#1a0533,#7b1f3f,#d4621a)'},
  bg5:{css:'linear-gradient(135deg,#020010,#0d0025,#1a0533)'},
  bg6:{css:'linear-gradient(135deg,#2d0033,#001a66,#013300,#664400,#330066)'},
  bg7:{css:'linear-gradient(135deg,#2d0a35,#1a1545,#0a2535)'},
  bg8:{css:'linear-gradient(135deg,#1a0800,#5c1f00,#8b3a0f)'},
  bg9:{cls:'app-bg-bg9'},bg10:{css:'linear-gradient(135deg,#001a13,#003328,#004d38)'},
};
const THEMES = [
  {id:'th0',name:'Default',      cost:0, free:true,emoji:'⭐',desc:'Clean classic look'},
  {id:'th1',name:'Cat Mode',     cost:10,emoji:'🐱',desc:'Cat paw prefix on every chore'},
  {id:'th2',name:'Rainbow',      cost:15,emoji:'🌈',desc:'Unique color per task; rainbow glow on completion'},
  {id:'th3',name:'Neon Glow',    cost:15,emoji:'💚',desc:'Cyan-green text, bright glow on done tasks'},
  {id:'th4',name:'Pastel Dreams',cost:10,emoji:'🌷',desc:'Soft pastel pink aesthetic'},
  {id:'th5',name:'Golden Touch', cost:15,emoji:'🏆',desc:'Gold tasks, shimmering glow on completion'},
  {id:'th6',name:'Ocean Breeze', cost:10,emoji:'🌊',desc:'Cool ocean blue tones'},
  {id:'th7',name:'Cherry Pop',   cost:10,emoji:'🍒',desc:'Bold cherry red accents'},
  {id:'th8',name:'Matrix',       cost:15,emoji:'💻',desc:'Hacker green, bright glow on done tasks'},
  {id:'th9',name:'Sunset Glow',  cost:10,emoji:'🌅',desc:'Warm orange sunset tones'},
];
const TC = {
  th0:{accent:null,      prefix:'',   rainbow:false,taskColor:null,      itemBg:null,                   doneBg:null,                   doneGlowCls:'',      animEmoji:['✅','⭐','🎉','🙌']},
  th1:{accent:'#f472b6', prefix:'🐾 ',rainbow:false,taskColor:null,      itemBg:'rgba(244,114,182,0.07)',doneBg:null,                   doneGlowCls:'',      animEmoji:['🐱','🐾','💕','🐈']},
  th2:{accent:null,      prefix:'',   rainbow:true, taskColor:null,      itemBg:null,                   doneBg:null,                   doneGlowCls:'g-rb',  animEmoji:['🌈','✨','🎨','🌟','💫']},
  th3:{accent:'#00ff88', prefix:'',   rainbow:false,taskColor:'#a0ffd6', itemBg:'rgba(0,255,136,0.05)', doneBg:'rgba(0,255,136,0.14)', doneGlowCls:'g-neon',animEmoji:['💚','⚡','🌟','💡']},
  th4:{accent:'#f9a8d4', prefix:'🌷 ',rainbow:false,taskColor:null,      itemBg:'rgba(249,168,212,0.06)',doneBg:null,                   doneGlowCls:'',      animEmoji:['🌷','🌸','💮','🌺']},
  th5:{accent:'#ffd700', prefix:'✨ ',rainbow:false,taskColor:'#ffd700', itemBg:'rgba(255,215,0,0.06)', doneBg:'rgba(255,215,0,0.16)', doneGlowCls:'g-gold',animEmoji:['⭐','✨','🏆','💛','🌟']},
  th6:{accent:'#38bdf8', prefix:'🌊 ',rainbow:false,taskColor:'#7dd3fc', itemBg:'rgba(56,189,248,0.06)',doneBg:null,                   doneGlowCls:'',      animEmoji:['🌊','💧','🐬','🌀']},
  th7:{accent:'#e11d48', prefix:'🍒 ',rainbow:false,taskColor:null,      itemBg:'rgba(225,29,72,0.07)', doneBg:null,                   doneGlowCls:'',      animEmoji:['🍒','❤️','✨','💃']},
  th8:{accent:'#00ff41', prefix:'> ', rainbow:false,taskColor:'#00ff41', itemBg:'rgba(0,255,65,0.06)',  doneBg:'rgba(0,255,65,0.16)',  doneGlowCls:'g-mat', animEmoji:['💻','0️⃣','1️⃣','🖥️']},
  th9:{accent:'#fb923c', prefix:'🌅 ',rainbow:false,taskColor:null,      itemBg:'rgba(251,146,60,0.06)',doneBg:null,                   doneGlowCls:'',      animEmoji:['🌅','🔆','✨','☀️']},
};
const BOOSTER_ITEMS = [
  {id:'boost_3d', name:'Weekend Warrior',  emoji:'⚡',cost:100,desc:'1.5x points for everyone for 3 days!',durationDays:3,  multiplier:1.5},
  {id:'boost_7d', name:'Full Week Blaze',  emoji:'🔥',cost:250,desc:'1.5x points for everyone for 7 days!',durationDays:7,  multiplier:1.5},
  {id:'boost_perm',name:'Golden Multiplier',emoji:'👑',cost:500,desc:'Permanent personal 1.25x — stacks with global for 2x!',permanent:true,multiplier:1.25},
];
const NAMEPLATES = [
  {id:'np0',name:'None',          cost:0, free:true,emoji:'',   gradient:null,                                                                              desc:'No nameplate'},
  {id:'np1',name:'Cherry Blossom',cost:20,emoji:'🌸',gradient:'linear-gradient(90deg,rgba(244,114,182,0.28),rgba(168,85,247,0.1),transparent)',              desc:'Soft pink to purple'},
  {id:'np2',name:'Ocean Wave',    cost:20,emoji:'🌊',gradient:'linear-gradient(90deg,rgba(56,189,248,0.28),rgba(20,184,166,0.1),transparent)',               desc:'Cool blue to teal'},
  {id:'np3',name:'Sunset Drift',  cost:20,emoji:'🌅',gradient:'linear-gradient(90deg,rgba(251,146,60,0.28),rgba(244,63,94,0.1),transparent)',                desc:'Warm orange to pink'},
  {id:'np4',name:'Forest Path',   cost:20,emoji:'🌿',gradient:'linear-gradient(90deg,rgba(52,211,153,0.28),rgba(16,185,129,0.1),transparent)',               desc:'Lush green fade'},
  {id:'np5',name:'Royal Gold',    cost:25,emoji:'👑',gradient:'linear-gradient(90deg,rgba(251,191,36,0.28),rgba(168,85,247,0.12),transparent)',              desc:'Gold to violet'},
  {id:'np6',name:'Midnight Sky',  cost:20,emoji:'🌙',gradient:'linear-gradient(90deg,rgba(99,102,241,0.3),rgba(15,23,42,0.08),transparent)',                 desc:'Deep indigo fade'},
  {id:'np7',name:'Flame',         cost:20,emoji:'🔥',gradient:'linear-gradient(90deg,rgba(239,68,68,0.28),rgba(251,146,60,0.1),transparent)',                desc:'Red to orange'},
  {id:'np8',name:'Aurora',        cost:25,emoji:'🌌',gradient:'linear-gradient(90deg,rgba(0,255,136,0.2),rgba(56,189,248,0.15),rgba(168,85,247,0.1),transparent)',desc:'Northern lights'},
];
const AVATAR_DECOS = [
  {id:'ad0',name:'None',          cost:0, free:true,emoji:'',   cls:'',         desc:'No decoration'},
  {id:'ad1',name:'Rainbow Ring',  cost:25,emoji:'🌈',cls:'ad-rb',    desc:'Animated rainbow glow'},
  {id:'ad2',name:'Golden Crown',  cost:25,emoji:'👑',cls:'ad-gold',  desc:'Golden shimmering ring'},
  {id:'ad3',name:'Neon Pulse',    cost:20,emoji:'💫',cls:'ad-neon',  desc:'Pulsing cyan ring'},
  {id:'ad4',name:'Cherry Blossom',cost:20,emoji:'🌸',cls:'ad-cherry',desc:'Soft pink glowing border'},
  {id:'ad5',name:'Cosmic Aura',   cost:25,emoji:'🌌',cls:'ad-cosmic',desc:'Shifting purple/blue halo'},
  {id:'ad6',name:'Fire Ring',     cost:20,emoji:'🔥',cls:'ad-fire',  desc:'Burning orange glow'},
  {id:'ad7',name:'Diamond Aura',  cost:25,emoji:'💎',cls:'ad-diamond',desc:'Icy diamond-blue shimmer'},
];
const NAV_ITEMS = [
  {id:'profile',icon:'👤'},{id:'main',icon:'🏠'},{id:'shop',icon:'🛍️'},
  {id:'quests',icon:'🏅'},{id:'social',icon:'💬'},{id:'settings',icon:'⚙️'},
];
const FONTS=[
  {id:'f0',name:'System',   css:"'Segoe UI',sans-serif"},
  {id:'f1',name:'Lexend',   css:"'Lexend',sans-serif",   google:'Lexend'},
  {id:'f2',name:'Comfortaa',css:"'Comfortaa',cursive",   google:'Comfortaa'},
  {id:'f3',name:'SpaceMono',css:"'Space Mono',monospace",google:'Space+Mono'},
  {id:'f4',name:'Georgia',  css:"Georgia,serif"},
];
const FSIZES=[{id:'sm',name:'Small',scale:.9},{id:'md',name:'Medium',scale:1},{id:'lg',name:'Large',scale:1.12}];
const SK='fam_chores_v4';

const ACHIEVEMENTS=[
  {id:'first_chore',  name:"First Steps!",      emoji:'🌟',desc:'Complete your first chore',       rarity:'common', check:(s)=>s.totalTasks>=1},
  {id:'chores_5',     name:'Getting Started',    emoji:'⭐',desc:'Complete 5 chores',              rarity:'common', check:(s)=>s.totalTasks>=5},
  {id:'chores_10',    name:'Hard Worker',        emoji:'💪',desc:'Complete 10 chores',             rarity:'common', check:(s)=>s.totalTasks>=10},
  {id:'chores_25',    name:'On a Roll',          emoji:'🔥',desc:'Complete 25 chores',             rarity:'rare',   check:(s)=>s.totalTasks>=25},
  {id:'chores_50',    name:'Half Century',       emoji:'🏅',desc:'Complete 50 chores',             rarity:'rare',   check:(s)=>s.totalTasks>=50},
  {id:'chores_100',   name:'Century Club',       emoji:'🏆',desc:'Complete 100 chores',            rarity:'epic',   check:(s)=>s.totalTasks>=100},
  {id:'points_100',   name:'Century Points',     emoji:'💯',desc:'Earn 100 total points',          rarity:'common', check:(s)=>s.totalPoints>=100},
  {id:'points_500',   name:'High Roller',        emoji:'💎',desc:'Earn 500 total points',          rarity:'rare',   check:(s)=>s.totalPoints>=500},
  {id:'points_1000',  name:'Thousandaire',       emoji:'👑',desc:'Earn 1,000 total points',        rarity:'epic',   check:(s)=>s.totalPoints>=1000},
  {id:'streak_3',     name:'Hat Trick',          emoji:'🎯',desc:'Maintain a 3-day streak',        rarity:'common', check:(s,streak)=>streak>=3},
  {id:'streak_7',     name:'Week Warrior',       emoji:'⚡',desc:'Maintain a 7-day streak',        rarity:'rare',   check:(s,streak)=>streak>=7},
  {id:'streak_14',    name:'Unstoppable',        emoji:'💥',desc:'Maintain a 14-day streak',       rarity:'epic',   check:(s,streak)=>streak>=14},
  {id:'first_buy',    name:'Window Shopper',     emoji:'🛍️',desc:'Make your first shop purchase',  rarity:'common', check:(s,streak,r)=>r>=1},
  {id:'buy_5',        name:'Big Spender',        emoji:'💸',desc:'Make 5 shop purchases',          rarity:'rare',   check:(s,streak,r)=>r>=5},
  {id:'buy_10',       name:'Shop Addict',        emoji:'🤑',desc:'Make 10 shop purchases',         rarity:'epic',   check:(s,streak,r)=>r>=10},
  {id:'tier_gold',    name:'Golden Age',         emoji:'🥇',desc:'Reach Gold tier (50 tasks)',     rarity:'rare',   check:(s)=>s.totalTasks>=50},
  {id:'tier_obsidian',name:'Legendary',          emoji:'🖤',desc:'Reach Obsidian tier (125 tasks)',rarity:'epic',   check:(s)=>s.totalTasks>=125},
  {id:'boost_used',   name:'Power Surge',        emoji:'⚡',desc:'Complete a chore during a booster',rarity:'rare', check:(s,streak,r,extra)=>!!extra?.boostChore},
  {id:'first_login',  name:'Welcome Home',       emoji:'🏠',desc:'Log in for the first time',      rarity:'common', check:(s,streak,r,extra)=>!!extra?.loggedIn},
  {id:'login_7',      name:'Regular',            emoji:'📅',desc:'Log in 7 days in a row',         rarity:'rare',   check:(s,streak,r,extra)=>(extra?.loginStreak||0)>=7},
];

const RARITIES={common:{color:'#94a3b8',label:'Common'},rare:{color:'#818cf8',label:'Rare'},epic:{color:'#a855f7',label:'Epic'}};

const PERSONAL_QUESTS=[
  {id:'qp1',name:'Power Day',      emoji:'⚡',desc:'Complete 5 chores in one day',                pts:30,check:(c,uid)=>{const t=getToday();return c.filter(x=>x.userId===uid&&x.date===t).length>=5;}},
  {id:'qp2',name:'3-Day Warrior',  emoji:'🔥',desc:'Maintain a 3-day streak',                    pts:50,check:(c,uid)=>calcStreak(c,uid)>=3},
  {id:'qp3',name:'Variety Pack',   emoji:'🎨',desc:'Complete 6 different chores this week',      pts:40,check:(c,uid)=>{const ws=getWkSt();return new Set(c.filter(x=>x.userId===uid&&x.date>=ws).map(x=>x.choreId)).size>=6;}},
  {id:'qp4',name:'Point Hoarder',  emoji:'💰',desc:'Earn 150 points this week',                  pts:25,check:(c,uid,stats)=>(stats[uid]?.weeklyPoints||0)>=150},
  {id:'qp5',name:'Clean Freak',    emoji:'🧹',desc:'Complete 3 chores 3 days in a row',          pts:60,check:(c,uid)=>{const ws=getWkSt();const byDate={};c.filter(x=>x.userId===uid&&x.date>=ws).forEach(x=>{byDate[x.date]=(byDate[x.date]||0)+1;});const days=Object.keys(byDate).filter(d=>byDate[d]>=3).sort();let streak=1;for(let i=1;i<days.length;i++){const d=Math.round((new Date(days[i])-new Date(days[i-1]))/864e5);if(d===1)streak++;else streak=1;if(streak>=3)return true;}return streak>=3;}},
];

const FAMILY_QUESTS=[
  {id:'qf1',name:'Family Strong',      emoji:'👨‍👩‍👧',desc:'50 chores completed as a family this week', pts:20,target:50, progress:(c)=>{const ws=getWkSt();return c.filter(x=>x.date>=ws).length;},  check:(c)=>{const ws=getWkSt();return c.filter(x=>x.date>=ws).length>=50;}},
  {id:'qf2',name:'All Hands on Deck',  emoji:'🙌',desc:'Everyone completes at least 1 chore this week',pts:30,target:null,progress:(c,data)=>{const ws=getWkSt();return getFam(data).filter(u=>c.some(x=>x.userId===u.id&&x.date>=ws)).length;},check:(c,data)=>{const ws=getWkSt();return getFam(data).every(u=>c.some(x=>x.userId===u.id&&x.date>=ws));}},
  {id:'qf3',name:'Family Fortune',     emoji:'⭐',desc:'Family earns 500 points this week',           pts:15,target:500,progress:(c)=>{const ws=getWkSt();return c.filter(x=>x.date>=ws).reduce((s,x)=>s+x.points,0);},check:(c)=>{const ws=getWkSt();return c.filter(x=>x.date>=ws).reduce((s,x)=>s+x.points,0)>=500;}},
  {id:'qf4',name:'Diversity Award',    emoji:'🌈',desc:'10 different chores completed this week',      pts:25,target:10, progress:(c)=>{const ws=getWkSt();return new Set(c.filter(x=>x.date>=ws).map(x=>x.choreId)).size;},check:(c)=>{const ws=getWkSt();return new Set(c.filter(x=>x.date>=ws).map(x=>x.choreId)).size>=10;}},
];

// Image compression for profile pics and custom backgrounds
const compressImage=(file,maxDim=240)=>new Promise(res=>{
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      const scale=Math.min(maxDim/img.width,maxDim/img.height,1);
      const canvas=document.createElement('canvas');
      canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);
      canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
      res(canvas.toDataURL('image/jpeg',0.75));
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
});

// ── Supabase sync ─────────────────────────────────────────────
const SB_URL='https://xbkfbdpmkejvodyxhmoq.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia2ZiZHBta2Vqdm9keXhobW9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTMzODUsImV4cCI6MjA5OTc4OTM4NX0.06vqP0mLXBB1UGzSV3m3RQJmooSnIiHq9vAj1ozPl_I';
const SB_HDR={'apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Content-Type':'application/json'};
const USE_SB=typeof window.storage==='undefined'; // use Supabase in real website, window.storage in Claude preview

const sbLoad=async()=>{
  try{
    const r=await fetch(`${SB_URL}/rest/v1/app_state?id=eq.1&select=data,updated_at`,{headers:SB_HDR});
    if(!r.ok)return null;
    const rows=await r.json();
    return rows[0]||null;
  }catch{return null;}
};
const sbSave=async(data,syncedRef)=>{
  try{
    const now=new Date().toISOString();
    const body=JSON.stringify({data,updated_at:now});
    const r=await fetch(`${SB_URL}/rest/v1/app_state?id=eq.1`,{method:'PATCH',headers:{...SB_HDR,'Prefer':'return=minimal'},body});
    if(r.status===404||r.status===406){
      await fetch(`${SB_URL}/rest/v1/app_state`,{method:'POST',headers:{...SB_HDR,'Prefer':'return=minimal'},body:JSON.stringify({id:1,data,updated_at:now})});
    }
    if(syncedRef)syncedRef.current=now;
  }catch(e){console.error('Sync error:',e);}
};

const GCSS=`
@keyframes tkr{0%{transform:translateX(100vw)}100%{transform:translateX(-100%)}}
@keyframes bg_a{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes th_r{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
@keyframes floatUp{0%{transform:translateY(0) scale(1) rotate(0deg);opacity:1}100%{transform:translateY(-95px) scale(.2) rotate(25deg);opacity:0}}
@keyframes rb_glow{
  0%{box-shadow:0 0 16px rgba(255,0,0,.7);border-color:#ff0000}
  16%{box-shadow:0 0 16px rgba(255,150,0,.7);border-color:#ff9600}
  33%{box-shadow:0 0 16px rgba(255,255,0,.7);border-color:#ffff00}
  50%{box-shadow:0 0 16px rgba(0,255,0,.7);border-color:#00ff00}
  66%{box-shadow:0 0 16px rgba(0,80,255,.7);border-color:#0050ff}
  83%{box-shadow:0 0 16px rgba(180,0,255,.7);border-color:#b400ff}
  100%{box-shadow:0 0 16px rgba(255,0,0,.7);border-color:#ff0000}
}
@keyframes ad_rb{
  0%{border-color:#ff0000;box-shadow:0 0 10px #ff000077}
  16%{border-color:#ff9600;box-shadow:0 0 10px #ff960077}
  33%{border-color:#ffff00;box-shadow:0 0 10px #ffff0077}
  50%{border-color:#00ff00;box-shadow:0 0 10px #00ff0077}
  66%{border-color:#0050ff;box-shadow:0 0 10px #0050ff77}
  83%{border-color:#b400ff;box-shadow:0 0 10px #b400ff77}
  100%{border-color:#ff0000;box-shadow:0 0 10px #ff000077}
}
@keyframes ad_pulse{0%,100%{box-shadow:0 0 8px rgba(0,255,136,.4)}50%{box-shadow:0 0 20px rgba(0,255,136,.8)}}
@keyframes ad_cosmic{0%,100%{border-color:#818cf8;box-shadow:0 0 12px #818cf866}50%{border-color:#e879f9;box-shadow:0 0 12px #e879f966}}
@keyframes ad_diamond{0%,100%{border-color:#7dd3fc;box-shadow:0 0 12px rgba(125,211,252,.5)}50%{border-color:#e0f2fe;box-shadow:0 0 18px rgba(224,242,254,.7)}}
.app-bg-bg1{background:linear-gradient(270deg,#011c2e,#005f4e,#00b894,#005f4e,#011c2e)!important;background-size:400% 400%!important;animation:bg_a 8s ease infinite!important}
.app-bg-bg3{background:linear-gradient(270deg,#020c1b,#0a2240,#1565c0,#0a2240,#020c1b)!important;background-size:400% 400%!important;animation:bg_a 6s ease infinite!important}
.app-bg-bg9{background:linear-gradient(270deg,#000510,#00100a,#000510)!important;background-size:400% 400%!important;animation:bg_a 3s ease infinite!important}
.th-rb{background:linear-gradient(270deg,rgba(255,80,80,.12),rgba(80,200,80,.12),rgba(80,80,255,.12))!important;background-size:300% 300%!important;animation:th_r 4s ease infinite!important}
.g-neon{box-shadow:0 0 20px rgba(0,255,136,.6)!important;border-color:rgba(0,255,136,.5)!important}
.g-gold{box-shadow:0 0 20px rgba(255,215,0,.6)!important;border-color:rgba(255,215,0,.5)!important}
.g-mat{box-shadow:0 0 20px rgba(0,255,65,.6)!important;border-color:rgba(0,255,65,.5)!important}
.g-rb{animation:rb_glow 2s linear infinite!important}
.ad-rb{border:3px solid #ff0000!important;animation:ad_rb 2s linear infinite!important;border-radius:50%!important;box-sizing:border-box!important}
.ad-gold{border:3px solid #ffd700!important;box-shadow:0 0 14px rgba(255,215,0,.65)!important;border-radius:50%!important;box-sizing:border-box!important}
.ad-neon{border:3px solid #00ff88!important;animation:ad_pulse 1.5s ease-in-out infinite!important;border-radius:50%!important;box-sizing:border-box!important}
.ad-cherry{border:3px solid #f472b6!important;box-shadow:0 0 12px rgba(244,114,182,.6)!important;border-radius:50%!important;box-sizing:border-box!important}
.ad-cosmic{border:3px solid #818cf8!important;animation:ad_cosmic 3s ease-in-out infinite!important;border-radius:50%!important;box-sizing:border-box!important}
.ad-fire{border:3px solid #f97316!important;box-shadow:0 0 14px rgba(249,115,22,.65)!important;border-radius:50%!important;box-sizing:border-box!important}
.ad-diamond{border:3px solid #7dd3fc!important;animation:ad_diamond 2s ease-in-out infinite!important;border-radius:50%!important;box-sizing:border-box!important}
.ep{position:fixed;pointer-events:none;font-size:22px;animation:floatUp 1.1s ease-out forwards;z-index:9999}
input,select,button{font-family:inherit}
`;

// ── Helpers ────────────────────────────────────────────────
const calcStreak=( completions,userId)=>{
  const dates=[...new Set(completions.filter(c=>c.userId===userId).map(c=>c.date))].sort().reverse();
  if(!dates.length)return 0;
  const today=getToday(),yest=new Date();yest.setDate(yest.getDate()-1);
  const yStr=yest.toISOString().split('T')[0];
  if(dates[0]!==today&&dates[0]!==yStr)return 0;
  let streak=1;
  for(let i=1;i<dates.length;i++){
    const d1=new Date(dates[i-1]+'T12:00:00'),d2=new Date(dates[i]+'T12:00:00');
    if(Math.round((d1-d2)/864e5)===1)streak++;else break;
  }
  return streak;
};

const getTier=n=>[...TIERS].reverse().find(t=>n>=t.min)||TIERS[0];
const getToday=()=>new Date().toISOString().split('T')[0];
const getWkSt=()=>{const d=new Date();d.setDate(d.getDate()-d.getDay());return d.toISOString().split('T')[0];};
const get2WA=()=>{const d=new Date();d.setDate(d.getDate()-14);return d.toISOString().split('T')[0];};
const getMoSt=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;};
const ordinal=n=>{const s=['th','st','nd','rd'],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);};
const daysSince=s=>Math.max(0,Math.floor((Date.now()-new Date(s).getTime())/864e5));
const rbHue=i=>`hsl(${(i*53)%360},80%,65%)`;
const getRecStatus=task=>{
  const freq=task.frequency||'monthly';
  if(freq==='monthly'){const t=new Date(),lc=task.lastCompleted?new Date(task.lastCompleted):null;const done=!!(lc&&lc.getMonth()===t.getMonth()&&lc.getFullYear()===t.getFullYear());const base=done?new Date(t.getFullYear(),t.getMonth()+1,task.dayOfMonth||1):new Date(t.getFullYear(),t.getMonth(),task.dayOfMonth||1);return{done,daysLeft:Math.ceil((base-t)/864e5)};}
  const iv=freq==='weekly'?7:14;if(!task.lastCompleted)return{done:false,daysLeft:0};const last=new Date(task.lastCompleted+'T00:00:00');const next=new Date(last);next.setDate(last.getDate()+iv);return{done:daysSince(task.lastCompleted)<iv,daysLeft:Math.ceil((next-new Date())/864e5)};
};
const freqLabel=task=>{const f=task.frequency||'monthly';if(f==='weekly')return'Every week';if(f==='biweekly')return'Every 2 weeks';return`Every ${ordinal(task.dayOfMonth||1)}`;};
const gUS=(data,uid)=>({bg:'bg0',theme:'th0',font:'f0',fontSize:'md',showQuickNav:false,permanentBoosterActive:false,nameplate:'np0',avatarDeco:'ad0',...((data.userSettings||{})[uid]||{})});
const gUP=(data,uid)=>(data.purchases||{})[uid]||[];
const isUL=(data,uid,id)=>{const it=[...BACKGROUNDS,...THEMES,...BOOSTER_ITEMS,...NAMEPLATES,...AVATAR_DECOS].find(x=>x.id===id);return !!(it?.free||gUP(data,uid).includes(id));};
const getActiveBst=data=>(data.boosters||[]).filter(b=>b.expiresAt&&b.expiresAt>Date.now()).sort((a,b)=>b.multiplier-a.multiplier)[0]||null;
const getMult=(data,uid)=>{const s=gUS(data,uid),ab=getActiveBst(data),hp=gUP(data,uid).includes('boost_perm')&&s.permanentBoosterActive;if(ab&&hp)return 2.0;if(ab)return ab.multiplier;if(hp)return 1.25;return 1.0;};
const getDecoClass=s=>{const d=AVATAR_DECOS.find(x=>x.id===(s?.avatarDeco||'ad0'));return d?.cls||'';};
const getNameplateGrad=s=>{const n=NAMEPLATES.find(x=>x.id===(s?.nameplate||'np0'));return n?.gradient||null;};

const isSystemRow=c=>{const id=String(c.choreId||'');return id.startsWith('quest_')||id.startsWith('streaksave_');};
const getSavers=(data,uid)=>(data.streakSavers||{})[uid]||0;
const dayDiff=(a,b)=>Math.round((new Date(a+'T12:00:00')-new Date(b+'T12:00:00'))/864e5);
// Returns {lost,missedDate} when exactly one missed day broke a streak of 2+, else null
const getBrokenStreak=(completions,userId)=>{
  const dates=[...new Set(completions.filter(c=>c.userId===userId).map(c=>c.date))].sort().reverse();
  if(!dates.length)return null;
  if(dayDiff(getToday(),dates[0])!==2)return null;
  let n=1;
  for(let i=1;i<dates.length;i++){if(dayDiff(dates[i-1],dates[i])===1)n++;else break;}
  if(n<2)return null;
  const m=new Date(dates[0]+'T12:00:00');m.setDate(m.getDate()+1);
  return{lost:n,missedDate:m.toISOString().split('T')[0]};
};
const compStats=(completions,redemptions,data)=>{
  const ws=getWkSt(),tw=get2WA(),ms=getMoSt(),out={};
  getFam(data).forEach(u=>{const mc=completions.filter(c=>c.userId===u.id);const rp=(redemptions||[]).filter(r=>r.userId===u.id).reduce((s,r)=>s+r.cost,0);const tp=mc.reduce((s,c)=>s+c.points,0);out[u.id]={totalTasks:mc.filter(c=>!isSystemRow(c)).length,totalPoints:tp,weeklyPoints:mc.filter(c=>c.date>=ws).reduce((s,c)=>s+c.points,0),biweeklyPoints:mc.filter(c=>c.date>=tw).reduce((s,c)=>s+c.points,0),monthlyPoints:mc.filter(c=>c.date>=ms).reduce((s,c)=>s+c.points,0),redeemedPoints:rp,availablePoints:tp-rp};});
  return out;
};
const findWinner=(completions,start,end,data)=>{
  const f=completions.filter(c=>c.date>=start&&c.date<end),pts={};getFam(data).forEach(u=>{pts[u.id]=f.filter(c=>c.userId===u.id).reduce((s,c)=>s+c.points,0);});const best=Object.entries(pts).filter(([,v])=>v>0).reduce((a,b)=>b[1]>a[1]?b:a,null);return best?best[0]:null;
};

const initData=()=>({
  completions:[],suggestions:[],announcements:[
    {id:'a1',text:'👋 Welcome to the Family Chore Tracker! Start earning points!'},
    {id:'a2',text:'🏆 Top scorer each week earns bragging rights!'},
    {id:'a3',text:'🍽️ 500 pts = Family restaurant visit — the ultimate boss reward!'},
  ],
  recurringTasks:BASE_RECURRING,customChores:[],redemptions:[],
  wins:{},lastWeekChecked:null,lastMonthChecked:null,choreOverrides:{},
  profilePics:{},purchases:{},userSettings:{},
  wishlist:{shopSuggestions:[],featureRequests:[]},
  dynamicShopItems:[],customBackgrounds:[],dynamicUsers:[],boosters:[],
  loginMode:'simple',chat:[],questClaims:{},streakSavers:{},achievementsEarned:{},
});
const migrate=d=>({...initData(),...d,wins:d.wins||{},lastWeekChecked:d.lastWeekChecked||null,lastMonthChecked:d.lastMonthChecked||null,choreOverrides:d.choreOverrides||{},profilePics:d.profilePics||{},purchases:d.purchases||{},userSettings:d.userSettings||{},wishlist:d.wishlist||{shopSuggestions:[],featureRequests:[]},dynamicShopItems:d.dynamicShopItems||[],customBackgrounds:d.customBackgrounds||[],dynamicUsers:d.dynamicUsers||[],boosters:d.boosters||[],recurringTasks:(d.recurringTasks||BASE_RECURRING).map(t=>({frequency:'monthly',...t})),loginMode:d.loginMode||'simple',chat:d.chat||[],questClaims:d.questClaims||{},streakSavers:d.streakSavers||{},achievementsEarned:d.achievementsEarned||{}});

const glass=(x={})=>({background:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.09)',borderRadius:16,...x});
const inp=(x={})=>({background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:8,padding:'6px 10px',color:'white',fontSize:13,outline:'none',boxSizing:'border-box',...x});

// ── Atoms ──────────────────────────────────────────────────
function Avatar({user,size=40,onClick,imgSrc,decoClass}) {
  return (
    <div className={decoClass||''} onClick={onClick} style={{width:size,height:size,borderRadius:'50%',flexShrink:0,background:`linear-gradient(135deg,${user.color},${user.color}99)`,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:size*.38,color:'white',cursor:onClick?'pointer':'default',overflow:'hidden',boxSizing:'border-box',...(decoClass?{}:{boxShadow:`0 2px 14px ${user.color}55`})}}>
      {imgSrc?<img src={imgSrc} alt={user.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:user.name[0]}
    </div>
  );
}
function TierBadge({tier,sm}){return <span style={{background:tier.bg,border:`1px solid ${tier.color}`,borderRadius:8,padding:sm?'2px 8px':'4px 12px',fontSize:sm?11:13,fontWeight:700,color:tier.color,boxShadow:`0 0 10px ${tier.color}44`,whiteSpace:'nowrap'}}>{tier.emoji} {tier.name}</span>;}
function Card({title,sub,children,noPad,style={}}){return <div style={{...glass(),overflow:'hidden',...style}}>{title&&<div style={{padding:'14px 16px 8px'}}><div style={{fontWeight:700,fontSize:15}}>{title}</div>{sub&&<div style={{fontSize:11,opacity:.5,marginTop:1}}>{sub}</div>}</div>}<div style={noPad?{}:{padding:title?'0 16px 14px':'14px 16px'}}>{children}</div></div>;}
function Ticker({anns}){return <div style={{background:'rgba(129,140,248,0.12)',borderBottom:'1px solid rgba(129,140,248,0.2)',height:34,display:'flex',alignItems:'center',overflow:'hidden',flexShrink:0}}><div style={{whiteSpace:'nowrap',animation:'tkr 40s linear infinite',fontSize:13,opacity:.85}}>{'📣  '+anns.map(a=>a.text).join('   ·   ')}</div></div>;}
function HamBtn({onClick}){return <button onClick={onClick} style={{background:'rgba(255,255,255,0.1)',border:'none',borderRadius:10,width:40,height:40,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:4,flexShrink:0}}>{[0,1,2].map(i=><div key={i} style={{width:18,height:2,background:'white',borderRadius:2}}/>)}</button>;}
function Particles({particles}){return <>{particles.map(p=><div key={p.id} className="ep" style={{left:p.x,top:p.y,animationDuration:`${p.dur}s`,animationDelay:`${p.delay}s`}}>{p.emoji}</div>)}</>;}

// ── ChoreItem ──────────────────────────────────────────────
function ChoreItem({chore,done,doer,myId,isGuest,onToggle,color,tc,idx,onAnim}){
  const t=tc||TC.th0,loc=done&&doer&&doer.id!==myId,canAct=!isGuest&&!loc;
  const rbCol=t.rainbow?rbHue(idx||0):null;
  const accent=rbCol||t.accent||color;
  let itemBg='rgba(255,255,255,0.03)';
  if(!done&&t.itemBg)itemBg=t.itemBg;else if(!done&&rbCol)itemBg=`${rbCol}10`;else if(done&&!loc&&t.doneBg)itemBg=t.doneBg;else if(done&&!loc)itemBg=`${accent}18`;else if(done&&loc)itemBg='rgba(255,255,255,0.03)';
  const glowCls=done&&!loc?(t.rainbow?'g-rb':t.doneGlowCls||''):'';
  const borderCol=done?(loc?'rgba(255,255,255,0.07)':`${accent}55`):(rbCol?`${rbCol}44`:t.taskColor?`${t.taskColor}22`:'rgba(255,255,255,0.06)');
  const handle=e=>{if(!canAct)return;if(!done&&onAnim)onAnim(e,t.animEmoji||['✅']);onToggle();};
  return(
    <div onClick={handle} className={`${glowCls}${!done&&t.rainbow?' th-rb':''}`} style={{display:'flex',alignItems:'center',gap:11,padding:'10px 14px',borderRadius:12,cursor:canAct?'pointer':'default',background:itemBg,border:`1px solid ${borderCol}`,transition:'all .15s',opacity:loc?.65:1}}>
      <div style={{width:22,height:22,borderRadius:6,flexShrink:0,border:`2px solid ${done?(loc?'#6b7280':accent):(rbCol||t.taskColor||'rgba(255,255,255,0.2)')}`,background:done?(loc?'#6b7280':accent):'transparent',display:'flex',alignItems:'center',justifyContent:'center'}}>
        {done&&<span style={{fontSize:13,color:'white'}}>✓</span>}
      </div>
      <div style={{fontSize:19}}>{chore.emoji}</div>
      <div style={{flex:1,fontWeight:500,fontSize:14,textDecoration:done?'line-through':'none',opacity:done?.55:1,color:!done&&t.taskColor?t.taskColor:undefined}}>{t.prefix}{chore.name}</div>
      {loc&&doer&&<div style={{fontSize:11,opacity:.5,color:'#94a3b8',whiteSpace:'nowrap'}}>{doer.name}</div>}
      <div style={{fontSize:12,fontWeight:700,color:done?(loc?'#6b7280':accent):'#fbbf24',background:done?(loc?'rgba(107,114,128,0.15)':`${accent}22`):'rgba(251,191,36,0.12)',borderRadius:8,padding:'3px 8px'}}>+{chore.points}</div>
    </div>
  );
}

// ── Modals ─────────────────────────────────────────────────
function TierUpModal({tier,name,onClose}){return(<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.88)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000}}><div style={{background:'linear-gradient(135deg,rgba(15,12,41,.97),rgba(48,43,99,.97))',border:`2px solid ${tier.color}`,borderRadius:24,padding:'40px 52px',textAlign:'center',boxShadow:`0 0 80px ${tier.color}55`,maxWidth:320}}><div style={{fontSize:76,lineHeight:1}}>{tier.emoji}</div><div style={{fontSize:12,letterSpacing:3,fontWeight:700,opacity:.5,marginTop:16,textTransform:'uppercase'}}>Rank Up!</div><div style={{fontSize:34,fontWeight:800,color:tier.color,marginTop:6}}>{tier.name}!</div><div style={{opacity:.7,marginTop:8,fontSize:14}}>Congrats {name}! You've hit {tier.name} tier! 🚀</div><button onClick={onClose} style={{marginTop:24,background:tier.color,border:'none',borderRadius:12,padding:'12px 36px',color:'white',fontWeight:800,fontSize:16,cursor:'pointer'}}>LET'S GO! 🔥</button></div></div>);}

function ProfileModal({userId,stats,onClose,profilePics,dynUsers,userSettingsMap}){
  const u=getUser(userId,dynUsers),s=stats[userId]||{totalTasks:0,totalPoints:0,redeemedPoints:0},tier=getTier(s.totalTasks);
  const deco=getDecoClass(gUS({userSettings:userSettingsMap||{}},userId));
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.72)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000}} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()} style={{background:'linear-gradient(135deg,rgba(30,27,75,.97),rgba(49,46,129,.97))',border:'1px solid rgba(255,255,255,0.13)',borderRadius:22,padding:28,width:310}}>
        <div style={{textAlign:'center',marginBottom:18}}>
          <Avatar user={u} size={76} imgSrc={(profilePics||{})[userId]||null} decoClass={deco}/>
          <div style={{fontSize:22,fontWeight:800,marginTop:12}}>{u.name}</div>
          <div style={{marginTop:8}}><TierBadge tier={tier}/></div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:16}}>
          {[['Tasks',s.totalTasks,u.color],['Points',s.totalPoints,'#fbbf24'],['Redeemed',s.redeemedPoints,'#f472b6']].map(([l,v,c])=>(
            <div key={l} style={{background:'rgba(255,255,255,0.05)',borderRadius:10,padding:'10px 4px',textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:9,opacity:.6,marginTop:2}}>{l}</div></div>
          ))}
        </div>
        <button onClick={onClose} style={{width:'100%',background:'rgba(255,255,255,0.08)',border:'none',borderRadius:10,padding:10,color:'white',cursor:'pointer',fontWeight:600}}>Close</button>
      </div>
    </div>
  );
}

// ── Sidebar ─────────────────────────────────────────────────
function Sidebar({page,setPage,onClose,user,myStats,onLogout,profilePics,ownDecoClass}){
  const tier=getTier(myStats.totalTasks);
  return(
    <div style={{position:'fixed',inset:0,zIndex:900}}>
      <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)'}}/>
      <div style={{position:'absolute',left:0,top:0,bottom:0,width:264,background:'linear-gradient(180deg,#1e1b4b,#312e81)',padding:'14px 14px 18px',display:'flex',flexDirection:'column',gap:6,zIndex:901}}>
        <div style={{textAlign:'center',fontSize:11,fontWeight:800,opacity:.4,letterSpacing:3,marginBottom:10}}>MENU</div>
        {[{id:'profile',label:'👤 My Profile'},{id:'main',label:'🏠 Main'},{id:'shop',label:'🛍️ Shop'},{id:'quests',label:'🏅 Achievements'},{id:'social',label:'💬 Social'},{id:'wishlist',label:'🌟 Wishlist'}].map(item=>(
          <button key={item.id} onClick={()=>setPage(item.id)} style={{background:page===item.id?'rgba(255,255,255,0.15)':'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'13px 18px',color:'white',fontSize:15,fontWeight:page===item.id?700:400,cursor:'pointer',textAlign:'left',transition:'all .15s'}}>{item.label}</button>
        ))}
        <div style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:6}}>
          <button onClick={()=>setPage('settings')} style={{background:page==='settings'?'rgba(255,255,255,0.13)':'transparent',border:'1px solid rgba(255,255,255,0.1)',borderRadius:12,padding:'13px 18px',color:'rgba(255,255,255,0.75)',fontSize:15,fontWeight:page==='settings'?700:400,cursor:'pointer',textAlign:'left'}}>⚙️ Settings</button>
          {user.admin&&<button onClick={()=>setPage('console')} style={{background:page==='console'?'rgba(129,140,248,0.22)':'transparent',border:'1px solid rgba(129,140,248,0.22)',borderRadius:12,padding:'13px 18px',color:'#a5b4fc',fontSize:15,fontWeight:page==='console'?700:400,cursor:'pointer',textAlign:'left'}}>🔧 Console</button>}
          <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',background:'rgba(255,255,255,0.05)',borderRadius:12,marginTop:4}}>
            <Avatar user={user} size={36} imgSrc={(profilePics||{})[user.id]||null} decoClass={ownDecoClass}/>
            <div><div style={{fontWeight:700,fontSize:14}}>{user.name}</div><div style={{fontSize:11,color:tier.color}}>{tier.emoji} {tier.name}{user.admin&&<span style={{color:'#818cf8'}}> · Admin</span>}</div></div>
          </div>
          <button onClick={onLogout} style={{background:'rgba(239,68,68,0.18)',border:'1px solid rgba(239,68,68,0.28)',borderRadius:10,padding:10,color:'#fca5a5',cursor:'pointer',fontWeight:600,fontSize:14}}>Logout</button>
        </div>
      </div>
    </div>
  );
}

// ── PinnedSidebar ───────────────────────────────────────────
function PinnedSidebar({page,setPage,user,myStats,onLogout,profilePics,ownDecoClass}){
  const tier=getTier(myStats.totalTasks);
  const btn=(active,extra={})=>({background:active?'rgba(255,255,255,0.15)':'transparent',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'11px 16px',color:'white',fontSize:14,fontWeight:active?700:400,cursor:'pointer',textAlign:'left',...extra});
  return(
    <div style={{width:214,flexShrink:0,background:'rgba(0,0,0,0.22)',borderRight:'1px solid rgba(255,255,255,0.08)',padding:'12px 10px',display:'flex',flexDirection:'column',gap:5,overflowY:'auto'}}>
      {[{id:'profile',label:'👤 My Profile'},{id:'main',label:'🏠 Main'},{id:'shop',label:'🛍️ Shop'},{id:'quests',label:'🏅 Achievements'},{id:'social',label:'💬 Social'},{id:'wishlist',label:'🌟 Wishlist'}].map(item=>(
        <button key={item.id} onClick={()=>setPage(item.id)} style={btn(page===item.id)}>{item.label}</button>
      ))}
      <div style={{marginTop:'auto',display:'flex',flexDirection:'column',gap:5}}>
        <button onClick={()=>setPage('settings')} style={btn(page==='settings',{color:'rgba(255,255,255,0.75)'})}>⚙️ Settings</button>
        {user.admin&&<button onClick={()=>setPage('console')} style={btn(page==='console',{color:'#a5b4fc',border:'1px solid rgba(129,140,248,0.22)'})}>🔧 Console</button>}
        <div style={{display:'flex',alignItems:'center',gap:9,padding:'9px 12px',background:'rgba(255,255,255,0.05)',borderRadius:12,marginTop:4}}>
          <Avatar user={user} size={32} imgSrc={(profilePics||{})[user.id]||null} decoClass={ownDecoClass}/>
          <div style={{minWidth:0}}><div style={{fontWeight:700,fontSize:13}}>{user.name}</div><div style={{fontSize:10,color:tier.color}}>{tier.emoji} {tier.name}</div></div>
        </div>
        <button onClick={onLogout} style={{background:'rgba(239,68,68,0.18)',border:'1px solid rgba(239,68,68,0.28)',borderRadius:10,padding:9,color:'#fca5a5',cursor:'pointer',fontWeight:600,fontSize:13}}>Logout</button>
      </div>
    </div>
  );
}

// ── Header ──────────────────────────────────────────────────
function Header({onMenu,user,myStats,setPage,title,profilePics,settings,page,activeBooster,ownDecoClass,syncStatus,streak,hideMenu}){
  const tier=getTier(myStats.totalTasks);
  const navItems=[...NAV_ITEMS,...(user.admin?[{id:'console',icon:'🔧'}]:[])];
  const bLeft=activeBooster?Math.max(0,Math.ceil((activeBooster.expiresAt-Date.now())/864e5)):0;
  const syncDot=syncStatus==='saving'?{bg:'rgba(251,191,36,0.2)',border:'rgba(251,191,36,0.5)',color:'#fbbf24',label:'Syncing…'}:syncStatus==='error'?{bg:'rgba(239,68,68,0.2)',border:'rgba(239,68,68,0.4)',color:'#f87171',label:'Sync error'}:{bg:'rgba(52,211,153,0.15)',border:'rgba(52,211,153,0.35)',color:'#34d399',label:'Synced'};
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',borderBottom:'1px solid rgba(255,255,255,0.08)',flexShrink:0,position:'relative',gap:8}}>
      {!hideMenu&&<HamBtn onClick={onMenu}/>}
      {settings?.showQuickNav?(
        <div style={{position:'absolute',left:'50%',transform:'translateX(-50%)',display:'flex',gap:5}}>
          {navItems.map(item=>{const active=page===item.id;return(
            <div key={item.id} onClick={()=>setPage(item.id)} style={{width:36,height:36,borderRadius:10,background:active?'rgba(255,255,255,0.22)':'rgba(255,255,255,0.07)',border:`1px solid ${active?'rgba(255,255,255,0.35)':'rgba(255,255,255,0.1)'}`,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:16,position:'relative'}}>
              {item.icon}
              {active&&<div style={{position:'absolute',bottom:-9,left:'50%',transform:'translateX(-50%)',width:0,height:0,borderLeft:'5px solid transparent',borderRight:'5px solid transparent',borderTop:'7px solid rgba(255,255,255,0.45)'}}/>}
            </div>
          );})}
        </div>
      ):(
        <div style={{flex:1,marginLeft:4}}>
          <div style={{fontWeight:800,fontSize:16}}>🏠 {title}</div>
          <div style={{fontSize:11,opacity:.4}}>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'short',day:'numeric'})}</div>
        </div>
      )}
      <div style={{display:'flex',alignItems:'center',gap:7,marginLeft:'auto'}}>
        {activeBooster&&<div title={`${bLeft}d remaining · ${activeBooster.multiplier}x for everyone`} style={{background:'rgba(251,191,36,0.12)',border:'1px solid rgba(251,191,36,0.4)',borderRadius:10,padding:'4px 10px',fontSize:13,fontWeight:800,color:'#fbbf24',cursor:'default',boxShadow:'0 0 14px rgba(251,191,36,0.3)',whiteSpace:'nowrap'}}>✨ {activeBooster.multiplier}x ✨</div>}
        {!user.guest&&streak>0&&<div title={`${streak}-day streak!`} style={{background:'rgba(251,146,60,0.14)',border:'1px solid rgba(251,146,60,0.35)',borderRadius:10,padding:'4px 10px',fontSize:13,fontWeight:800,color:'#fb923c',cursor:'default',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:4}}>🔥{streak}</div>}
        {USE_SB&&<div title={syncDot.label} style={{width:8,height:8,borderRadius:'50%',background:syncDot.color,boxShadow:`0 0 6px ${syncDot.color}`,flexShrink:0,border:`1px solid ${syncDot.border}`}}/>}
        <button onClick={()=>setPage('settings')} style={{background:'rgba(255,255,255,0.08)',border:'none',borderRadius:8,width:32,height:32,cursor:'pointer',fontSize:16,color:'white',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>⚙️</button>
        {user.guest?(<div style={{textAlign:'right'}}><div style={{fontWeight:700,fontSize:14,color:'#94a3b8'}}>Guest</div><div style={{fontSize:10,opacity:.45}}>View only</div></div>):(
          <div style={{textAlign:'right'}}>
            <div style={{fontWeight:700,fontSize:14}}>{user.name}{user.admin&&<span style={{fontSize:10,color:'#818cf8',marginLeft:4}}>👑</span>}</div>
            <div style={{fontSize:11}}><span style={{color:tier.color}}>{tier.emoji} {tier.name}</span><span style={{opacity:.5}}> · {myStats.availablePoints} pts</span></div>
          </div>
        )}
        <Avatar user={user} size={36} onClick={()=>setPage('profile')} imgSrc={(profilePics||{})[user.id]||null} decoClass={ownDecoClass}/>
      </div>
    </div>
  );
}

// ── WeeklyChart ─────────────────────────────────────────────
function WeeklyChart({userId,completions,color}){
  const dates=completions.map(c=>c.date),ls=dates.length>0?dates.reduce((a,b)=>a<b?a:b):getToday();
  const launch=new Date(ls+'T00:00:00'),now=new Date(),nW=Math.max(1,Math.floor((now-launch)/(7*864e5))+1);
  const uC=completions.filter(c=>c.userId===userId);
  const wd=Array.from({length:nW},(_,i)=>{const ws=new Date(launch);ws.setDate(launch.getDate()+i*7);const we=new Date(ws);we.setDate(ws.getDate()+7);const wS=ws.toISOString().split('T')[0],weS=we.toISOString().split('T')[0];return{label:`W${i+1}`,count:uC.filter(c=>c.date>=wS&&c.date<weS).length,isCur:i===nW-1};});
  const mx=Math.max(...wd.map(w=>w.count),1),W=300,H=140,pl=26,pr=8,pt=16,pb=26,pW=W-pl-pr,pH=H-pt-pb,step=pW/Math.max(wd.length,1),bw=Math.min(step*.7,28);
  return(
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{display:'block'}}>
      {[0,Math.ceil(mx/2),mx].map((v,i)=>{const y=pt+pH*(1-v/mx);return <g key={i}><line x1={pl} x2={W-pr} y1={y} y2={y} stroke="rgba(255,255,255,0.07)" strokeWidth={1}/><text x={pl-4} y={y+3} textAnchor="end" fontSize={7} fill="rgba(255,255,255,0.4)">{v}</text></g>;})}
      {wd.map((w,i)=>{const bh=Math.max(2,pH*w.count/mx),x=pl+i*step+(step-bw)/2,y=pt+pH-bh;return(<g key={i}><rect x={x} y={y} width={bw} height={bh} rx={3} fill={w.count===0?'rgba(255,255,255,0.05)':w.isCur?color:`${color}77`}/>{w.isCur&&w.count>0&&<text x={x+bw/2} y={y-4} textAnchor="middle" fontSize={8} fill={color} fontWeight="bold">{w.count}</text>}<text x={x+bw/2} y={H-pb+13} textAnchor="middle" fontSize={7} fill={w.isCur?'rgba(255,255,255,0.75)':'rgba(255,255,255,0.35)'}>{w.label}</text></g>);})}
      <text x={W/2} y={H} textAnchor="middle" fontSize={8} fill="rgba(255,255,255,0.22)">current week highlighted</text>
    </svg>
  );
}

// ── Profile Page ─────────────────────────────────────────────
function ProfileContent({user,myStats,completions,allChores,recurringTasks,wins,profilePics,onUploadPic,userSettingsMap}){
  const tier=getTier(myStats.totalTasks),nxt=TIERS.find(t=>t.min>myStats.totalTasks);
  const recent=[...completions].filter(c=>c.userId===user.id).reverse().slice(0,8);
  const myW=wins[user.id]||{weekly:0,monthly:0};
  const picSrc=(profilePics||{})[user.id]||null;
  const fRef=useRef(null);
  const handleFile=e=>{const f=e.target.files[0];if(!f)return;onUploadPic(user.id,f);};
  const deco=getDecoClass(gUS({userSettings:userSettingsMap||{}},user.id));
  return(
    <div style={{padding:20,maxWidth:520,margin:'0 auto'}}>
      <div style={{textAlign:'center',marginBottom:20}}>
        <div style={{position:'relative',width:88,height:88,margin:'0 auto 4px'}}>
          <input ref={fRef} type="file" accept="image/*" onChange={handleFile} style={{display:'none'}}/>
          <div className={deco} onClick={()=>fRef.current.click()} style={{width:88,height:88,borderRadius:'50%',background:`linear-gradient(135deg,${user.color},${user.color}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:40,fontWeight:800,cursor:'pointer',overflow:'hidden',boxSizing:'border-box'}}>
            {picSrc?<img src={picSrc} alt={user.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:user.name[0]}
          </div>
          <div onClick={()=>fRef.current.click()} style={{position:'absolute',bottom:0,right:0,width:26,height:26,borderRadius:'50%',background:'#818cf8',border:'2px solid #1e1b4b',display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',fontSize:13}}>✏️</div>
        </div>
        <div style={{fontSize:11,opacity:.4,marginBottom:8}}>Click photo to change</div>
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:10,flexWrap:'wrap'}}>
          <div style={{fontSize:24,fontWeight:800}}>{user.name}</div>
          <TierBadge tier={tier}/>
          {user.admin&&<span style={{background:'rgba(129,140,248,0.18)',border:'1px solid rgba(129,140,248,0.4)',borderRadius:8,padding:'4px 10px',fontSize:12,fontWeight:700,color:'#818cf8'}}>👑 Admin</span>}
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:10}}>
        {[['Total Tasks\nCompleted',myStats.totalTasks,user.color],['Total\nPoints',myStats.totalPoints,'#fbbf24'],['Redeemed\nPoints',myStats.redeemedPoints,'#f472b6']].map(([l,v,c])=>(
          <div key={l} style={{...glass(),padding:'14px 8px',textAlign:'center'}}><div style={{fontSize:28,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,opacity:.55,marginTop:4,lineHeight:1.3,whiteSpace:'pre-line'}}>{l}</div></div>
        ))}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:14}}>
        {[['🏆 Weekly Wins',myW.weekly,'#fbbf24'],['📅 Monthly Wins',myW.monthly,'#818cf8']].map(([l,v,c])=>(
          <div key={l} style={{...glass(),padding:'12px 8px',textAlign:'center'}}><div style={{fontSize:24,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,opacity:.55,marginTop:4}}>{l}</div></div>
        ))}
      </div>
      {nxt?<div style={{background:`${nxt.color}11`,border:`1px solid ${nxt.color}33`,borderRadius:12,padding:'11px 16px',marginBottom:14,textAlign:'center',fontSize:13}}>Next: {nxt.emoji} <strong style={{color:nxt.color}}>{nxt.name}</strong> — {nxt.min-myStats.totalTasks} more task{nxt.min-myStats.totalTasks!==1?'s':''} to go!</div>
      :<div style={{textAlign:'center',color:'#a855f7',fontWeight:700,marginBottom:14,fontSize:14}}>🖤 Maximum Tier Achieved — Legendary!</div>}
      <Card title="📈 Weekly Task Progress" sub="Current week highlighted" style={{marginBottom:14}}>
        <WeeklyChart userId={user.id} completions={completions} color={user.color}/>
      </Card>
      <Card title="Tier Progress" style={{marginBottom:14}}>
        <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
          {TIERS.map(t=>{const ok=myStats.totalTasks>=t.min;return(<div key={t.name} style={{flex:1,minWidth:48,textAlign:'center',padding:'8px 2px',borderRadius:10,background:ok?t.bg:'rgba(255,255,255,0.02)',border:`1px solid ${ok?t.color:'rgba(255,255,255,0.06)'}`,opacity:ok?1:.35}}><div style={{fontSize:17}}>{t.emoji}</div><div style={{fontSize:9,marginTop:2,color:ok?t.color:'white',fontWeight:700}}>{t.name}</div><div style={{fontSize:9,opacity:.5}}>{t.min}+</div></div>);})}
        </div>
      </Card>
      {recent.length>0&&<Card title="Recent Activity"><div style={{display:'flex',flexDirection:'column'}}>{recent.map((c,i)=>{const ch=[...allChores,...recurringTasks].find(x=>x.id===c.choreId)||{name:'Task',emoji:'✅'};return(<div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:13}}><span>{ch.emoji}</span><span style={{flex:1}}>{ch.name}</span><span style={{color:'#fbbf24',fontWeight:700}}>+{c.points}</span><span style={{opacity:.4,fontSize:11}}>{c.date}</span></div>);})}</div></Card>}
    </div>
  );
}
function GuestProfile(){return(<div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:60,gap:16,textAlign:'center'}}><div style={{fontSize:64}}>👁️</div><div style={{fontSize:22,fontWeight:800}}>Viewing as Guest</div><div style={{opacity:.55,maxWidth:280,lineHeight:1.6}}>Log in as a family member to see your profile, stats, and tier progress.</div><div style={{display:'flex',gap:8,flexWrap:'wrap',justifyContent:'center',marginTop:8}}>{BASE_USERS.map(u=><div key={u.id} style={{background:`${u.color}22`,border:`1px solid ${u.color}44`,borderRadius:8,padding:'4px 12px',fontSize:12,color:u.color,fontWeight:600}}>{u.name}</div>)}</div></div>);}

// ── Shop ─────────────────────────────────────────────────────
function ShopContent({myStats,redemptions,user,onRedeem,onPurchaseThemeItem,onPurchaseBooster,shopMsg,isGuest,data,onPreview}){
  const [tab,setTab]=useState('rewards');
  const myR=[...redemptions].filter(r=>r.userId===user.id).reverse();
  const allItems=[...BASE_SHOP_ITEMS,...(data.dynamicShopItems||[])];
  const activeBst=getActiveBst(data);
  const hasPerm=gUP(data,user.id).includes('boost_perm');

  const ThemeCard=({item,type})=>{
    const owned=isUL(data,user.id,item.id),can=!isGuest&&!owned&&myStats.availablePoints>=item.cost;
    const conf=type==='theme'?TC[item.id]:null;
    const prevBg=type==='bg'?(item.preview||'#333'):(conf?.accent?`${conf.accent}22`:'rgba(255,255,255,0.05)');
    return(
      <div style={{...glass(),overflow:'hidden',position:'relative'}}>
        <div style={{height:60,background:prevBg,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26}}>{item.emoji}</div>
        <div style={{padding:'10px 12px'}}>
          <div style={{fontWeight:700,fontSize:13}}>{item.name}</div>
          <div style={{fontSize:11,opacity:.55,marginTop:2,marginBottom:6}}>{item.desc}</div>
          <div style={{fontSize:15,fontWeight:800,color:owned?'#34d399':'#fbbf24',marginBottom:8}}>{owned?'✓ Owned':(item.free?'Free':`${item.cost} pts`)}</div>
          <div style={{display:'flex',gap:6}}>
            <button onClick={()=>onPreview(type==='bg'?{bg:item.id,name:item.name}:{theme:item.id,name:item.name})} style={{flex:1,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'6px',color:'rgba(255,255,255,0.7)',cursor:'pointer',fontSize:12}}>👁️ Preview</button>
            <button onClick={()=>{if(!isGuest&&!owned)onPurchaseThemeItem(item);}} disabled={owned||(!can&&!item.free)} style={{flex:1,background:owned?'rgba(52,211,153,0.12)':can?'linear-gradient(135deg,#818cf8,#6366f1)':'rgba(255,255,255,0.06)',border:'none',borderRadius:8,padding:'6px',color:owned?'#34d399':can?'white':'#4b5563',cursor:owned||(!can&&!item.free)?'not-allowed':'pointer',fontWeight:700,fontSize:12}}>
              {owned?'Owned':isGuest?'View Only':can?'Buy ✨':`-${item.cost-myStats.availablePoints}`}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return(
    <div style={{padding:20,maxWidth:900,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16,flexWrap:'wrap',gap:12}}>
        <div><div style={{fontSize:22,fontWeight:800}}>🛍️ Rewards Shop</div><div style={{opacity:.55,fontSize:13,marginTop:2}}>Spend points on rewards, cosmetics & boosts!</div></div>
        {!isGuest&&<div style={{background:'rgba(251,191,36,0.14)',border:'1px solid rgba(251,191,36,0.3)',borderRadius:14,padding:'10px 20px',textAlign:'center'}}><div style={{fontSize:10,opacity:.6,letterSpacing:1}}>AVAILABLE</div><div style={{fontSize:24,fontWeight:800,color:'#fbbf24'}}>{myStats.availablePoints} pts</div></div>}
      </div>
      <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
        {[['rewards','🎁 Rewards'],['boosters','⚡ Boosters'],['cosmetics','💎 Cosmetics'],['backgrounds','🖼️ Backgrounds'],['themes','🎨 Themes']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 14px',borderRadius:10,background:tab===t?'rgba(129,140,248,0.25)':'rgba(255,255,255,0.06)',border:`1px solid ${tab===t?'#818cf8':'rgba(255,255,255,0.1)'}`,color:'white',cursor:'pointer',fontWeight:tab===t?700:400,fontSize:13}}>{l}</button>
        ))}
      </div>
      {isGuest&&<div style={{background:'rgba(148,163,184,0.1)',border:'1px solid rgba(148,163,184,0.2)',borderRadius:12,padding:'12px 16px',marginBottom:16,color:'#94a3b8',fontSize:13}}>👁️ Log in as a family member to purchase!</div>}
      {shopMsg&&<div style={{background:'rgba(52,211,153,0.14)',border:'1px solid rgba(52,211,153,0.3)',borderRadius:12,padding:'12px 16px',marginBottom:16,color:'#34d399',fontWeight:600}}>{shopMsg}</div>}

      {tab==='rewards'&&<>
        {!isGuest&&<div style={{...glass(),padding:'12px 16px',marginBottom:16,display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
          <div style={{fontSize:24}}>🎒</div>
          <div style={{flex:1,minWidth:120}}><div style={{fontWeight:700,fontSize:14}}>Inventory</div><div style={{fontSize:11,opacity:.5,marginTop:1}}>Consumable items you own — buy extras to stock up</div></div>
          <div style={{background:'rgba(251,146,60,0.14)',border:'1px solid rgba(251,146,60,0.35)',borderRadius:10,padding:'6px 12px',fontSize:13,fontWeight:700,color:'#fb923c',whiteSpace:'nowrap'}}>🛡️ {getSavers(data,user.id)} Streak Saver{getSavers(data,user.id)===1?'':'s'}</div>
        </div>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(175px,1fr))',gap:14,marginBottom:28}}>
          {allItems.map(item=>{const can=!isGuest&&myStats.availablePoints>=item.cost;return(
            <div key={item.id} style={{background:item.boss?'linear-gradient(135deg,rgba(168,85,247,0.18),rgba(236,72,153,0.14))':'rgba(255,255,255,0.05)',border:`1px solid ${item.boss?'rgba(168,85,247,0.4)':'rgba(255,255,255,0.08)'}`,borderRadius:16,padding:18,display:'flex',flexDirection:'column',gap:10,boxShadow:item.boss?'0 0 28px rgba(168,85,247,0.18)':'none'}}>
              {item.boss&&<div style={{fontSize:9,fontWeight:800,letterSpacing:2,color:'#a855f7',textAlign:'center',textTransform:'uppercase'}}>✨ BOSS REWARD</div>}
              <div style={{fontSize:36,textAlign:'center'}}>{item.emoji}</div>
              <div style={{fontWeight:700,textAlign:'center',fontSize:14,lineHeight:1.3}}>{item.name}</div>
              <div style={{fontSize:12,opacity:.55,textAlign:'center',flex:1}}>{item.desc}</div>
              <div style={{textAlign:'center',fontSize:20,fontWeight:800,color:can?'#fbbf24':'#6b7280'}}>{item.cost} pts</div>
              <button onClick={()=>{if(!isGuest)onRedeem(item);}} disabled={!can} style={{background:can?(item.boss?'linear-gradient(135deg,#a855f7,#ec4899)':'linear-gradient(135deg,#818cf8,#6366f1)'):'rgba(255,255,255,0.05)',border:'none',borderRadius:12,padding:'10px',color:can?'white':'#4b5563',cursor:can?'pointer':'not-allowed',fontWeight:700,fontSize:14}}>
                {isGuest?'View Only':can?'Redeem ✨':`Need ${item.cost-myStats.availablePoints} more`}
              </button>
            </div>
          );})}
        </div>
        {myR.length>0&&<><div style={{fontWeight:700,fontSize:16,marginBottom:10}}>📜 My Redemptions</div><div style={{display:'flex',flexDirection:'column',gap:6}}>{myR.map(r=><div key={r.id} style={{display:'flex',justifyContent:'space-between',padding:'10px 16px',background:'rgba(255,255,255,0.04)',borderRadius:10,fontSize:13}}><span>{r.itemName}</span><span style={{opacity:.45}}>{r.date} · -{r.cost} pts</span></div>)}</div></>}
      </>}

      {tab==='boosters'&&<>
        {activeBst&&<div style={{background:'rgba(251,191,36,0.1)',border:'1px solid rgba(251,191,36,0.3)',borderRadius:12,padding:'14px 18px',marginBottom:18,display:'flex',alignItems:'center',gap:12}}><div style={{fontSize:28}}>✨</div><div><div style={{fontWeight:700,color:'#fbbf24'}}>Global Booster Active — {activeBst.multiplier}x!</div><div style={{fontSize:12,opacity:.7,marginTop:2}}>All family members earn {activeBst.multiplier}x points · {Math.max(0,Math.ceil((activeBst.expiresAt-Date.now())/864e5))}d remaining</div></div></div>}
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:14}}>
          {BOOSTER_ITEMS.map(item=>{const can=!isGuest&&myStats.availablePoints>=item.cost,owned=item.permanent&&hasPerm;return(
            <div key={item.id} style={{background:'linear-gradient(135deg,rgba(251,191,36,0.1),rgba(249,115,22,0.08))',border:'1px solid rgba(251,191,36,0.25)',borderRadius:16,padding:20,display:'flex',flexDirection:'column',gap:10}}>
              <div style={{fontSize:40,textAlign:'center'}}>{item.emoji}</div>
              <div style={{fontWeight:800,fontSize:15,textAlign:'center'}}>{item.name}</div>
              <div style={{fontSize:12,opacity:.65,textAlign:'center',flex:1}}>{item.desc}</div>
              {!item.permanent&&<div style={{textAlign:'center',fontSize:12,color:'#94a3b8'}}>Duration: {item.durationDays} days · Global</div>}
              <div style={{textAlign:'center',fontSize:20,fontWeight:800,color:owned?'#34d399':can?'#fbbf24':'#6b7280'}}>{owned?'Owned':item.cost+' pts'}</div>
              <button onClick={()=>{if(!isGuest&&!owned)onPurchaseBooster(item);}} disabled={owned||!can} style={{background:owned?'rgba(52,211,153,0.15)':can?'linear-gradient(135deg,#f59e0b,#d97706)':'rgba(255,255,255,0.05)',border:'none',borderRadius:12,padding:'11px',color:owned?'#34d399':can?'white':'#4b5563',cursor:owned||!can?'not-allowed':'pointer',fontWeight:700,fontSize:14}}>
                {owned?'✓ Owned':isGuest?'View Only':can?'Activate ⚡':`Need ${item.cost-myStats.availablePoints} more`}
              </button>
            </div>
          );})}
        </div>
      </>}

      {tab==='cosmetics'&&<>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>🎗️ Nameplates <span style={{fontSize:11,opacity:.5,fontWeight:400}}>— Gradient accent behind your leaderboard row</span></div>
        <div style={{fontSize:12,opacity:.5,marginBottom:14}}>Equip from ⚙️ Settings after purchase</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:12,marginBottom:28}}>
          {NAMEPLATES.filter(n=>!n.free).map(np=>{
            const owned=isUL(data,user.id,np.id),can=!isGuest&&!owned&&myStats.availablePoints>=np.cost;
            return(
              <div key={np.id} style={{...glass(),overflow:'hidden'}}>
                <div style={{height:52,background:np.gradient||'rgba(255,255,255,0.03)',display:'flex',alignItems:'center',padding:'0 12px',gap:10}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:'rgba(255,255,255,0.18)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,flexShrink:0}}>A</div>
                  <span style={{fontWeight:600,fontSize:13}}>Alon</span>
                  <div style={{marginLeft:'auto',fontWeight:800,color:'#fbbf24',fontSize:13}}>100</div>
                </div>
                <div style={{padding:'10px 12px'}}>
                  <div style={{fontWeight:700,fontSize:13}}>{np.emoji} {np.name}</div>
                  <div style={{fontSize:11,opacity:.55,marginTop:2,marginBottom:8}}>{np.desc}</div>
                  <div style={{fontSize:15,fontWeight:800,color:owned?'#34d399':'#fbbf24',marginBottom:8}}>{owned?'✓ Owned':`${np.cost} pts`}</div>
                  <button onClick={()=>{if(!isGuest&&!owned)onPurchaseThemeItem(np);}} disabled={owned||!can} style={{width:'100%',background:owned?'rgba(52,211,153,0.12)':can?'linear-gradient(135deg,#818cf8,#6366f1)':'rgba(255,255,255,0.06)',border:'none',borderRadius:8,padding:'8px',color:owned?'#34d399':can?'white':'#4b5563',cursor:owned||!can?'not-allowed':'pointer',fontWeight:700,fontSize:13}}>
                    {owned?'Equip in Settings':isGuest?'View Only':can?'Buy ✨':`Need ${np.cost-myStats.availablePoints} more`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{fontSize:14,fontWeight:700,marginBottom:4}}>✨ Avatar Decorations <span style={{fontSize:11,opacity:.5,fontWeight:400}}>— Glowing ring around your profile picture</span></div>
        <div style={{fontSize:12,opacity:.5,marginBottom:14}}>Equip from ⚙️ Settings after purchase</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:12}}>
          {AVATAR_DECOS.filter(d=>!d.free).map(deco=>{
            const owned=isUL(data,user.id,deco.id),can=!isGuest&&!owned&&myStats.availablePoints>=deco.cost;
            return(
              <div key={deco.id} style={{...glass(),padding:14,textAlign:'center'}}>
                <div style={{display:'flex',justifyContent:'center',marginBottom:10}}>
                  <div className={deco.cls} style={{width:52,height:52,borderRadius:'50%',background:'linear-gradient(135deg,#818cf8,#818cf888)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,fontWeight:800,color:'white',boxSizing:'border-box'}}>A</div>
                </div>
                <div style={{fontWeight:700,fontSize:13}}>{deco.emoji} {deco.name}</div>
                <div style={{fontSize:11,opacity:.55,marginTop:2,marginBottom:8}}>{deco.desc}</div>
                <div style={{fontSize:15,fontWeight:800,color:owned?'#34d399':'#fbbf24',marginBottom:8}}>{owned?'✓ Owned':`${deco.cost} pts`}</div>
                <button onClick={()=>{if(!isGuest&&!owned)onPurchaseThemeItem(deco);}} disabled={owned||!can} style={{width:'100%',background:owned?'rgba(52,211,153,0.12)':can?'linear-gradient(135deg,#818cf8,#6366f1)':'rgba(255,255,255,0.06)',border:'none',borderRadius:8,padding:'8px',color:owned?'#34d399':can?'white':'#4b5563',cursor:owned||!can?'not-allowed':'pointer',fontWeight:700,fontSize:13}}>
                  {owned?'Equip in Settings':isGuest?'View Only':can?'Buy ✨':`Need ${deco.cost-myStats.availablePoints} more`}
                </button>
              </div>
            );
          })}
        </div>
      </>}

      {tab==='backgrounds'&&<>
        <div style={{opacity:.6,fontSize:13,marginBottom:14}}>🖼️ Equip after purchase in ⚙️ Settings · Preview free!</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:14}}>
          {[...BACKGROUNDS.filter(b=>!b.free),...(data.customBackgrounds||[]).map(b=>({...b,free:true}))].map(item=><ThemeCard key={item.id} item={item} type="bg"/>)}
        </div>
      </>}
      {tab==='themes'&&<>
        <div style={{opacity:.6,fontSize:13,marginBottom:14}}>🎨 Equip after purchase in ⚙️ Settings · Preview free!</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:14}}>
          {THEMES.filter(t=>!t.free).map(item=><ThemeCard key={item.id} item={item} type="theme"/>)}
        </div>
      </>}
    </div>
  );
}

// ── Settings ─────────────────────────────────────────────────
function SettingsContent({user,data,updateSettings,gotoShop}){
  const s=gUS(data,user.id),owned=id=>isUL(data,user.id,id);
  const set=patch=>updateSettings(patch);
  const hasPerm=gUP(data,user.id).includes('boost_perm');
  const customBgs=data.customBackgrounds||[];
  const SelBtn=({active,onClick,children,style={}})=>(
    <button onClick={onClick} style={{padding:'8px 16px',borderRadius:10,background:active?'rgba(129,140,248,0.28)':'rgba(255,255,255,0.06)',border:`1px solid ${active?'#818cf8':'rgba(255,255,255,0.1)'}`,color:'white',cursor:'pointer',fontWeight:active?700:400,fontSize:13,...style}}>{children}</button>
  );
  return(
    <div style={{padding:20,maxWidth:640,margin:'0 auto'}}>
      <div style={{fontSize:22,fontWeight:800,marginBottom:20}}>⚙️ Settings</div>
      <Card title="🧭 Quick Navigation Bar" sub="Shortcut icons in the header — great on desktop" style={{marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{fontSize:13,opacity:.7}}>Show tab icons in header for quick switching</div>
          <button onClick={()=>set({showQuickNav:!s.showQuickNav})} style={{background:s.showQuickNav?'rgba(52,211,153,0.18)':'rgba(255,255,255,0.06)',border:`1px solid ${s.showQuickNav?'rgba(52,211,153,0.4)':'rgba(255,255,255,0.15)'}`,borderRadius:10,padding:'8px 18px',color:s.showQuickNav?'#34d399':'white',cursor:'pointer',fontWeight:700,fontSize:13}}>{s.showQuickNav?'✓ Enabled':'Disabled'}</button>
        </div>
      </Card>
      <Card title="📌 Pinned Sidebar" sub="Keep the menu open on the left instead of the hamburger" style={{marginBottom:14}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
          <div style={{fontSize:13,opacity:.7}}>On by default on computers, off on phones</div>
          <button onClick={()=>set({pinSidebar:!(s.pinSidebar??(window.innerWidth>=700))})} style={{background:(s.pinSidebar??(window.innerWidth>=700))?'rgba(52,211,153,0.18)':'rgba(255,255,255,0.06)',border:`1px solid ${(s.pinSidebar??(window.innerWidth>=700))?'rgba(52,211,153,0.4)':'rgba(255,255,255,0.15)'}`,borderRadius:10,padding:'8px 18px',color:(s.pinSidebar??(window.innerWidth>=700))?'#34d399':'white',cursor:'pointer',fontWeight:700,fontSize:13,flexShrink:0,whiteSpace:'nowrap'}}>{(s.pinSidebar??(window.innerWidth>=700))?'✓ Pinned':'Hidden'}</button>
        </div>
      </Card>
      <Card title="✍️ Font" style={{marginBottom:14}}><div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{FONTS.map(f=><SelBtn key={f.id} active={s.font===f.id} onClick={()=>set({font:f.id})} style={{fontFamily:f.css}}>{f.name}</SelBtn>)}</div></Card>
      <Card title="🔠 Text Size" style={{marginBottom:14}}><div style={{display:'flex',gap:8}}>{FSIZES.map(fs=><SelBtn key={fs.id} active={s.fontSize===fs.id} onClick={()=>set({fontSize:fs.id})} style={{flex:1}}>{fs.name}</SelBtn>)}</div></Card>
      <Card title="⚡ Personal Multiplier" sub="Stacks with global boosters for 2x!" style={{marginBottom:14}}>
        {hasPerm?(<div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><div><div style={{fontSize:13,fontWeight:600}}>Golden Multiplier owned!</div><div style={{fontSize:11,opacity:.6,marginTop:2}}>Toggles 1.25x · stacks with any active global boost for 2x</div></div><button onClick={()=>set({permanentBoosterActive:!s.permanentBoosterActive})} style={{background:s.permanentBoosterActive?'rgba(251,191,36,0.18)':'rgba(255,255,255,0.06)',border:`1px solid ${s.permanentBoosterActive?'rgba(251,191,36,0.4)':'rgba(255,255,255,0.15)'}`,borderRadius:10,padding:'8px 18px',color:s.permanentBoosterActive?'#fbbf24':'white',cursor:'pointer',fontWeight:700,fontSize:13}}>{s.permanentBoosterActive?'✓ 1.25x On':'Off'}</button></div>)
        :(<div style={{fontSize:13,opacity:.6}}>🔒 Purchase the "Golden Multiplier" in Shop → Boosters. Stacks with global boosts for 2x!</div>)}
      </Card>
      <Card title="🎗️ Nameplate" sub="Gradient accent behind your leaderboard row — buy in Shop → Cosmetics" style={{marginBottom:14}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(115px,1fr))',gap:8}}>
          {NAMEPLATES.map(np=>{
            const o=owned(np.id)||np.free,active=(s.nameplate||'np0')===np.id;
            return(
              <div key={np.id} onClick={()=>o?set({nameplate:np.id}):gotoShop()} style={{borderRadius:10,overflow:'hidden',cursor:'pointer',border:`2px solid ${active?'#818cf8':'rgba(255,255,255,0.1)'}`,opacity:o?1:.5,position:'relative'}}>
                <div style={{height:40,background:np.gradient||'rgba(255,255,255,0.04)',display:'flex',alignItems:'center',padding:'0 8px',gap:6}}>
                  <div style={{width:20,height:20,borderRadius:'50%',background:'rgba(255,255,255,0.2)',fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>A</div>
                  <span style={{fontSize:10,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden'}}>{np.name||'None'}</span>
                </div>
                {!o&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)',fontSize:14}}>🔒</div>}
                {active&&<div style={{position:'absolute',top:3,right:3,background:'#818cf8',borderRadius:'50%',width:14,height:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:800}}>✓</div>}
              </div>
            );
          })}
        </div>
      </Card>
      <Card title="✨ Avatar Decoration" sub="Glowing ring around your profile picture — buy in Shop → Cosmetics" style={{marginBottom:14}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(84px,1fr))',gap:8}}>
          {AVATAR_DECOS.map(deco=>{
            const o=owned(deco.id)||deco.free,active=(s.avatarDeco||'ad0')===deco.id;
            return(
              <div key={deco.id} onClick={()=>o?set({avatarDeco:deco.id}):gotoShop()} style={{borderRadius:10,padding:'10px 4px',cursor:'pointer',border:`2px solid ${active?'#818cf8':'rgba(255,255,255,0.1)'}`,background:'rgba(255,255,255,0.04)',opacity:o?1:.5,position:'relative',textAlign:'center'}}>
                <div style={{display:'flex',justifyContent:'center',marginBottom:4}}>
                  <div className={deco.cls||''} style={{width:34,height:34,borderRadius:'50%',background:`linear-gradient(135deg,${user.color},${user.color}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,fontWeight:800,color:'white',boxSizing:'border-box'}}>{user.name[0]}</div>
                </div>
                <div style={{fontSize:9,fontWeight:600,opacity:.8}}>{deco.name||'None'}</div>
                {!o&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.3)',fontSize:14}}>🔒</div>}
                {active&&<div style={{position:'absolute',top:3,right:3,background:'#818cf8',borderRadius:'50%',width:14,height:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:800}}>✓</div>}
              </div>
            );
          })}
        </div>
      </Card>
      <Card title="🖼️ Background" sub="Locked items can be purchased in Shop" style={{marginBottom:14}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(105px,1fr))',gap:10}}>
          {[...BACKGROUNDS,...customBgs.map(b=>({...b,free:true}))].map(bg=>{const o=owned(bg.id)||bg.free,active=s.bg===bg.id;return(
            <div key={bg.id} onClick={()=>o?set({bg:bg.id}):gotoShop()} style={{borderRadius:12,overflow:'hidden',cursor:'pointer',border:`2px solid ${active?'#818cf8':'rgba(255,255,255,0.1)'}`,opacity:o?1:.55,position:'relative'}}>
              <div style={{height:55,background:bg.preview||'#333',backgroundImage:bg.imageData?`url(${bg.imageData})`:undefined,backgroundSize:'cover',backgroundPosition:'center'}}/>
              <div style={{padding:'5px 8px',background:'rgba(0,0,0,0.55)',fontSize:10,fontWeight:600}}>{bg.emoji||'📸'} {bg.name}</div>
              {!o&&<div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.25)',fontSize:20}}>🔒</div>}
              {active&&<div style={{position:'absolute',top:4,right:4,background:'#818cf8',borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800}}>✓</div>}
            </div>
          );})}
        </div>
      </Card>
      <Card title="🎨 Theme" sub="Locked items can be purchased in Shop" style={{marginBottom:14}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(135px,1fr))',gap:10}}>
          {THEMES.map(th=>{const o=owned(th.id),active=s.theme===th.id,conf=TC[th.id];return(
            <div key={th.id} onClick={()=>o?set({theme:th.id}):gotoShop()} style={{borderRadius:12,padding:'12px',cursor:'pointer',background:conf.accent?`${conf.accent}15`:'rgba(255,255,255,0.05)',border:`2px solid ${active?(conf.accent||'#818cf8'):'rgba(255,255,255,0.1)'}`,opacity:o?1:.55,position:'relative'}}>
              <div style={{fontSize:24,marginBottom:4}}>{th.emoji}</div>
              <div style={{fontWeight:700,fontSize:12}}>{th.name}</div>
              <div style={{fontSize:10,opacity:.6,marginTop:2}}>{th.desc}</div>
              {!o&&<div style={{position:'absolute',top:6,right:6,fontSize:14}}>🔒</div>}
              {active&&<div style={{position:'absolute',top:6,right:6,background:conf.accent||'#818cf8',borderRadius:'50%',width:18,height:18,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800}}>✓</div>}
            </div>
          );})}
        </div>
      </Card>
      <button onClick={()=>updateSettings({bg:'bg0',theme:'th0',font:'f0',fontSize:'md',showQuickNav:false,permanentBoosterActive:false,nameplate:'np0',avatarDeco:'ad0'})} style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:12,padding:'12px 24px',color:'#f87171',cursor:'pointer',fontWeight:600,fontSize:14}}>🔄 Reset All Settings to Default</button>
    </div>
  );
}

// ── Wishlist ─────────────────────────────────────────────────
function WishlistContent({user,data,update,isGuest}){
  const [tab,setTab]=useState('shop');const [sf,setSf]=useState({name:'',cost:''});const [ff,setFf]=useState('');const today=getToday();
  const wl=data.wishlist||{shopSuggestions:[],featureRequests:[]};
  const pS=(wl.shopSuggestions||[]).filter(s=>s.status==='pending'),pF=(wl.featureRequests||[]).filter(s=>s.status==='pending');
  const addS=()=>{if(!sf.name.trim()||!sf.cost)return;update(prev=>({...prev,wishlist:{...(prev.wishlist||{}),shopSuggestions:[...(prev.wishlist?.shopSuggestions||[]),{id:`ws_${Date.now()}`,name:sf.name.trim(),cost:Number(sf.cost),suggestedBy:user.id,suggestedByName:user.name,votes:{},createdAt:today,status:'pending'}]}}));setSf({name:'',cost:''});};
  const addF=()=>{if(!ff.trim())return;update(prev=>({...prev,wishlist:{...(prev.wishlist||{}),featureRequests:[...(prev.wishlist?.featureRequests||[]),{id:`wr_${Date.now()}`,desc:ff.trim(),suggestedBy:user.id,suggestedByName:user.name,votes:{},createdAt:today,status:'pending'}]}}));setFf('');};
  const vote=(type,id,val)=>{if(isGuest)return;update(prev=>({...prev,wishlist:{...(prev.wishlist||{}),[type]:((prev.wishlist||{})[type]||[]).map(s=>s.id===id?{...s,votes:{...s.votes,[user.id]:val}}:s)}}));};
  const SC=({s,type})=>{const mv=s.votes[user.id],yes=Object.values(s.votes).filter(v=>v==='y').length,no=Object.values(s.votes).filter(v=>v==='n').length,tot=yes+no,dl=Math.max(0,7-daysSince(s.createdAt));return(
    <div style={{...glass(),padding:'14px 16px',marginBottom:10}}>
      <div style={{fontWeight:700,fontSize:14,marginBottom:2}}>{type==='shopSuggestions'?`🛍️ ${s.name}`:`💡 ${s.desc}`}</div>
      {type==='shopSuggestions'&&<div style={{fontSize:12,color:'#fbbf24',marginBottom:4}}>Suggested: {s.cost} pts</div>}
      <div style={{fontSize:11,opacity:.4,marginBottom:10}}>by {s.suggestedByName} · {tot} vote{tot!==1?'s':''} · adds in {dl}d</div>
      <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
        {tot>0&&<div style={{fontSize:12,opacity:.65}}>👍 {yes} · 👎 {no}</div>}
        {!isGuest&&!mv&&<><button onClick={()=>vote(type,s.id,'y')} style={{background:'rgba(52,211,153,0.15)',border:'1px solid rgba(52,211,153,0.3)',borderRadius:8,padding:'6px 14px',color:'#34d399',cursor:'pointer',fontWeight:700,fontSize:13}}>👍 Yes</button><button onClick={()=>vote(type,s.id,'n')} style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'6px 14px',color:'#f87171',cursor:'pointer',fontWeight:700,fontSize:13}}>👎 No</button></>}
        {mv&&<div style={{fontSize:13,fontWeight:600,color:mv==='y'?'#34d399':'#f87171'}}>You voted: {mv==='y'?'👍 Yes':'👎 No'}</div>}
        {isGuest&&<div style={{fontSize:11,color:'#94a3b8'}}>Log in to vote</div>}
      </div>
    </div>
  );};
  return(
    <div style={{padding:20,maxWidth:680,margin:'0 auto'}}>
      <div style={{fontSize:22,fontWeight:800,marginBottom:4}}>🌟 Wishlist</div>
      <div style={{opacity:.5,fontSize:13,marginBottom:20}}>Suggest rewards & features · community votes decide what gets added!</div>
      <div style={{display:'flex',gap:8,marginBottom:18}}>{[['shop','🛍️ Shop Rewards'],['features','💡 Features']].map(([t,l])=><button key={t} onClick={()=>setTab(t)} style={{padding:'8px 18px',borderRadius:10,background:tab===t?'rgba(129,140,248,0.25)':'rgba(255,255,255,0.06)',border:`1px solid ${tab===t?'#818cf8':'rgba(255,255,255,0.1)'}`,color:'white',cursor:'pointer',fontWeight:tab===t?700:400,fontSize:13}}>{l}</button>)}</div>
      {tab==='shop'&&<>{!isGuest&&<Card title="💡 Suggest a Shop Reward" sub="Auto-added after 1 week if more Yes than No" style={{marginBottom:16}}><div style={{display:'flex',gap:8,flexWrap:'wrap'}}><input value={sf.name} onChange={e=>setSf(p=>({...p,name:e.target.value}))} placeholder="Reward name..." style={{...inp(),flex:1}}/><input type="number" value={sf.cost} onChange={e=>setSf(p=>({...p,cost:e.target.value}))} placeholder="pts" style={{...inp(),width:70}}/><button onClick={addS} style={{background:'#818cf8',border:'none',borderRadius:8,padding:'7px 16px',color:'white',cursor:'pointer',fontWeight:700}}>+ Add</button></div></Card>}
      {pS.length===0?<div style={{textAlign:'center',opacity:.4,marginTop:40,fontSize:14}}>No shop suggestions yet 🛍️</div>:pS.map(s=><SC key={s.id} s={s} type="shopSuggestions"/>)}</>}
      {tab==='features'&&<>{!isGuest&&<Card title="🔧 Request a Feature" style={{marginBottom:16}}><div style={{display:'flex',gap:8}}><input value={ff} onChange={e=>setFf(e.target.value)} placeholder="Describe your idea..." style={{...inp(),flex:1}}/><button onClick={addF} style={{background:'#818cf8',border:'none',borderRadius:8,padding:'7px 16px',color:'white',cursor:'pointer',fontWeight:700}}>+ Add</button></div></Card>}
      {pF.length===0?<div style={{textAlign:'center',opacity:.4,marginTop:40,fontSize:14}}>No feature requests yet 💡</div>:pF.map(s=><SC key={s.id} s={s} type="featureRequests"/>)}</>}
    </div>
  );
}

function ThemePreviewSamples({pvTh}){
  const [pvDone,setPvDone]=useState({});
  const tc=TC[pvTh]||TC.th0;
  const sampleChores=[
    {id:'pv1',name:'Take out the trash',points:10,emoji:'🗑️'},
    {id:'pv2',name:'Vacuum living room', points:15,emoji:'🧹'},
    {id:'pv3',name:'Feed the pets',      points:5, emoji:'🐾'},
  ];
  return(
    <div>
      <div style={{fontSize:11,opacity:.5,marginBottom:8}}>
        Previewing: <strong>{THEMES.find(t=>t.id===pvTh)?.name}</strong> — click tasks to toggle!
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:6}}>
        {sampleChores.map((c,i)=>(
          <ChoreItem key={c.id} chore={c} done={!!pvDone[c.id]} doer={pvDone[c.id]?{id:'alon'} : null}
            myId="alon" isGuest={false}
            onToggle={()=>setPvDone(p=>({...p,[c.id]:!p[c.id]}))}
            color="#818cf8" tc={tc} idx={i} onAnim={()=>{}}
          />
        ))}
      </div>
    </div>
  );
}

function ConsolePage({data,update}){
  const [ct,setCt]=useState('chores');
  const [editC,setEditC]=useState(null),[editR,setEditR]=useState(null);
  const [newC,setNewC]=useState({name:'',points:'',emoji:'⭐'});
  const [newR,setNewR]=useState({name:'',points:'',emoji:'🔄',dayOfMonth:'1',frequency:'monthly'});
  const [pvTh,setPvTh]=useState(null),[pvBg,setPvBg]=useState(null);
  const [bgName,setBgName]=useState(''),[bgData,setBgData]=useState(null);
  const [nuForm,setNuForm]=useState({name:'',color:'#818cf8'});
  const [conf,setConf]=useState({});
  const bgRef=useRef(null);
  const ov=data.choreOverrides||{},dynUsers=data.dynamicUsers||[];
  const stats=compStats(data.completions,data.redemptions,data);
  const allDC=[...BASE_CHORES.map(c=>({...c,...(ov[c.id]||{})})),...data.customChores];
  const allFam=getFam(data);
  const sc=()=>{if(!editC)return;const ib=!!BASE_CHORES.find(c=>c.id===editC.id);if(ib)update(prev=>({...prev,choreOverrides:{...(prev.choreOverrides||{}),[editC.id]:{name:editC.name,points:Number(editC.points),emoji:editC.emoji}}}));else update(prev=>({...prev,customChores:prev.customChores.map(c=>c.id===editC.id?{...c,name:editC.name,points:Number(editC.points),emoji:editC.emoji}:c)}));setEditC(null);};
  const dc=id=>{const ib=!!BASE_CHORES.find(c=>c.id===id);if(ib){update(prev=>{const o={...(prev.choreOverrides||{})};delete o[id];return{...prev,choreOverrides:o};});}else update(prev=>({...prev,customChores:prev.customChores.filter(c=>c.id!==id)}));};
  const ac=()=>{if(!newC.name.trim()||!newC.points)return;update(prev=>({...prev,customChores:[...prev.customChores,{id:`cc_${Date.now()}`,name:newC.name.trim(),points:Number(newC.points),emoji:newC.emoji||'⭐'}]}));setNewC({name:'',points:'',emoji:'⭐'});};
  const sr=()=>{if(!editR)return;const dom=Math.min(31,Math.max(1,Number(editR.dayOfMonth)||1));update(prev=>({...prev,recurringTasks:prev.recurringTasks.map(t=>t.id===editR.id?{...t,name:editR.name,points:Number(editR.points),emoji:editR.emoji,dayOfMonth:dom,frequency:editR.frequency||'monthly'}:t)}));setEditR(null);};
  const trd=task=>{const today=getToday(),{done}=getRecStatus(task);update(prev=>({...prev,recurringTasks:prev.recurringTasks.map(t=>t.id===task.id?{...t,lastCompleted:done?null:today,lastCompletedBy:done?null:'alon'}:t)}));};
  const ar=()=>{if(!newR.name.trim()||!newR.points)return;update(prev=>({...prev,recurringTasks:[...prev.recurringTasks,{id:`r_${Date.now()}`,name:newR.name.trim(),points:Number(newR.points),emoji:newR.emoji||'🔄',dayOfMonth:Math.min(31,Math.max(1,Number(newR.dayOfMonth)||1)),frequency:newR.frequency||'monthly'}]}));setNewR({name:'',points:'',emoji:'🔄',dayOfMonth:'1',frequency:'monthly'});};
  const dr=id=>update(prev=>({...prev,recurringTasks:prev.recurringTasks.filter(t=>t.id!==id)}));
  const resetAv=uid=>update(prev=>({...prev,profilePics:{...(prev.profilePics||{}),[uid]:null}}));
  const resetSt=uid=>update(prev=>({...prev,completions:prev.completions.filter(c=>c.userId!==uid),redemptions:prev.redemptions.filter(r=>r.userId!==uid),purchases:{...(prev.purchases||{}),[uid]:[]},wins:{...(prev.wins||{}),[uid]:{weekly:0,monthly:0}},userSettings:{...(prev.userSettings||{}),[uid]:{}},questClaims:{...(prev.questClaims||{}),[uid]:{}},achievementsEarned:{...(prev.achievementsEarned||{}),[uid]:{}},chat:(prev.chat||[]).filter(m=>m.userId!==uid)}));
  const delU=uid=>update(prev=>({...prev,dynamicUsers:(prev.dynamicUsers||[]).filter(u=>u.id!==uid),completions:prev.completions.filter(c=>c.userId!==uid),redemptions:prev.redemptions.filter(r=>r.userId!==uid)}));
  const createU=()=>{if(!nuForm.name.trim())return;const n=nuForm.name.trim(),id=`u_${n.toLowerCase().replace(/\s+/g,'_')}_${Date.now()}`,pw=n.toLowerCase().replace(/\s+/g,'')+`123`;update(prev=>({...prev,dynamicUsers:[...(prev.dynamicUsers||[]),{id,name:n,color:nuForm.color,password:pw}]}));setNuForm({name:'',color:'#818cf8'});};
  const handleBgUpload=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=ev=>setBgData(ev.target.result);r.readAsDataURL(f);};
  const addBg=()=>{if(!bgName.trim()||!bgData)return;update(prev=>({...prev,customBackgrounds:[...(prev.customBackgrounds||[]),{id:`cbg_${Date.now()}`,name:bgName.trim(),imageData:bgData,cost:0,free:true}]}));setBgName('');setBgData(null);if(bgRef.current)bgRef.current.value='';};
  const rmBg=id=>update(prev=>({...prev,customBackgrounds:(prev.customBackgrounds||[]).filter(b=>b.id!==id)}));
  const ask=(uid,act)=>setConf(p=>({...p,[`${uid}_${act}`]:true}));
  const isAsk=(uid,act)=>!!conf[`${uid}_${act}`];
  const clrConf=()=>setConf({});
  const row={background:'rgba(255,255,255,0.04)',borderRadius:10,padding:'8px 12px'};
  const EB=({onClick})=><button onClick={onClick} style={{background:'rgba(129,140,248,0.2)',border:'1px solid rgba(129,140,248,0.3)',borderRadius:8,padding:'4px 10px',color:'#818cf8',cursor:'pointer',fontSize:12,fontWeight:600,flexShrink:0}}>Edit</button>;
  const SB=({onClick})=><button onClick={onClick} style={{background:'#34d399',border:'none',borderRadius:8,padding:'6px 14px',color:'white',cursor:'pointer',fontWeight:700,fontSize:13,flexShrink:0}}>Save</button>;
  const CB=({onClick})=><button onClick={onClick} style={{background:'rgba(255,255,255,0.08)',border:'none',borderRadius:8,padding:'6px 12px',color:'white',cursor:'pointer',fontSize:13,flexShrink:0}}>Cancel</button>;
  const DB=({onClick,label='Del'})=><button onClick={onClick} style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,padding:'4px 10px',color:'#f87171',cursor:'pointer',fontSize:12,flexShrink:0}}>{label}</button>;
  const pvBgEntry=pvBg?[...BACKGROUNDS,...(data.customBackgrounds||[])].find(b=>b.id===pvBg):null;
  const tabs=[['chores','📋 Chores'],['recurring','🔄 Recurring'],['people','👥 People'],['preview','🎨 Preview'],['uploads','🖼️ Uploads']];
  return(
    <div style={{padding:20,maxWidth:740,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20,flexWrap:'wrap'}}>
        <div style={{fontSize:30}}>🔧</div>
        <div><div style={{fontSize:20,fontWeight:800}}>Admin Console</div><div style={{fontSize:12,opacity:.5}}>Alon's control panel</div></div>
        <div style={{marginLeft:'auto',background:'rgba(129,140,248,0.2)',border:'1px solid rgba(129,140,248,0.4)',borderRadius:8,padding:'4px 12px',fontSize:12,color:'#818cf8',fontWeight:700}}>👑 Admin</div>
      </div>
      <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>{tabs.map(([t,l])=><button key={t} onClick={()=>setCt(t)} style={{padding:'7px 14px',borderRadius:10,background:ct===t?'rgba(129,140,248,0.25)':'rgba(255,255,255,0.06)',border:`1px solid ${ct===t?'#818cf8':'rgba(255,255,255,0.1)'}`,color:'white',cursor:'pointer',fontWeight:ct===t?700:400,fontSize:12}}>{l}</button>)}</div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,padding:'12px 16px',marginBottom:18}}>
        <div>
          <div style={{fontWeight:700,fontSize:13}}>🔐 Login Screen Style</div>
          <div style={{fontSize:11,opacity:.5,marginTop:2}}>{data.loginMode==='password'?'Password mode — username & password required':'Simple mode — tap your name to log in'}</div>
        </div>
        <button onClick={()=>update(prev=>({...prev,loginMode:prev.loginMode==='password'?'simple':'password'}))} style={{background:data.loginMode!=='password'?'rgba(52,211,153,0.18)':'rgba(255,255,255,0.06)',border:`1px solid ${data.loginMode!=='password'?'rgba(52,211,153,0.4)':'rgba(255,255,255,0.15)'}`,borderRadius:10,padding:'8px 18px',color:data.loginMode!=='password'?'#34d399':'white',cursor:'pointer',fontWeight:700,fontSize:13,flexShrink:0}}>
          {data.loginMode!=='password'?'✓ Simple':'Password'}
        </button>
      </div>

      {ct==='chores'&&<Card title="📋 Regular Chores" sub="Edit emoji, name, and points">
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {allDC.map(chore=>{const ie=editC&&editC.id===chore.id,ib=!!BASE_CHORES.find(c=>c.id===chore.id),hov=ib&&!!ov[chore.id];return(
            <div key={chore.id} style={row}>{ie?(
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{display:'flex',gap:8,alignItems:'center'}}><input value={editC.emoji} onChange={e=>setEditC(p=>({...p,emoji:e.target.value}))} style={{...inp(),width:50}}/><input value={editC.name} onChange={e=>setEditC(p=>({...p,name:e.target.value}))} style={{...inp(),flex:1}}/></div>
                <div style={{display:'flex',gap:8,alignItems:'center'}}><input type="number" value={editC.points} onChange={e=>setEditC(p=>({...p,points:e.target.value}))} placeholder="pts" style={{...inp(),width:78}}/><SB onClick={sc}/><CB onClick={()=>setEditC(null)}/></div>
              </div>
            ):(
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <span style={{fontSize:18,flexShrink:0}}>{chore.emoji}</span><span style={{flex:1,fontSize:13,fontWeight:500}}>{chore.name}</span>
                {hov&&<span style={{fontSize:10,color:'#818cf8',opacity:.7,flexShrink:0}}>edited</span>}
                <span style={{fontSize:12,color:'#fbbf24',fontWeight:700,background:'rgba(251,191,36,0.1)',borderRadius:6,padding:'2px 8px',flexShrink:0}}>{chore.points}pts</span>
                <EB onClick={()=>setEditC({...chore})}/>
                {ib&&hov&&<button onClick={()=>dc(chore.id)} style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:'4px 10px',color:'rgba(255,255,255,0.4)',cursor:'pointer',fontSize:11,flexShrink:0}}>Reset</button>}
                {!ib&&<DB onClick={()=>dc(chore.id)} label="Delete"/>}
              </div>
            )}</div>
          );})}
          <div style={{background:'rgba(129,140,248,0.06)',border:'1px dashed rgba(129,140,248,0.25)',borderRadius:10,padding:12}}>
            <div style={{fontSize:12,opacity:.6,marginBottom:8,fontWeight:600}}>+ Add New Chore</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
              <input value={newC.emoji} onChange={e=>setNewC(p=>({...p,emoji:e.target.value}))} style={{...inp(),width:50}}/>
              <input value={newC.name} onChange={e=>setNewC(p=>({...p,name:e.target.value}))} placeholder="Chore name..." style={{...inp(),flex:1}}/>
              <input type="number" value={newC.points} onChange={e=>setNewC(p=>({...p,points:e.target.value}))} placeholder="pts" style={{...inp(),width:68}}/>
              <button onClick={ac} style={{background:'#818cf8',border:'none',borderRadius:8,padding:'7px 16px',color:'white',cursor:'pointer',fontWeight:700,fontSize:13,flexShrink:0}}>+ Add</button>
            </div>
          </div>
        </div>
      </Card>}

      {ct==='recurring'&&<Card title="🔄 Recurring Tasks" sub="Frequency, completion toggle, and due dates">
        <div style={{display:'flex',flexDirection:'column',gap:6}}>
          {data.recurringTasks.map(task=>{const ie=editR&&editR.id===task.id,{done}=getRecStatus(task);return(
            <div key={task.id} style={row}>{ie?(
              <div style={{display:'flex',flexDirection:'column',gap:8}}>
                <div style={{display:'flex',gap:8,alignItems:'center'}}><input value={editR.emoji} onChange={e=>setEditR(p=>({...p,emoji:e.target.value}))} style={{...inp(),width:50}}/><input value={editR.name} onChange={e=>setEditR(p=>({...p,name:e.target.value}))} style={{...inp(),flex:1}}/></div>
                <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                  <input type="number" value={editR.points} onChange={e=>setEditR(p=>({...p,points:e.target.value}))} placeholder="pts" style={{...inp(),width:68}}/>
                  <select value={editR.frequency||'monthly'} onChange={e=>setEditR(p=>({...p,frequency:e.target.value}))} style={{...inp(),cursor:'pointer'}}>
                    <option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="monthly">Monthly</option>
                  </select>
                  {(editR.frequency||'monthly')==='monthly'&&<><span style={{fontSize:12,opacity:.6,whiteSpace:'nowrap'}}>Day:</span><input type="number" value={editR.dayOfMonth} onChange={e=>setEditR(p=>({...p,dayOfMonth:e.target.value}))} placeholder="1-31" style={{...inp(),width:58}}/></>}
                  <SB onClick={sr}/><CB onClick={()=>setEditR(null)}/>
                </div>
              </div>
            ):(
              <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                <span style={{fontSize:18,flexShrink:0}}>{task.emoji}</span>
                <div style={{flex:1,minWidth:80}}><div style={{fontSize:13,fontWeight:500}}>{task.name}</div><div style={{fontSize:10,opacity:.45}}>{freqLabel(task)}</div></div>
                <span style={{fontSize:12,color:'#fbbf24',fontWeight:700,background:'rgba(251,191,36,0.1)',borderRadius:6,padding:'2px 8px',flexShrink:0}}>{task.points}pts</span>
                <button onClick={()=>trd(task)} style={{background:done?'rgba(52,211,153,0.15)':'rgba(255,255,255,0.06)',border:`1px solid ${done?'rgba(52,211,153,0.4)':'rgba(255,255,255,0.1)'}`,borderRadius:8,padding:'4px 10px',color:done?'#34d399':'rgba(255,255,255,0.55)',cursor:'pointer',fontSize:12,fontWeight:600,flexShrink:0,whiteSpace:'nowrap'}}>{done?'✓ Done':'Mark Done'}</button>
                <EB onClick={()=>setEditR({...task})}/><DB onClick={()=>dr(task.id)}/>
              </div>
            )}</div>
          );})}
          <div style={{background:'rgba(129,140,248,0.06)',border:'1px dashed rgba(129,140,248,0.25)',borderRadius:10,padding:12}}>
            <div style={{fontSize:12,opacity:.6,marginBottom:8,fontWeight:600}}>+ Add Recurring Task</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
              <input value={newR.emoji} onChange={e=>setNewR(p=>({...p,emoji:e.target.value}))} style={{...inp(),width:50}}/>
              <input value={newR.name} onChange={e=>setNewR(p=>({...p,name:e.target.value}))} placeholder="Task name..." style={{...inp(),flex:1}}/>
              <input type="number" value={newR.points} onChange={e=>setNewR(p=>({...p,points:e.target.value}))} placeholder="pts" style={{...inp(),width:68}}/>
              <select value={newR.frequency} onChange={e=>setNewR(p=>({...p,frequency:e.target.value}))} style={{...inp(),cursor:'pointer'}}>
                <option value="weekly">Weekly</option><option value="biweekly">Biweekly</option><option value="monthly">Monthly</option>
              </select>
              {newR.frequency==='monthly'&&<><span style={{fontSize:12,opacity:.6,whiteSpace:'nowrap'}}>Day:</span><input type="number" value={newR.dayOfMonth} onChange={e=>setNewR(p=>({...p,dayOfMonth:e.target.value}))} placeholder="1-31" style={{...inp(),width:58}}/></>}
              <button onClick={ar} style={{background:'#818cf8',border:'none',borderRadius:8,padding:'7px 16px',color:'white',cursor:'pointer',fontWeight:700,fontSize:13,flexShrink:0}}>+ Add</button>
            </div>
          </div>
        </div>
      </Card>}

      {ct==='people'&&<div onClick={clrConf}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:12,marginBottom:20}}>
          {allFam.map(u=>{
            const s=stats[u.id]||{totalTasks:0,totalPoints:0,redeemedPoints:0},tier=getTier(s.totalTasks),isDyn=!!dynUsers.find(du=>du.id===u.id),pic=(data.profilePics||{})[u.id]||null;
            return(
              <div key={u.id} style={{...glass(),padding:14}}>
                <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                  <Avatar user={u} size={42} imgSrc={pic}/>
                  <div><div style={{fontWeight:700,fontSize:14}}>{u.name}</div><TierBadge tier={tier} sm/></div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5,marginBottom:10}}>
                  {[['Tasks',s.totalTasks,u.color],['Points',s.totalPoints,'#fbbf24'],['Redeeem',s.redeemedPoints,'#f472b6']].map(([l,v,c])=>(
                    <div key={l} style={{background:'rgba(255,255,255,0.05)',borderRadius:8,padding:'5px 3px',textAlign:'center'}}><div style={{fontSize:15,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:8,opacity:.5}}>{l}</div></div>
                  ))}
                </div>
                <div style={{display:'flex',gap:5,marginBottom:6}}>
                  {isAsk(u.id,'avt')?<button onClick={()=>{resetAv(u.id);clrConf();}} style={{flex:1,background:'rgba(239,68,68,0.3)',border:'none',borderRadius:8,padding:'6px',color:'white',cursor:'pointer',fontSize:12,fontWeight:700}}>Confirm?</button>:<button onClick={e=>{e.stopPropagation();ask(u.id,'avt');}} style={{flex:1,background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,padding:'5px',color:'#f87171',cursor:'pointer',fontSize:11}}>Reset Photo</button>}
                  {isAsk(u.id,'sts')?<button onClick={()=>{resetSt(u.id);clrConf();}} style={{flex:1,background:'rgba(239,68,68,0.3)',border:'none',borderRadius:8,padding:'6px',color:'white',cursor:'pointer',fontSize:12,fontWeight:700}}>Confirm?</button>:<button onClick={e=>{e.stopPropagation();ask(u.id,'sts');}} style={{flex:1,background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:8,padding:'5px',color:'#f87171',cursor:'pointer',fontSize:11}}>Reset All</button>}
                  {isDyn&&(isAsk(u.id,'del')?<button onClick={()=>{delU(u.id);clrConf();}} style={{background:'rgba(239,68,68,0.3)',border:'none',borderRadius:8,padding:'6px 8px',color:'white',cursor:'pointer',fontSize:12,fontWeight:700,flexShrink:0}}>Confirm?</button>:<button onClick={e=>{e.stopPropagation();ask(u.id,'del');}} style={{background:'rgba(239,68,68,0.18)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:8,padding:'5px 8px',color:'#f87171',cursor:'pointer',fontSize:11,flexShrink:0}}>✕</button>)}
                </div>
                <div style={{fontSize:9,opacity:.35}}>Login: {u.name.toLowerCase()} / {u.password}</div>
              </div>
            );
          })}
        </div>
        <div style={{...glass(),padding:16,border:'1px dashed rgba(129,140,248,0.3)'}}>
          <div style={{fontSize:13,fontWeight:700,marginBottom:10}}>+ Create New Family Member</div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center'}}>
            <input value={nuForm.name} onChange={e=>setNuForm(p=>({...p,name:e.target.value}))} placeholder="Name..." style={{...inp(),flex:1}}/>
            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>{UCOLS.map(c=><div key={c} onClick={()=>setNuForm(p=>({...p,color:c}))} style={{width:20,height:20,borderRadius:'50%',background:c,cursor:'pointer',border:`2px solid ${nuForm.color===c?'white':'transparent'}`,flexShrink:0}}/>)}</div>
            <button onClick={createU} style={{background:'#818cf8',border:'none',borderRadius:8,padding:'7px 16px',color:'white',cursor:'pointer',fontWeight:700,flexShrink:0}}>+ Add</button>
          </div>
          <div style={{fontSize:10,opacity:.4,marginTop:6}}>Auto-login: [name] / [name]123 (case-insensitive)</div>
        </div>
      </div>}

      {ct==='preview'&&<div>
        <Card title="🎨 Theme Preview" sub="Click to preview on sample chores — toggle tasks too!" style={{marginBottom:16}}>
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:pvTh?14:0}}>
            {THEMES.map(t=><button key={t.id} onClick={()=>setPvTh(t.id===pvTh?null:t.id)} style={{background:pvTh===t.id?'rgba(129,140,248,0.28)':'rgba(255,255,255,0.06)',border:`1px solid ${pvTh===t.id?'#818cf8':'rgba(255,255,255,0.1)'}`,borderRadius:8,padding:'6px 12px',color:'white',cursor:'pointer',fontSize:12,fontWeight:pvTh===t.id?700:400}}>{t.emoji} {t.name}</button>)}
          </div>
          {pvTh&&<ThemePreviewSamples pvTh={pvTh}/>}
        </Card>
        <Card title="🖼️ Background Preview" sub="Click a background to see a full color preview">
          <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:pvBg?14:0}}>
            {[...BACKGROUNDS,...(data.customBackgrounds||[])].map(bg=>(
              <button key={bg.id} onClick={()=>setPvBg(bg.id===pvBg?null:bg.id)} style={{background:pvBg===bg.id?'rgba(129,140,248,0.28)':'rgba(255,255,255,0.06)',border:`1px solid ${pvBg===bg.id?'#818cf8':'rgba(255,255,255,0.1)'}`,borderRadius:8,padding:'6px 12px',color:'white',cursor:'pointer',fontSize:12,fontWeight:pvBg===bg.id?700:400}}>{bg.emoji||'📸'} {bg.name}</button>
            ))}
          </div>
          {pvBgEntry&&<div style={{borderRadius:14,overflow:'hidden',border:'1px solid rgba(255,255,255,0.12)'}}>
            <div style={{height:120,background:pvBgEntry.preview||'#333',backgroundImage:pvBgEntry.imageData?`url(${pvBgEntry.imageData})`:undefined,backgroundSize:'cover',backgroundPosition:'center',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <div style={{background:'rgba(0,0,0,0.5)',borderRadius:12,padding:'8px 18px',fontWeight:700,fontSize:15}}>{pvBgEntry.emoji||'📸'} {pvBgEntry.name}</div>
            </div>
          </div>}
        </Card>
      </div>}

      {ct==='uploads'&&<Card title="🖼️ Upload Custom Background" sub="Free for all family members · appears in Shop & Settings">
        <div style={{display:'flex',gap:8,flexWrap:'wrap',alignItems:'center',marginBottom:10}}>
          <input value={bgName} onChange={e=>setBgName(e.target.value)} placeholder="Background name..." style={{...inp(),flex:1}}/>
          <input ref={bgRef} type="file" accept="image/*" onChange={handleBgUpload} style={{display:'none'}}/>
          <button onClick={()=>bgRef.current.click()} style={{background:'rgba(129,140,248,0.2)',border:'1px solid rgba(129,140,248,0.3)',borderRadius:8,padding:'7px 14px',color:'#a5b4fc',cursor:'pointer',fontWeight:600,fontSize:13,flexShrink:0}}>📁 Choose Image</button>
        </div>
        {bgData&&<div style={{display:'flex',alignItems:'center',gap:12,marginBottom:12,padding:10,background:'rgba(255,255,255,0.04)',borderRadius:10}}>
          <img src={bgData} alt="preview" style={{width:96,height:60,objectFit:'cover',borderRadius:8,border:'1px solid rgba(255,255,255,0.15)'}}/>
          <div><div style={{fontSize:13,fontWeight:600,marginBottom:6}}>{bgName||'Unnamed'}</div><button onClick={addBg} style={{background:'#34d399',border:'none',borderRadius:8,padding:'8px 18px',color:'white',cursor:'pointer',fontWeight:700,fontSize:13}}>Add to Shop ✨</button></div>
        </div>}
        {(data.customBackgrounds||[]).length>0&&<div style={{display:'flex',flexDirection:'column',gap:6,marginTop:8}}>
          {(data.customBackgrounds||[]).map(bg=>(
            <div key={bg.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 10px',background:'rgba(255,255,255,0.04)',borderRadius:10}}>
              <img src={bg.imageData} alt={bg.name} style={{width:56,height:36,objectFit:'cover',borderRadius:6,flexShrink:0}}/>
              <span style={{flex:1,fontSize:13,fontWeight:500}}>{bg.name}</span>
              <span style={{fontSize:11,color:'#94a3b8'}}>free</span>
              <button onClick={()=>rmBg(bg.id)} style={{background:'rgba(239,68,68,0.15)',border:'1px solid rgba(239,68,68,0.25)',borderRadius:6,padding:'3px 8px',color:'#f87171',cursor:'pointer',fontSize:11,flexShrink:0}}>Remove</button>
            </div>
          ))}
        </div>}
      </Card>}
    </div>
  );
}

const ONBOARDING_STEPS = [
  { emoji:'🏠', title:'Welcome to Family Chores!', body:'This app helps your whole family track chores, earn points, and compete on the leaderboard. Let\'s take a quick tour!' },
  { emoji:'✅', title:'Check Off Chores', body:'Every chore you complete earns you points. Tap a chore to mark it done — it locks for everyone else that day!', demoChore:true },
  { emoji:'🏆', title:'Leaderboard', body:'See who\'s on top this week or month. Click anyone\'s name to view their profile and stats. Build streaks by checking in every day!' },
  { emoji:'🎯', title:'Quests & Achievements', body:'Complete personal and family challenges to earn bonus points and unlock special achievements. Check the Quests page daily!' },
  { emoji:'🛍️', title:'Rewards Shop', body:'Spend your hard-earned points on real rewards — from picking movie night to the ultimate boss reward: a family restaurant visit!' },
  { emoji:'🎨', title:'Pick a Free Theme!', body:'The app comes with themes you can unlock. Here\'s one on us — pick your favorite!', themePicker:true },
  { emoji:'🌟', title:'You\'re all set!', body:'Head to ⚙️ Settings anytime to change your theme, background, font and more. Have fun! 🎉' },
];

function DemoChore() {
  const [done, setDone] = useState(false);
  const [popped, setPopped] = useState(false);
  const handleClick = () => {
    setDone(d => !d);
    if (!done) { setPopped(true); setTimeout(() => setPopped(false), 600); }
  };
  return (
    <div style={{marginTop:16}}>
      <div style={{fontSize:12,opacity:.55,textAlign:'center',marginBottom:10}}>👇 Try it — tap to check off!</div>
      <div onClick={handleClick} style={{display:'flex',alignItems:'center',gap:12,padding:'12px 16px',borderRadius:14,cursor:'pointer',background:done?'rgba(129,140,248,0.18)':'rgba(255,255,255,0.06)',border:`1px solid ${done?'rgba(129,140,248,0.5)':'rgba(255,255,255,0.12)'}`,transition:'all .2s',transform:popped?'scale(1.03)':'scale(1)'}}>
        <div style={{width:24,height:24,borderRadius:7,border:`2px solid ${done?'#818cf8':'rgba(255,255,255,0.3)'}`,background:done?'#818cf8':'transparent',display:'flex',alignItems:'center',justifyContent:'center',transition:'all .2s',flexShrink:0}}>
          {done&&<span style={{fontSize:14,color:'white'}}>✓</span>}
        </div>
        <div style={{fontSize:20}}>🧹</div>
        <div style={{flex:1,fontWeight:500,fontSize:14,textDecoration:done?'line-through':'none',opacity:done?.6:1}}>Vacuum the living room</div>
        <div style={{fontSize:13,fontWeight:700,color:done?'#818cf8':'#fbbf24',background:done?'rgba(129,140,248,0.15)':'rgba(251,191,36,0.12)',borderRadius:8,padding:'3px 10px'}}>+15</div>
      </div>
      {done&&<div style={{textAlign:'center',marginTop:10,fontSize:13,color:'#34d399',fontWeight:700,animation:'none'}}>✨ Nice! That's how it works! Points added to your total.</div>}
    </div>
  );
}

function ThemePreviewMini({themeId,color}) {
  const [pvDone,setPvDone]=useState({});
  const tc=TC[themeId]||TC.th0;
  const samples=[{id:'pv1',name:'Wash the dishes',points:10,emoji:'🍽️'},{id:'pv2',name:'Take out the trash',points:10,emoji:'🗑️'}];
  return(
    <div style={{marginTop:12,display:'flex',flexDirection:'column',gap:6}}>
      <div style={{fontSize:11,opacity:.5,textAlign:'center',marginBottom:2}}>Preview (tap to toggle):</div>
      {samples.map((c,i)=>(
        <ChoreItem key={c.id} chore={c} done={!!pvDone[c.id]} doer={pvDone[c.id]?{id:'alon'}:null} myId="alon" isGuest={false} onToggle={()=>setPvDone(p=>({...p,[c.id]:!p[c.id]}))} color={color||'#818cf8'} tc={tc} idx={i} onAnim={()=>{}}/>
      ))}
    </div>
  );
}

function OnboardingModal({ user, data, onDone, onPurchaseThemeItem }) {
  const [step, setStep] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [claimed, setClaimed] = useState(false);
  const cur = ONBOARDING_STEPS[step];
  const isLast = step === ONBOARDING_STEPS.length - 1;
  const isMob = window.innerWidth < 600;
  const freeThemes = [{ id:'th0', name:'Original', emoji:'⭐', desc:'Clean classic look', free:true }, ...THEMES.filter(t => !t.free)];

  const claimTheme = () => {
    if (!chosen || claimed) return;
    if (chosen.id !== 'th0') onPurchaseThemeItem({ ...chosen, cost: 0 });
    setClaimed(true);
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:3000, padding:16, overflowY:'auto', WebkitOverflowScrolling:'touch' }}>
      <div style={{ background:'linear-gradient(135deg,rgba(15,12,41,.98),rgba(48,43,99,.98))', border:'1px solid rgba(255,255,255,0.12)', borderRadius:24, padding: isMob ? '24px 20px' : '36px 40px', width:'100%', maxWidth:480, position:'relative', margin:'auto' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:6, marginBottom:24 }}>
          {ONBOARDING_STEPS.map((_,i) => (
            <div key={i} style={{ width:i===step?20:7, height:7, borderRadius:4, background:i===step?'#818cf8':i<step?'rgba(129,140,248,0.5)':'rgba(255,255,255,0.15)', transition:'all .3s' }}/>
          ))}
        </div>
        <div style={{ textAlign:'center', marginBottom:16 }}>
          <div style={{ fontSize:isMob?48:64, marginBottom:12, lineHeight:1 }}>{cur.emoji}</div>
          <div style={{ fontSize:isMob?20:24, fontWeight:800, marginBottom:10 }}>{cur.title}</div>
          <div style={{ fontSize:isMob?14:15, opacity:.7, lineHeight:1.65 }}>{cur.body}</div>
        </div>
        {cur.demoChore && <DemoChore/>}
        {cur.themePicker && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:13, opacity:.6, textAlign:'center', marginBottom:12 }}>Tap to select · see a live preview below!</div>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${isMob?2:3},1fr)`, gap:8 }}>
              {freeThemes.map(th => {
                const conf = TC[th.id];
                const sel = chosen?.id === th.id;
                return (
                  <div key={th.id} onClick={() => !claimed && setChosen(th)} style={{ borderRadius:12, padding:'12px 8px', textAlign:'center', background:sel?(conf.accent?`${conf.accent}25`:'rgba(129,140,248,0.2)'):'rgba(255,255,255,0.04)', border:`2px solid ${sel?(conf.accent||'#818cf8'):'rgba(255,255,255,0.08)'}`, cursor:claimed?'default':'pointer', transition:'all .15s', opacity:claimed&&!sel?.5:1 }}>
                    <div style={{ fontSize:22, marginBottom:4 }}>{th.emoji||'⭐'}</div>
                    <div style={{ fontSize:11, fontWeight:700 }}>{th.name}</div>
                  </div>
                );
              })}
            </div>
            {chosen && <ThemePreviewMini themeId={chosen.id} color={user.color}/>}
            {chosen && !claimed && (
              <button onClick={claimTheme} style={{ width:'100%', marginTop:12, background:`linear-gradient(135deg,${TC[chosen.id]?.accent||'#818cf8'},#6366f1)`, border:'none', borderRadius:12, padding:'12px', color:'white', fontWeight:800, fontSize:15, cursor:'pointer' }}>
                {chosen.id==='th0'?'Keep Original Theme ⭐':`Claim ${chosen.emoji} ${chosen.name} — Free! 🎁`}
              </button>
            )}
            {claimed && <div style={{ textAlign:'center', marginTop:12, color:'#34d399', fontWeight:700, fontSize:14 }}>✓ {chosen.emoji} {chosen.name} set! Change anytime in ⚙️ Settings.</div>}
          </div>
        )}
        <div style={{ display:'flex', gap:10, justifyContent:'center', marginTop:8 }}>
          {step > 0 && <button onClick={() => setStep(s => s-1)} style={{ flex:1, background:'rgba(255,255,255,0.07)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:'12px', color:'white', cursor:'pointer', fontWeight:600, fontSize:15 }}>← Back</button>}
          <button onClick={() => isLast ? onDone() : setStep(s => s+1)} style={{ flex:2, background:isLast?'linear-gradient(135deg,#34d399,#059669)':'linear-gradient(135deg,#818cf8,#6366f1)', border:'none', borderRadius:12, padding:'12px', color:'white', cursor:'pointer', fontWeight:800, fontSize:15 }}>
            {isLast ? "Let's go! 🚀" : 'Next →'}
          </button>
        </div>
        {!isLast && <button onClick={onDone} style={{ width:'100%', marginTop:10, background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:12, padding:4 }}>Skip tour</button>}
      </div>
    </div>
  );
}

// ── Achievements Grid ─────────────────────────────────────────
function AchievementsGrid({user,data,stats,streak}){
  const s=stats[user.id]||{};
  const redemptions=(data.redemptions||[]).filter(r=>r.userId===user.id);
  const earned=(data.achievementsEarned||{})[user.id]||{};
  const extra={loggedIn:true,loginStreak:(data.userSettings||{})[user.id]?.loginStreak||1,boostChore:(data.userSettings||{})[user.id]?.earnedBoostChore};
  const unlocked=ACHIEVEMENTS.filter(a=>earned[a.id]||a.check(s,streak,redemptions.length,extra));
  const locked=ACHIEVEMENTS.filter(a=>!earned[a.id]&&!a.check(s,streak,redemptions.length,extra));
  return(
    <div>
      {unlocked.length>0&&<>
        <div style={{fontSize:13,fontWeight:700,color:'#34d399',marginBottom:10}}>✓ Unlocked ({unlocked.length})</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:8,marginBottom:20}}>
          {unlocked.map(a=>{const r=RARITIES[a.rarity]||RARITIES.common;return(
            <div key={a.id} style={{...glass(),padding:'12px 10px',textAlign:'center',border:`1px solid ${r.color}44`,background:`${r.color}10`}}>
              <div style={{fontSize:28,marginBottom:4}}>{a.emoji}</div>
              <div style={{fontWeight:700,fontSize:12,color:r.color}}>{a.name}</div>
              <div style={{fontSize:10,opacity:.55,marginTop:2}}>{a.desc}</div>
              <div style={{fontSize:9,color:r.color,marginTop:4,fontWeight:700,textTransform:'uppercase'}}>{r.label}</div>
            </div>
          );})}
        </div>
      </>}
      {locked.length>0&&<>
        <div style={{fontSize:13,fontWeight:700,opacity:.4,marginBottom:10}}>🔒 Locked ({locked.length})</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))',gap:8}}>
          {locked.map(a=><div key={a.id} style={{...glass(),padding:'12px 10px',textAlign:'center',opacity:.35}}>
            <div style={{fontSize:28,marginBottom:4,filter:'grayscale(1)'}}>🔒</div>
            <div style={{fontWeight:700,fontSize:12}}>{a.name}</div>
            <div style={{fontSize:10,opacity:.55,marginTop:2}}>{a.desc}</div>
          </div>)}
        </div>
      </>}
    </div>
  );
}

// ── Quests Page ───────────────────────────────────────────────
function QuestsPage({user,data,update,stats,isGuest,allChores}){
  const [tab,setTab]=useState('achievements');
  const c=data.completions.filter(x=>!isSystemRow(x)),claims=(data.questClaims||{})[user.id]||{};
  const weekKey=getWkSt();
  const claimQuest=(id,pts)=>{
    if(isGuest)return;
    update(prev=>({...prev,
      questClaims:{...(prev.questClaims||{}),[user.id]:{...((prev.questClaims||{})[user.id]||{}),[`${id}_${weekKey}`]:true}},
      completions:[...prev.completions,{id:`quest_${id}_${Date.now()}`,userId:user.id,choreId:`quest_${id}`,points:pts,date:getToday()}],
    }));
  };
  const isClaimed=id=>!!claims[`${id}_${weekKey}`];
  const famSize=getFam(data).length;

  return(
    <div style={{padding:20,maxWidth:680,margin:'0 auto',overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
      <div style={{fontSize:22,fontWeight:800,marginBottom:4}}>🏅 Achievements</div>
      <div style={{opacity:.5,fontSize:13,marginBottom:16}}>Badges you've earned — plus weekly quests for bonus points.</div>

      <div style={{display:'flex',gap:8,marginBottom:18}}>
        {[['achievements','🏅 Badges'],['quests','🎯 Quests']].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 18px',borderRadius:10,background:tab===t?'rgba(129,140,248,0.25)':'rgba(255,255,255,0.06)',border:`1px solid ${tab===t?'#818cf8':'rgba(255,255,255,0.1)'}`,color:'white',cursor:'pointer',fontWeight:tab===t?700:400,fontSize:13}}>{l}</button>
        ))}
      </div>

      {tab==='achievements'&&<AchievementsGrid user={user} data={data} stats={stats} streak={calcStreak(data.completions,user.id)}/>}

      {tab==='quests'&&<>
      <div style={{fontWeight:700,fontSize:16,marginBottom:12}}>👤 Personal Challenges</div>
      <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:28}}>
        {PERSONAL_QUESTS.map(q=>{
          const done=q.check(c,user.id,stats);
          const claimed=isClaimed(q.id);
          return(
            <div key={q.id} style={{...glass(),padding:'14px 16px',display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
              <div style={{fontSize:28,flexShrink:0}}>{q.emoji}</div>
              <div style={{flex:1,minWidth:120}}>
                <div style={{fontWeight:700,fontSize:14}}>{q.name}</div>
                <div style={{fontSize:12,opacity:.55,marginTop:2}}>{q.desc}</div>
              </div>
              <div style={{fontWeight:800,color:'#fbbf24',fontSize:15,flexShrink:0}}>+{q.pts} pts</div>
              <button onClick={()=>done&&!claimed&&claimQuest(q.id,q.pts)} disabled={!done||claimed||isGuest} style={{background:claimed?'rgba(52,211,153,0.15)':done?'linear-gradient(135deg,#818cf8,#6366f1)':'rgba(255,255,255,0.06)',border:'none',borderRadius:10,padding:'8px 16px',color:claimed?'#34d399':done?'white':'#4b5563',cursor:done&&!claimed&&!isGuest?'pointer':'not-allowed',fontWeight:700,fontSize:13,flexShrink:0,whiteSpace:'nowrap'}}>
                {claimed?'✓ Claimed':done?'Claim! 🎉':'In Progress'}
              </button>
            </div>
          );
        })}
      </div>

      <div style={{fontWeight:700,fontSize:16,marginBottom:12}}>👨‍👩‍👧 Family Goals</div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {FAMILY_QUESTS.map(q=>{
          const prog=q.progress(c,data);
          const done=q.check(c,data);
          const claimed=isClaimed(q.id);
          const pct=q.target?Math.min(100,Math.round((prog/q.target)*100)):done?100:Math.round((prog/famSize)*100);
          return(
            <div key={q.id} style={{...glass(),padding:'14px 16px'}}>
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10,flexWrap:'wrap'}}>
                <div style={{fontSize:28,flexShrink:0}}>{q.emoji}</div>
                <div style={{flex:1,minWidth:120}}>
                  <div style={{fontWeight:700,fontSize:14}}>{q.name}</div>
                  <div style={{fontSize:12,opacity:.55,marginTop:2}}>{q.desc}</div>
                </div>
                <div style={{fontWeight:800,color:'#fbbf24',fontSize:15,flexShrink:0}}>+{q.pts} pts each</div>
              </div>
              <div style={{background:'rgba(255,255,255,0.08)',borderRadius:8,height:8,overflow:'hidden',marginBottom:8}}>
                <div style={{height:'100%',background:done?'#34d399':'linear-gradient(90deg,#818cf8,#6366f1)',borderRadius:8,width:`${pct}%`,transition:'width .5s'}}/>
              </div>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:12,opacity:.55}}>{q.target?`${prog} / ${q.target}`:done?'Complete!':'In progress…'}</div>
                <button onClick={()=>done&&!claimed&&!isGuest&&claimQuest(q.id,q.pts)} disabled={!done||claimed||isGuest} style={{background:claimed?'rgba(52,211,153,0.15)':done?'linear-gradient(135deg,#818cf8,#6366f1)':'rgba(255,255,255,0.06)',border:'none',borderRadius:10,padding:'6px 14px',color:claimed?'#34d399':done?'white':'#4b5563',cursor:done&&!claimed&&!isGuest?'pointer':'not-allowed',fontWeight:700,fontSize:13,whiteSpace:'nowrap'}}>
                  {claimed?'✓ Claimed':done?'Claim! 🎉':'In Progress'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      </>}
    </div>
  );
}

// ── Social Page ────────────────────────────────────────────────
function SocialPage({user,data,update,isGuest,profilePics,dynUsers,userSettingsMap}){
  const [msg,setMsg]=useState('');
  const chat=(data.chat||[]).slice(-60);
  const chatEndRef=useRef(null);
  useEffect(()=>{chatEndRef.current?.scrollIntoView({behavior:'smooth'});},[chat.length]);

  const sendMsg=()=>{
    if(!msg.trim()||isGuest)return;
    const newMsg={id:`msg_${Date.now()}`,userId:user.id,name:user.name,color:user.color,text:msg.trim(),ts:Date.now()};
    update(prev=>({...prev,chat:[...(prev.chat||[]).slice(-99),newMsg]}));
    setMsg('');
  };

  const recentActivity=[...data.completions].filter(c=>!isSystemRow(c)).reverse().slice(0,15).map(c=>{
    const u=getUser(c.userId,dynUsers);
    const ch=[...BASE_CHORES,...data.customChores,...(data.recurringTasks||[])].find(x=>x.id===c.choreId)||{name:'a chore',emoji:'✅'};
    return{...c,userName:u.name,userColor:u.color,choreName:ch.name,choreEmoji:ch.emoji};
  });

  return(
    <div style={{padding:20,maxWidth:680,margin:'0 auto'}}>
      <div style={{fontSize:22,fontWeight:800,marginBottom:4}}>💬 Social</div>
      <div style={{opacity:.5,fontSize:13,marginBottom:20}}>Chat with your family and see what everyone's been up to!</div>

      {/* Activity Feed */}
      <Card title="🏃 Recent Activity" style={{marginBottom:16}}>
        <div style={{display:'flex',flexDirection:'column',gap:6,maxHeight:200,overflowY:'auto',WebkitOverflowScrolling:'touch'}}>
          {recentActivity.length===0?<div style={{opacity:.4,fontSize:13,textAlign:'center',padding:'12px 0'}}>No activity yet — go check off some chores!</div>:
          recentActivity.map((a,i)=>(
            <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'7px 0',borderBottom:'1px solid rgba(255,255,255,0.05)',fontSize:13}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${a.userColor},${a.userColor}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'white',flexShrink:0}}>{a.userName[0]}</div>
              <div style={{flex:1}}><span style={{fontWeight:700,color:a.userColor}}>{a.userName}</span> completed {a.choreEmoji} <span style={{opacity:.75}}>{a.choreName}</span></div>
              <div style={{color:'#34d399',fontWeight:700,fontSize:12,flexShrink:0}}>+{a.points}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Chat */}
      <Card title="💬 Family Chat" noPad>
        <div style={{height:280,overflowY:'auto',WebkitOverflowScrolling:'touch',padding:'12px 14px',display:'flex',flexDirection:'column',gap:8}}>
          {chat.length===0&&<div style={{opacity:.35,fontSize:13,textAlign:'center',margin:'auto'}}>No messages yet — say hi! 👋</div>}
          {chat.map(m=>{
            const isMe=m.userId===user.id;
            return(
              <div key={m.id} style={{display:'flex',alignItems:'flex-end',gap:8,flexDirection:isMe?'row-reverse':'row'}}>
                <div style={{width:28,height:28,borderRadius:'50%',background:`linear-gradient(135deg,${m.color},${m.color}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:800,color:'white',flexShrink:0}}>{m.name[0]}</div>
                <div style={{maxWidth:'70%'}}>
                  {!isMe&&<div style={{fontSize:10,color:m.color,fontWeight:700,marginBottom:2,marginLeft:4}}>{m.name}</div>}
                  <div style={{background:isMe?'linear-gradient(135deg,#818cf8,#6366f1)':'rgba(255,255,255,0.08)',borderRadius:isMe?'16px 16px 4px 16px':'16px 16px 16px 4px',padding:'8px 12px',fontSize:14,wordBreak:'break-word'}}>{m.text}</div>
                  <div style={{fontSize:9,opacity:.35,marginTop:2,textAlign:isMe?'right':'left',paddingLeft:4,paddingRight:4}}>{new Date(m.ts).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef}/>
        </div>
        {!isGuest?(
          <div style={{padding:'0 14px 14px',display:'flex',gap:8}}>
            <input value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="Say something..." style={{...inp(),flex:1,minWidth:0,borderRadius:10,padding:'10px 14px'}}/>
            <button onClick={sendMsg} style={{background:'linear-gradient(135deg,#818cf8,#6366f1)',border:'none',borderRadius:10,padding:'10px 16px',color:'white',cursor:'pointer',fontWeight:700,fontSize:15,flexShrink:0}}>➤</button>
          </div>
        ):<div style={{padding:'10px 14px',fontSize:13,opacity:.5,textAlign:'center'}}>Log in to chat</div>}
      </Card>
    </div>
  );
}

// ── Preview Overlay ──────────────────────────────────────────
function PreviewOverlay({previewMode,data,user,onClose,allChores,recurringTasks,profilePics,userSettingsMap}){
  const [pvPage,setPvPage]=useState('main');
  const [pvDone,setPvDone]=useState({});
  const [pvParts,setPvParts]=useState([]);
  const pvPid=useRef(0);
  const tc=previewMode.theme?TC[previewMode.theme]||TC.th0:TC.th0;
  const bgId=previewMode.bg||null;
  const customBg=(data.customBackgrounds||[]).find(b=>b.id===bgId);
  const bgEntry=customBg?null:(bgId?BG_APP[bgId]||BG_APP.bg0:BG_APP.bg0);
  const appStyle={position:'fixed',inset:0,zIndex:800,color:'white',fontFamily:"'Segoe UI',sans-serif",display:'flex',flexDirection:'column',overflow:'hidden',...(customBg?{backgroundImage:`url(${customBg.imageData})`,backgroundSize:'cover',backgroundPosition:'center'}:bgEntry?.css?{background:bgEntry.css}:{})};
  const spawnPvP=(e,emojis)=>{const rect=e.currentTarget?.getBoundingClientRect?.();const cx=rect?(rect.left+rect.right)/2:200,cy=rect?rect.top:200;const np=Array.from({length:5},(_,i)=>({id:pvPid.current++,x:cx+((i%3-1)*26),y:cy,emoji:emojis[i%emojis.length],dur:.9+Math.random()*.3,delay:i*.06}));setPvParts(p=>[...p,...np]);setTimeout(()=>setPvParts(p=>p.filter(x=>!np.find(n=>n.id===x.id))),1600);};
  return(
    <div className={(!customBg&&bgEntry?.cls)||''} style={appStyle}>
      <Particles particles={pvParts}/>
      <div style={{background:'rgba(0,0,0,0.82)',padding:'10px 18px',display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid rgba(255,255,255,0.15)',flexShrink:0,flexWrap:'wrap',gap:8}}>
        <div style={{fontWeight:700,fontSize:14}}>👁️ Preview: <span style={{color:'#818cf8'}}>{previewMode.name}</span></div>
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          {[{id:'main',label:'🏠 Main'},{id:'shop',label:'🛍️ Shop'},{id:'profile',label:'👤 Profile'}].map(n=>(
            <button key={n.id} onClick={()=>setPvPage(n.id)} style={{background:pvPage===n.id?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.06)',border:'none',borderRadius:8,padding:'6px 14px',color:'white',cursor:'pointer',fontWeight:pvPage===n.id?700:400,fontSize:13}}>{n.label}</button>
          ))}
          <button onClick={onClose} style={{background:'rgba(239,68,68,0.25)',border:'1px solid rgba(239,68,68,0.4)',borderRadius:8,padding:'6px 14px',color:'#fca5a5',cursor:'pointer',fontWeight:700,fontSize:13}}>✕ Exit Preview</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:'auto',padding:20}}>
        {pvPage==='main'&&<div style={{maxWidth:600,margin:'0 auto'}}>
          <div style={{fontWeight:700,fontSize:16,marginBottom:12,opacity:.7}}>Sample Chores <span style={{fontSize:12,opacity:.6,fontWeight:400}}>— click to toggle on/off!</span></div>
          <div style={{display:'flex',flexDirection:'column',gap:8,marginBottom:20}}>
            {allChores.slice(0,6).map((c,i)=>(
              <ChoreItem key={c.id} chore={c} done={!!pvDone[c.id]} doer={pvDone[c.id]?user:null} myId={user.id} isGuest={false}
                onToggle={()=>setPvDone(p=>({...p,[c.id]:!p[c.id]}))}
                color={user.color} tc={tc} idx={i} onAnim={spawnPvP}
              />
            ))}
          </div>
          <div style={{fontWeight:700,fontSize:16,marginBottom:12,opacity:.7}}>Recurring Tasks</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {recurringTasks.slice(0,3).map(t=>(
              <div key={t.id} style={{...glass(),display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:12}}>
                <div style={{fontSize:22}}>{t.emoji}</div>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{t.name}</div><div style={{fontSize:11,opacity:.5}}>{freqLabel(t)}</div></div>
                <div style={{fontSize:12,color:'#fbbf24',fontWeight:700}}>+{t.points}</div>
              </div>
            ))}
          </div>
        </div>}
        {pvPage==='shop'&&<div style={{maxWidth:600,margin:'0 auto'}}>
          <div style={{fontWeight:700,fontSize:20,marginBottom:16}}>🛍️ Shop Preview</div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))',gap:12}}>
            {BASE_SHOP_ITEMS.slice(0,4).map(item=>(
              <div key={item.id} style={{...glass(),padding:16,display:'flex',flexDirection:'column',gap:8,textAlign:'center'}}>
                <div style={{fontSize:34}}>{item.emoji}</div>
                <div style={{fontWeight:700,fontSize:13}}>{item.name}</div>
                <div style={{color:'#fbbf24',fontWeight:800}}>{item.cost} pts</div>
              </div>
            ))}
          </div>
        </div>}
        {pvPage==='profile'&&<div style={{maxWidth:400,margin:'0 auto',textAlign:'center'}}>
          <div style={{width:80,height:80,borderRadius:'50%',background:`linear-gradient(135deg,${user.color},${user.color}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,fontWeight:800,margin:'0 auto 12px',boxShadow:`0 0 44px ${user.color}44`,overflow:'hidden'}}>
            {(profilePics||{})[user.id]?<img src={(profilePics||{})[user.id]} alt={user.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:user.name[0]}
          </div>
          <div style={{fontSize:22,fontWeight:800,marginBottom:8}}>{user.name}</div>
          <TierBadge tier={getTier(0)}/>
          <div style={{marginTop:16,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10}}>
            {[['Tasks','12',user.color],['Points','180','#fbbf24'],['Redeemed','60','#f472b6']].map(([l,v,c])=>(
              <div key={l} style={{...glass(),padding:'12px 4px',textAlign:'center'}}><div style={{fontSize:22,fontWeight:800,color:c}}>{v}</div><div style={{fontSize:10,opacity:.5,marginTop:3}}>{l}</div></div>
            ))}
          </div>
        </div>}
      </div>
    </div>
  );
}

// ── ChoresPanel ──────────────────────────────────────────────
function ChoresPanel({allChores,recurringTasks,user,isGuest,isDoneToday,whoDidToday,toggleChore,completeRecurring,tc,onAnim}){
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <Card title="✅ Today's Chores" sub="Tap to check off — every chore earns points!">
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {allChores.map((c,i)=>{const doer=whoDidToday(c.id);return <ChoreItem key={c.id} chore={c} done={isDoneToday(c.id)} doer={doer} myId={user.id} isGuest={isGuest} onToggle={()=>toggleChore(c)} color={user.color} tc={tc} idx={i} onAnim={onAnim}/>;  })}
        </div>
      </Card>
      <Card title="🔄 Recurring Tasks" sub="Countdown shows days until/overdue">
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {recurringTasks.map(task=>{
            const {done,daysLeft}=getRecStatus(task),overdue=daysLeft<0&&!done,soon=!done&&!overdue&&daysLeft<=3&&daysLeft>=0;
            const dayLabel=done?`+${Math.abs(daysLeft)}d`:daysLeft===0?'Today!':`${daysLeft}d`;
            const dayColor=done?'#34d399':overdue?'#f87171':soon?'#fbbf24':'#94a3b8';
            const glowStyle=overdue?{boxShadow:'0 0 12px rgba(239,68,68,0.25)'}:soon?{boxShadow:'0 0 8px rgba(251,191,36,0.15)'}:{};
            const borderCol=overdue?'rgba(239,68,68,0.4)':soon?'rgba(251,191,36,0.25)':'rgba(255,255,255,0.06)';
            return(
              <div key={task.id} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:12,background:overdue?'rgba(239,68,68,0.07)':soon?'rgba(251,191,36,0.04)':'rgba(255,255,255,0.03)',border:`1px solid ${borderCol}`,transition:'all .3s',...glowStyle}}>
                <div style={{fontSize:21}}>{task.emoji}</div>
                <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{task.name}</div><div style={{fontSize:11,opacity:.5}}>{freqLabel(task)}</div></div>
                <div style={{textAlign:'center',minWidth:38}}><div style={{fontSize:15,fontWeight:800,color:dayColor}}>{dayLabel}</div><div style={{fontSize:9,opacity:.4}}>{done?'next':'left'}</div></div>
                <div style={{fontSize:12,fontWeight:700,color:'#fbbf24',minWidth:32,textAlign:'right'}}>+{task.points}</div>
                <button onClick={()=>{if(!done&&!isGuest)completeRecurring(task);}} style={{background:done?'rgba(52,211,153,0.14)':'rgba(52,211,153,0.1)',border:`1px solid ${done?'rgba(52,211,153,0.5)':'rgba(52,211,153,0.25)'}`,borderRadius:8,padding:'6px 10px',color:done?'#34d399':'white',cursor:done||isGuest?'default':'pointer',fontSize:12,fontWeight:600,flexShrink:0,opacity:isGuest&&!done?.45:1}}>{done?'✓ Done':'Mark Done'}</button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ── BoardPanel ───────────────────────────────────────────────
function BoardPanel({user,isGuest,lbMode,setLbMode,lb,stats,medals,setViewProfile,nudge,setNudge,sendNudge,sugg,setSugg,addSugg,pendingSuggs,voteVals,setVoteVals,vote,profilePics,userSettingsMap}){
  const lbPts=uid=>lbMode==='weekly'?stats[uid]?.weeklyPoints||0:lbMode==='biweekly'?stats[uid]?.biweeklyPoints||0:stats[uid]?.monthlyPoints||0;
  const sorted=[...lb].sort((a,b)=>lbPts(b.id)-lbPts(a.id));
  const isMo=lbMode==='monthly';
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      {!isGuest&&<Card title="📢 Send a Nudge" sub="Posts to the ticker above"><div style={{display:'flex',gap:8}}><input value={nudge} onChange={e=>setNudge(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendNudge()} placeholder={'"Ariel, please feed the cat!"'} style={{...inp(),flex:1,minWidth:0}}/><button onClick={sendNudge} style={{background:user.color,border:'none',borderRadius:10,padding:'8px 14px',color:'white',cursor:'pointer',fontWeight:700,fontSize:13,flexShrink:0}}>Send</button></div></Card>}
      <Card title="🏆 Leaderboard" noPad>
        <div style={{display:'flex',gap:4,padding:'0 14px 10px',marginTop:-2}}>
          <button onClick={()=>setLbMode('weekly')} style={{flex:1,background:lbMode==='weekly'?'rgba(255,255,255,0.14)':'transparent',border:'1px solid rgba(255,255,255,0.1)',borderRadius:8,padding:5,color:'white',cursor:'pointer',fontSize:12,fontWeight:lbMode==='weekly'?700:400}}>Weekly</button>
          <div style={{flex:1,display:'flex',borderRadius:8,overflow:'hidden',border:'1px solid rgba(255,255,255,0.1)'}}>
            <button onClick={()=>setLbMode(isMo?'monthly':'biweekly')} style={{flex:1,background:lbMode!=='weekly'?'rgba(255,255,255,0.14)':'transparent',border:'none',color:'white',cursor:'pointer',fontSize:12,fontWeight:lbMode!=='weekly'?700:400,padding:'5px 4px'}}>{isMo?'Monthly':'Biweekly'}</button>
            <button onClick={()=>setLbMode(isMo?'biweekly':'monthly')} style={{width:26,background:'rgba(255,255,255,0.06)',border:'none',borderLeft:'1px solid rgba(255,255,255,0.12)',color:'rgba(255,255,255,0.7)',cursor:'pointer',fontSize:13}}>{isMo?'‹':'›'}</button>
          </div>
        </div>
        <div>
          {sorted.map((u2,i)=>{
            const tier=getTier(stats[u2.id]?.totalTasks||0),pts=lbPts(u2.id),isMe=!isGuest&&u2.id===user.id;
            const u2s=gUS({userSettings:userSettingsMap||{}},u2.id);
            const u2Deco=getDecoClass(u2s);
            const u2Np=getNameplateGrad(u2s);
            return(
              <div key={u2.id} onClick={()=>setViewProfile(u2.id)} style={{display:'flex',alignItems:'center',gap:8,padding:'9px 14px',background:u2Np||(isMe?`${u2.color}18`:i===0?'rgba(255,215,0,0.04)':'transparent'),cursor:'pointer',borderTop:'1px solid rgba(255,255,255,0.04)',position:'relative',overflow:'hidden'}}>
                <div style={{width:22,fontSize:14,textAlign:'center'}}>{medals[i]||<span style={{opacity:.5,fontSize:12}}>{i+1}.</span>}</div>
                <Avatar user={u2} size={26} imgSrc={(profilePics||{})[u2.id]||null} decoClass={u2Deco}/>
                <div style={{flex:1,fontWeight:isMe?700:500,fontSize:13}}>{u2.name}</div>
                <TierBadge tier={tier} sm/>
                <div style={{fontWeight:800,color:u2.color,fontSize:15,minWidth:28,textAlign:'right'}}>{pts}</div>
              </div>
            );
          })}
        </div>
      </Card>
      {!isGuest&&<Card title="💡 Suggest a Chore" sub="Family votes · auto-added after 1 week"><div style={{display:'flex',gap:8}}><input value={sugg} onChange={e=>setSugg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addSugg()} placeholder="e.g. Clean the garage" style={{...inp(),flex:1,minWidth:0}}/><button onClick={addSugg} style={{background:'#818cf8',border:'none',borderRadius:10,padding:'8px 14px',color:'white',cursor:'pointer',fontWeight:800,fontSize:18,flexShrink:0}}>+</button></div></Card>}
      {pendingSuggs.length>0&&<Card title="🗳️ Vote on Suggestions" noPad><div style={{maxHeight:230,overflowY:'auto'}}>{pendingSuggs.map(s=>{const myV=s.votes[user.id],cnt=Object.keys(s.votes).length,avg=cnt>0?Math.round(Object.values(s.votes).reduce((a,b)=>a+b,0)/cnt):null,dL=Math.max(0,7-daysSince(s.createdAt));return(<div key={s.id} style={{padding:'12px 14px',borderBottom:'1px solid rgba(255,255,255,0.05)'}}><div style={{fontWeight:600,fontSize:13,marginBottom:4}}>⭐ {s.name}</div><div style={{fontSize:11,opacity:.45,marginBottom:8}}>by {s.suggestedByName} · {cnt} vote{cnt!==1?'s':''}{avg?` · avg ${avg}pts`:''} · adds in {dL}d</div>{isGuest?<div style={{fontSize:11,color:'#94a3b8',opacity:.6}}>Log in to vote</div>:myV?<div style={{fontSize:12,color:'#34d399'}}>✓ Your vote: {myV} pts</div>:<div style={{display:'flex',gap:6}}><input type="number" min="1" max="100" value={voteVals[s.id]||''} onChange={e=>setVoteVals(p=>({...p,[s.id]:e.target.value}))} placeholder="pts" style={{...inp(),width:58}}/><button onClick={()=>vote(s.id)} style={{background:'rgba(129,140,248,0.24)',border:'1px solid rgba(129,140,248,0.35)',borderRadius:8,padding:'5px 12px',color:'white',cursor:'pointer',fontSize:12,fontWeight:600}}>Vote</button></div>}</div>);})}</div></Card>}
    </div>
  );
}

function StreakSaveModal({broken,savers,points,onUse,onClose}){
  const canBuy=savers<1&&points>=15;
  const able=savers>0||canBuy;
  return(
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2200,padding:16}}>
      <div style={{background:'linear-gradient(135deg,rgba(15,12,41,.97),rgba(48,43,99,.97))',border:'1px solid rgba(251,146,60,0.5)',borderRadius:22,padding:'30px 26px',textAlign:'center',maxWidth:330,width:'100%',boxShadow:'0 0 60px rgba(251,146,60,0.25)'}}>
        <div style={{fontSize:56,lineHeight:1}}>💔</div>
        <div style={{fontSize:20,fontWeight:800,marginTop:12}}>Your {broken.lost}-day streak broke!</div>
        <div style={{fontSize:13,opacity:.65,marginTop:8,lineHeight:1.6}}>You missed {broken.missedDate}. Use a 🛡️ Streak Saver to restore it?</div>
        <div style={{fontSize:12,marginTop:12,color:savers>0?'#34d399':'#94a3b8'}}>You own {savers} Streak Saver{savers===1?'':'s'}</div>
        <button onClick={able?onUse:undefined} disabled={!able} style={{width:'100%',marginTop:16,background:able?'linear-gradient(135deg,#fb923c,#ea580c)':'rgba(255,255,255,0.06)',border:'none',borderRadius:12,padding:'12px',color:able?'white':'#4b5563',fontWeight:800,fontSize:15,cursor:able?'pointer':'not-allowed'}}>
          {savers>0?'Use Saver 🛡️':canBuy?'Buy & Use — 15 pts':`Need ${15-points} more pts`}
        </button>
        <button onClick={onClose} style={{width:'100%',marginTop:8,background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:12,padding:'10px',color:'rgba(255,255,255,0.6)',cursor:'pointer',fontWeight:600,fontSize:14}}>No thanks</button>
      </div>
    </div>
  );
}

// ── Achievement Toast ─────────────────────────────────────────
function AchToast({toasts}){
  if(!toasts.length)return null;
  return(
    <div style={{position:'fixed',right:16,bottom:16,zIndex:2500,display:'flex',flexDirection:'column',gap:8,pointerEvents:'none'}}>
      {toasts.map(t=>{const r=RARITIES[t.ach.rarity]||RARITIES.common;return(
        <div key={t.key} style={{background:'linear-gradient(135deg,rgba(15,12,41,.97),rgba(48,43,99,.97))',border:`1px solid ${r.color}`,boxShadow:`0 6px 28px ${r.color}44`,borderRadius:14,padding:'12px 16px',display:'flex',alignItems:'center',gap:12,minWidth:220,maxWidth:280}}>
          <div style={{fontSize:30,flexShrink:0}}>{t.ach.emoji}</div>
          <div>
            <div style={{fontSize:9,letterSpacing:2,fontWeight:800,color:r.color,textTransform:'uppercase'}}>{r.label} unlocked</div>
            <div style={{fontWeight:800,fontSize:14,marginTop:2}}>{t.ach.name}</div>
            <div style={{fontSize:11,opacity:.6,marginTop:1}}>{t.ach.desc}</div>
          </div>
        </div>
      );})}
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────
export default function App(){
  const [data,setData]=useState(null);
  const [user,setUser]=useState(null);
  const [page,setPage]=useState('main');
  const [sidebar,setSidebar]=useState(false);
  const [viewProfile,setViewProfile]=useState(null);
  const [tierPopup,setTierPopup]=useState(null);
  const [lbMode,setLbMode]=useState('weekly');
  const [loginForm,setLoginForm]=useState({u:'',p:''});
  const [loginErr,setLoginErr]=useState('');
  const [nudge,setNudge]=useState('');
  const [sugg,setSugg]=useState('');
  const [voteVals,setVoteVals]=useState({});
  const [shopMsg,setShopMsg]=useState('');
  const [mobileTab,setMobileTab]=useState('chores');
  const [winW,setWinW]=useState(window.innerWidth);
  const [particles,setParticles]=useState([]);
  const [previewMode,setPreviewMode]=useState(null);
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [syncStatus,setSyncStatus]=useState('ok'); // 'ok' | 'saving' | 'error'
  const [toasts,setToasts]=useState([]);
  const prevTiers=useRef({});
  const pId=useRef(0);
  const seenAch=useRef({});
  const toastId=useRef(0);
  const lastSynced=useRef(null);
  const isWriting=useRef(false);

  useEffect(()=>{const h=()=>setWinW(window.innerWidth);window.addEventListener('resize',h);return()=>window.removeEventListener('resize',h);},[]);
  const isMobile=winW<700;
  useEffect(()=>{
    (async()=>{
      if(USE_SB){
        const row=await sbLoad();
        if(row?.data&&Object.keys(row.data).length>0){
          setData(migrate(row.data));
          lastSynced.current=row.updated_at;
        } else {
          setData(initData());
        }
      } else {
        try{const r=await window.storage.get(SK);setData(r?migrate(JSON.parse(r.value)):initData());}
        catch{setData(initData());}
      }
    })();
  },[]);
  const save=async d=>{
    isWriting.current=true;
    setSyncStatus('saving');
    if(USE_SB){
      await sbSave(d,lastSynced);
      setSyncStatus('ok');
    } else {
      try{await window.storage.set(SK,JSON.stringify(d));setSyncStatus('ok');}
      catch{setSyncStatus('error');}
    }
    setTimeout(()=>{isWriting.current=false;},2500);
  };
  const update=fn=>setData(prev=>{const next=fn(prev);save(next);return next;});

  // Realtime polling — every 4s, pull from Supabase if another device changed data
  useEffect(()=>{
    if(!data||!USE_SB)return;
    const poll=setInterval(async()=>{
      if(isWriting.current)return;
      const row=await sbLoad();
      if(row?.updated_at&&row.updated_at!==lastSynced.current){
        lastSynced.current=row.updated_at;
        setData(migrate(row.data));
      }
    },4000);
    return()=>clearInterval(poll);
  },[!!data]);

  useEffect(()=>{if(!user||!data)return;const s=gUS(data,user.id),font=FONTS.find(f=>f.id===s.font);if(font?.google){const id=`gf-${font.id}`;if(!document.getElementById(id)){const l=document.createElement('link');l.id=id;l.rel='stylesheet';l.href=`https://fonts.googleapis.com/css2?family=${font.google}&display=swap`;document.head.appendChild(l);}};},[user,data?.userSettings]);

  useEffect(()=>{
    if(!data)return;const ws=getWkSt(),ms=getMoSt();
    if(data.lastWeekChecked===ws&&data.lastMonthChecked===ms)return;
    const wins=JSON.parse(JSON.stringify(data.wins||{}));
    if(data.lastWeekChecked&&data.lastWeekChecked!==ws){const w=findWinner(data.completions,data.lastWeekChecked,ws,data);if(w){if(!wins[w])wins[w]={weekly:0,monthly:0};wins[w].weekly++;}}
    if(data.lastMonthChecked&&data.lastMonthChecked!==ms){const w=findWinner(data.completions,data.lastMonthChecked,ms,data);if(w){if(!wins[w])wins[w]={weekly:0,monthly:0};wins[w].monthly++;}}
    update(()=>({...data,wins,lastWeekChecked:ws,lastMonthChecked:ms}));
  },[data?.lastWeekChecked,data?.lastMonthChecked]);

  useEffect(()=>{
    if(!data||!user||user.guest)return;
    const stats=compStats(data.completions,data.redemptions,data);
    const cur=getTier(stats[user.id]?.totalTasks||0),prev=prevTiers.current[user.id];
    if(prev&&prev.name!==cur.name&&cur.min>prev.min)setTierPopup(cur);
    prevTiers.current[user.id]=cur;
  },[data,user]);

  useEffect(()=>{
    if(!data||!user||user.guest)return;
    const st=compStats(data.completions,data.redemptions,data)[user.id]||{totalTasks:0,totalPoints:0};
    const streak=calcStreak(data.completions,user.id);
    const redCount=(data.redemptions||[]).filter(r=>r.userId===user.id).length;
    const extra={loggedIn:true,loginStreak:(data.userSettings||{})[user.id]?.loginStreak||1,boostChore:(data.userSettings||{})[user.id]?.earnedBoostChore};
    const now=ACHIEVEMENTS.filter(a=>{try{return a.check(st,streak,redCount,extra);}catch{return false;}});
    const prevSet=seenAch.current[user.id];
    if(!prevSet){seenAch.current[user.id]=new Set(now.map(a=>a.id));return;}
    const fresh=now.filter(a=>!prevSet.has(a.id));
    if(!fresh.length)return;
    fresh.forEach(a=>prevSet.add(a.id));
    const added=fresh.map(a=>({key:toastId.current++,ach:a}));
    setToasts(t=>[...t,...added]);
    setTimeout(()=>setToasts(t=>t.filter(x=>!added.some(n=>n.key===x.key))),4500);
  },[data,user]);

  useEffect(()=>{
    if(!data?.wishlist)return;let changed=false;const nD=[...(data.dynamicShopItems||[])];
    const nS=(data.wishlist.shopSuggestions||[]).map(s=>{if(s.status!=='pending'||daysSince(s.createdAt)<7)return s;const votes=Object.values(s.votes);if(!votes.length)return s;changed=true;const yes=votes.filter(v=>v==='y').length,no=votes.filter(v=>v==='n').length;if(yes>no)nD.push({id:`ds_${s.id}`,name:s.name,emoji:'⭐',cost:s.cost,desc:'Suggested by the family!'});return{...s,status:yes>no?'added':'rejected'};});
    const nF=(data.wishlist.featureRequests||[]).map(f=>{if(f.status!=='pending'||daysSince(f.createdAt)<7)return f;const votes=Object.values(f.votes);if(!votes.length)return f;changed=true;return{...f,status:votes.filter(v=>v==='y').length>votes.length/2?'approved':'rejected'};});
    if(changed)update(()=>({...data,wishlist:{shopSuggestions:nS,featureRequests:nF},dynamicShopItems:nD}));
  },[data?.wishlist?.shopSuggestions?.length,data?.wishlist?.featureRequests?.length]);

  useEffect(()=>{
    if(!data)return;let changed=false;const nc=[...data.customChores];
    const ns=data.suggestions.map(s=>{if(s.status==='pending'&&daysSince(s.createdAt)>=7&&Object.keys(s.votes).length>0){const vals=Object.values(s.votes),avg=Math.round(vals.reduce((a,b)=>a+b,0)/vals.length);nc.push({id:`cc_${s.id}`,name:s.name,points:avg,emoji:'⭐'});changed=true;return{...s,status:'added'};}return s;});
    if(changed)update(()=>({...data,suggestions:ns,customChores:nc}));
  },[data?.suggestions?.length]);

  if(!data)return <div style={{background:'linear-gradient(135deg,#0f0c29,#302b63)',minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:20}}>Loading...</div>;

  if(!user){
    const allFL=getFam(data);
    const doLogin=matchUser=>{
      const match=matchUser || allFL.find(u=>u.name.toLowerCase()===loginForm.u.toLowerCase()&&u.password.toLowerCase()===loginForm.p.toLowerCase());
      if(match){
        prevTiers.current[match.id]=getTier(compStats(data.completions,data.redemptions,data)[match.id]?.totalTasks||0);
        setUser(match);
        setLoginErr('');
        const seen=(data.userSettings||{})[match.id]?.onboardingDone;
        if(!seen) setShowOnboarding(true);
      } else {
        setLoginErr('Wrong name or password. Try again!');
      }
    };
    const quickLogin=u=>{
      doLogin(u);
    };
    const isSimple=data.loginMode!=='password';
    const bgStyle={background:'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)',minHeight:'100vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:"'Segoe UI',sans-serif",padding:'24px 16px',color:'white',overflowY:'auto',WebkitOverflowScrolling:'touch'};

    if(isSimple) return(
      <div style={bgStyle}>
        <style>{GCSS}</style>
        <div style={{textAlign:'center',marginBottom:36}}>
          <div style={{fontSize:64,marginBottom:8}}>🏠</div>
          <div style={{fontSize:32,fontWeight:800,letterSpacing:-.5}}>Family Chores</div>
          <div style={{fontSize:15,opacity:.45,marginTop:6}}>Who's checking in today?</div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:14,width:'100%',maxWidth:680}}>
          {allFL.map(u=>{
            const pic=(data.profilePics||{})[u.id]||null;
            const tier=getTier(compStats(data.completions,data.redemptions,data)[u.id]?.totalTasks||0);
            return(
              <button key={u.id} onClick={()=>quickLogin(u)} style={{background:`linear-gradient(135deg,${u.color}22,${u.color}11)`,border:`1.5px solid ${u.color}55`,borderRadius:20,padding:'24px 16px',display:'flex',flexDirection:'column',alignItems:'center',gap:12,cursor:'pointer',transition:'all .15s',outline:'none'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 12px 32px ${u.color}33`;e.currentTarget.style.borderColor=`${u.color}99`;}}
                onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';e.currentTarget.style.borderColor=`${u.color}55`;}}>
                <div style={{width:68,height:68,borderRadius:'50%',background:`linear-gradient(135deg,${u.color},${u.color}88)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,fontWeight:800,color:'white',overflow:'hidden',flexShrink:0,boxShadow:`0 4px 18px ${u.color}44`}}>
                  {pic?<img src={pic} alt={u.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/>:u.name[0]}
                </div>
                <div style={{textAlign:'center'}}>
                  <div style={{fontSize:17,fontWeight:700,color:'white'}}>{u.name}</div>
                  <div style={{fontSize:11,color:tier.color,marginTop:3,fontWeight:600}}>{tier.emoji} {tier.name}</div>
                </div>
              </button>
            );
          })}
          <button onClick={()=>setUser(GUEST)} style={{background:'rgba(148,163,184,0.06)',border:'1.5px solid rgba(148,163,184,0.2)',borderRadius:20,padding:'24px 16px',display:'flex',flexDirection:'column',alignItems:'center',gap:12,cursor:'pointer',outline:'none',transition:'all .15s'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(148,163,184,0.4)';}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(148,163,184,0.2)';}}>
            <div style={{width:68,height:68,borderRadius:'50%',background:'rgba(148,163,184,0.15)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:30,flexShrink:0}}>👁️</div>
            <div style={{textAlign:'center'}}>
              <div style={{fontSize:17,fontWeight:700,color:'#94a3b8'}}>Guest</div>
              <div style={{fontSize:11,color:'#64748b',marginTop:3}}>View only</div>
            </div>
          </button>
        </div>
      </div>
    );

    return(
      <div style={bgStyle}>
        <style>{GCSS}</style>
        <div style={{textAlign:'center',width:'100%',maxWidth:360}}>
          <div style={{fontSize:60}}>🏠</div>
          <div style={{fontSize:28,fontWeight:800,margin:'8px 0 4px'}}>Family Chores</div>
          <div style={{opacity:.5,marginBottom:24,fontSize:14}}>Log in to earn points & climb the leaderboard!</div>
          <div style={{...glass(),padding:26,display:'flex',flexDirection:'column',gap:12}}>
            <input value={loginForm.u} onChange={e=>setLoginForm(f=>({...f,u:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="Your name" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,padding:'12px 16px',color:'white',fontSize:15,outline:'none',boxSizing:'border-box',width:'100%'}}/>
            <input type="password" value={loginForm.p} onChange={e=>setLoginForm(f=>({...f,p:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&doLogin()} placeholder="Password" style={{background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:12,padding:'12px 16px',color:'white',fontSize:15,outline:'none',boxSizing:'border-box',width:'100%'}}/>
            {loginErr&&<div style={{color:'#f87171',fontSize:13}}>{loginErr}</div>}
            <button onClick={() => doLogin()} style={{background:'linear-gradient(135deg,#818cf8,#6366f1)',border:'none',borderRadius:12,padding:14,color:'white',fontSize:16,fontWeight:700,cursor:'pointer',marginTop:4}}>Let's Go! 🚀</button>
            <div style={{display:'flex',alignItems:'center',gap:10}}><div style={{flex:1,height:1,background:'rgba(255,255,255,0.1)'}}/><div style={{fontSize:12,opacity:.4}}>or</div><div style={{flex:1,height:1,background:'rgba(255,255,255,0.1)'}}/></div>
            <button onClick={()=>setUser(GUEST)} style={{background:'rgba(148,163,184,0.1)',border:'1px solid rgba(148,163,184,0.22)',borderRadius:12,padding:12,color:'#94a3b8',fontSize:14,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8}}>👁️ View as Guest <span style={{fontSize:11,opacity:.55}}>(read-only)</span></button>
          </div>
          <div style={{marginTop:14,display:'flex',justifyContent:'center',gap:6,flexWrap:'wrap'}}>{allFL.map(u=><div key={u.id} style={{background:`${u.color}22`,border:`1px solid ${u.color}44`,borderRadius:8,padding:'3px 10px',fontSize:12,color:u.color,fontWeight:600}}>{u.name}</div>)}</div>
        </div>
      </div>
    );
  }

  const isGuest=!!user.guest;
  const dynUsers=data.dynamicUsers||[];
  const settings=gUS(data,user.id);
  const tc=TC[settings.theme]||TC.th0;
  const customBg=(data.customBackgrounds||[]).find(b=>b.id===settings.bg);
  const bgEntry=customBg?null:(BG_APP[settings.bg]||BG_APP.bg0);
  const appFont=FONTS.find(f=>f.id===settings.font)?.css||FONTS[0].css;
  const appScale=FSIZES.find(f=>f.id===settings.fontSize)?.scale||1;
  const ov=data.choreOverrides||{};
  const allChores=[...BASE_CHORES.map(c=>({...c,...(ov[c.id]||{})})),...data.customChores];
  const stats=compStats(data.completions,data.redemptions,data);
  const today=getToday();
  const myStats=stats[user.id]||{totalTasks:0,totalPoints:0,availablePoints:0,redeemedPoints:0,weeklyPoints:0,biweeklyPoints:0,monthlyPoints:0};
  const profilePics=data.profilePics||{};
  const activeBst=getActiveBst(data);
  const mult=getMult(data,user.id);
  const ownDecoClass=getDecoClass(settings);
  const userSettingsMap=data.userSettings||{};
  const pinned=settings.pinSidebar??!isMobile;

  const isDoneToday=id=>data.completions.some(c=>c.choreId===id&&c.date===today);
  const whoDidToday=id=>{const c=data.completions.find(x=>x.choreId===id&&x.date===today);return c?getUser(c.userId,dynUsers):null;};

  const spawnParticles=(e,emojis)=>{const rect=e.currentTarget?.getBoundingClientRect?.();const cx=rect?(rect.left+rect.right)/2:window.innerWidth/2,cy=rect?rect.top:window.innerHeight/2;const np=Array.from({length:6},(_,i)=>({id:pId.current++,x:cx+((i%3-1)*28),y:cy,emoji:emojis[i%emojis.length],dur:.9+Math.random()*.4,delay:i*.07}));setParticles(p=>[...p,...np]);setTimeout(()=>setParticles(p=>p.filter(x=>!np.find(n=>n.id===x.id))),1800);};
  const toggleChore=chore=>{if(isGuest)return;const doer=whoDidToday(chore.id);if(doer&&doer.id!==user.id)return;const done=!!doer;const pts=Math.round(chore.points*mult);update(prev=>({...prev,completions:done?prev.completions.filter(c=>!(c.userId===user.id&&c.choreId===chore.id&&c.date===today)):[...prev.completions,{id:`${user.id}_${chore.id}_${today}_${Date.now()}`,userId:user.id,choreId:chore.id,points:pts,date:today}]}));};
  const completeRecurring=task=>{if(isGuest)return;const pts=Math.round(task.points*mult);update(prev=>({...prev,recurringTasks:prev.recurringTasks.map(t=>t.id===task.id?{...t,lastCompleted:today,lastCompletedBy:user.id}:t),completions:[...prev.completions,{id:`${user.id}_${task.id}_${today}_${Date.now()}`,userId:user.id,choreId:task.id,points:pts,date:today}]}));};
  const sendNudge=()=>{if(isGuest||!nudge.trim())return;update(prev=>({...prev,announcements:[...prev.announcements,{id:`ann_${Date.now()}`,text:nudge.trim()}]}));setNudge('');};
  const addSugg=()=>{if(isGuest||!sugg.trim())return;update(prev=>({...prev,suggestions:[...prev.suggestions,{id:`sg_${Date.now()}`,name:sugg.trim(),suggestedBy:user.id,suggestedByName:user.name,votes:{},createdAt:today,status:'pending'}]}));setSugg('');};
  const vote=id=>{if(isGuest)return;const val=parseInt(voteVals[id]);if(!val||val<1)return;update(prev=>({...prev,suggestions:prev.suggestions.map(s=>s.id===id?{...s,votes:{...s.votes,[user.id]:val}}:s)}));setVoteVals(p=>({...p,[id]:''}));};
  const redeem=item=>{if(isGuest||myStats.availablePoints<item.cost){setShopMsg(`Need ${item.cost-myStats.availablePoints} more pts!`);setTimeout(()=>setShopMsg(''),3e3);return;}update(prev=>({...prev,redemptions:[...prev.redemptions,{id:`red_${Date.now()}`,userId:user.id,itemName:item.name,cost:item.cost,date:today}],...(item.streakSaver?{streakSavers:{...(prev.streakSavers||{}),[user.id]:getSavers(prev,user.id)+1}}:{})}));setShopMsg(item.streakSaver?`🛡️ Streak Saver added to your inventory!`:`🎉 Redeemed: ${item.emoji} ${item.name}!`);setTimeout(()=>setShopMsg(''),4e3);};
  const purchaseThemeItem=item=>{if(isGuest||myStats.availablePoints<item.cost){setShopMsg(`Need ${item.cost-myStats.availablePoints} more pts!`);setTimeout(()=>setShopMsg(''),3e3);return;}update(prev=>({...prev,redemptions:[...prev.redemptions,{id:`red_${Date.now()}`,userId:user.id,itemName:item.name,cost:item.cost,date:today}],purchases:{...(prev.purchases||{}),[user.id]:[...((prev.purchases||{})[user.id]||[]),item.id]}}));setShopMsg(`🎉 Unlocked: ${item.emoji} ${item.name}! Equip in ⚙️ Settings.`);setTimeout(()=>setShopMsg(''),4e3);};
  const purchaseBooster=item=>{
    if(isGuest||myStats.availablePoints<item.cost)return;
    update(prev=>{
      const red=[...prev.redemptions,{id:`red_${Date.now()}`,userId:user.id,itemName:item.name,cost:item.cost,date:today}];
      if(item.permanent)return{...prev,redemptions:red,purchases:{...(prev.purchases||{}),[user.id]:[...((prev.purchases||{})[user.id]||[]),item.id]}};
      // Time stacking: extend existing booster of same multiplier, don't add a new one
      const existing=(prev.boosters||[]).find(b=>b.multiplier===item.multiplier&&b.expiresAt>Date.now());
      const expiresAt=existing?existing.expiresAt+item.durationDays*864e5:Date.now()+item.durationDays*864e5;
      const rest=(prev.boosters||[]).filter(b=>b.id!==existing?.id);
      return{...prev,redemptions:red,boosters:[...rest,{id:`bst_${Date.now()}`,multiplier:item.multiplier,expiresAt,activatedBy:user.id}]};
    });
    setShopMsg(`⚡ Booster activated! ${item.multiplier}x${item.permanent?' permanent':''}!`);setTimeout(()=>setShopMsg(''),5e3);
  };
  const onUploadPic=async(uid,file)=>{
    const compressed=await compressImage(file,240);
    update(prev=>({...prev,profilePics:{...(prev.profilePics||{}),[uid]:compressed}}));
  };
  const updateSettings=patch=>update(prev=>({...prev,userSettings:{...(prev.userSettings||{}),[user.id]:{...gUS(prev,user.id),...patch}}}));
  const broken=isGuest?null:getBrokenStreak(data.completions,user.id);
  const showStreakPrompt=!!broken&&settings.streakPromptSeen!==broken.missedDate;
  const useSaver=()=>{
    if(!broken)return;
    const have=getSavers(data,user.id);
    if(have<1&&myStats.availablePoints<15)return;
    update(prev=>{
      const had=getSavers(prev,user.id),buying=had<1;
      return{...prev,
        streakSavers:{...(prev.streakSavers||{}),[user.id]:buying?had:had-1},
        redemptions:buying?[...prev.redemptions,{id:`red_${Date.now()}`,userId:user.id,itemName:'Streak Saver',cost:15,date:today}]:prev.redemptions,
        completions:[...prev.completions,{id:`save_${user.id}_${Date.now()}`,userId:user.id,choreId:`streaksave_${broken.missedDate}`,points:0,date:broken.missedDate}],
        userSettings:{...(prev.userSettings||{}),[user.id]:{...gUS(prev,user.id),streakPromptSeen:broken.missedDate}},
      };
    });
    setShopMsg(`🛡️ Streak restored — the missed day is covered, keep it going!`);setTimeout(()=>setShopMsg(''),4e3);
  };
  const lb=getFam(data).slice();
  const pendSuggs=data.suggestions.filter(s=>s.status==='pending');
  const medals=['🥇','🥈','🥉'];
  const doSetPage=p=>{setPage(p);setSidebar(false);};
  const doLogout=()=>{setUser(null);setSidebar(false);setPage('main');};
  const pageTitles={main:'Family Chore Tracker',shop:'Rewards Shop',profile:'My Profile',console:'Admin Console',wishlist:'Wishlist',settings:'Settings',quests:'Achievements',social:'Social'};
  const spProps={allChores,recurringTasks:data.recurringTasks,user,isGuest,isDoneToday,whoDidToday,toggleChore,completeRecurring,tc,onAnim:spawnParticles};
  const bpProps={user,isGuest,lbMode,setLbMode,lb,stats,medals,setViewProfile,nudge,setNudge,sendNudge,sugg,setSugg,addSugg,pendingSuggs:pendSuggs,voteVals,setVoteVals,vote,profilePics,userSettingsMap};
  const appStyle={minHeight:'100vh',color:'white',fontFamily:appFont,fontSize:`${appScale}rem`,display:'flex',flexDirection:'column',height:'100vh',overflow:'hidden',...(customBg?{backgroundImage:`url(${customBg.imageData})`,backgroundSize:'cover',backgroundPosition:'center'}:bgEntry?.css?{background:bgEntry.css}:{})};

  return(
    <div className={(!customBg&&bgEntry?.cls)||''} style={appStyle}>
      <style>{GCSS}</style>
      <Particles particles={particles}/>
      <AchToast toasts={toasts}/>
      {showStreakPrompt&&<StreakSaveModal broken={broken} savers={getSavers(data,user.id)} points={myStats.availablePoints} onUse={useSaver} onClose={()=>updateSettings({streakPromptSeen:broken.missedDate})}/>}
      {showOnboarding&&<OnboardingModal user={user} data={data} onPurchaseThemeItem={item=>{update(prev=>({...prev,purchases:{...(prev.purchases||{}),[user.id]:[...((prev.purchases||{})[user.id]||[]),item.id]}}));}} onDone={()=>{setShowOnboarding(false);update(prev=>({...prev,userSettings:{...(prev.userSettings||{}),[user.id]:{...gUS(prev,user.id),onboardingDone:true}}}));}}/>}
      {previewMode&&<PreviewOverlay previewMode={previewMode} data={data} user={user} onClose={()=>setPreviewMode(null)} allChores={allChores} recurringTasks={data.recurringTasks} profilePics={profilePics} userSettingsMap={userSettingsMap}/>}
      {tierPopup&&<TierUpModal tier={tierPopup} name={user.name} onClose={()=>setTierPopup(null)}/>}
      {viewProfile&&<ProfileModal userId={viewProfile} stats={stats} onClose={()=>setViewProfile(null)} profilePics={profilePics} dynUsers={dynUsers} userSettingsMap={userSettingsMap}/>}
      {sidebar&&!pinned&&<Sidebar page={page} setPage={doSetPage} onClose={()=>setSidebar(false)} user={user} myStats={myStats} onLogout={doLogout} profilePics={profilePics} ownDecoClass={ownDecoClass}/>}
      <Ticker anns={data.announcements}/>
      {isGuest&&<div style={{background:'rgba(148,163,184,0.13)',borderBottom:'1px solid rgba(148,163,184,0.2)',padding:'6px 18px',display:'flex',alignItems:'center',gap:8,fontSize:12,color:'#94a3b8',flexShrink:0}}>👁️ <strong>View-Only</strong> — Log in to earn points!</div>}
      <Header onMenu={()=>setSidebar(true)} user={user} myStats={myStats} setPage={p=>{setPage(p);setSidebar(false);}} title={pageTitles[page]||''} profilePics={profilePics} settings={settings} page={page} activeBooster={activeBst} ownDecoClass={ownDecoClass} syncStatus={syncStatus} streak={calcStreak(data.completions,user.id)} hideMenu={pinned}/>
      <div style={{flex:1,display:'flex',overflow:'hidden'}}>
      {pinned&&<PinnedSidebar page={page} setPage={doSetPage} user={user} myStats={myStats} onLogout={doLogout} profilePics={profilePics} ownDecoClass={ownDecoClass}/>}
      <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch',minWidth:0}}>
        {page==='profile'&&(isGuest?<GuestProfile/>:<ProfileContent user={user} myStats={myStats} completions={data.completions} allChores={allChores} recurringTasks={data.recurringTasks} wins={data.wins||{}} profilePics={profilePics} onUploadPic={onUploadPic} userSettingsMap={userSettingsMap}/>)}
        {page==='shop'&&<ShopContent myStats={myStats} redemptions={data.redemptions} user={user} onRedeem={redeem} onPurchaseThemeItem={purchaseThemeItem} onPurchaseBooster={purchaseBooster} shopMsg={shopMsg} isGuest={isGuest} data={data} onPreview={setPreviewMode}/>}
        {page==='settings'&&<SettingsContent user={user} data={data} updateSettings={updateSettings} gotoShop={()=>doSetPage('shop')}/>}
        {page==='wishlist'&&<WishlistContent user={user} data={data} update={update} isGuest={isGuest}/>}
        {page==='quests'&&<QuestsPage user={user} data={data} update={update} stats={stats} isGuest={isGuest} allChores={allChores}/>}
        {page==='social'&&<SocialPage user={user} data={data} update={update} isGuest={isGuest} profilePics={profilePics} dynUsers={dynUsers} userSettingsMap={userSettingsMap}/>}
        {page==='console'&&user.admin&&<ConsolePage data={data} update={update}/>}
        {page==='main'&&(isMobile?(
          <div style={{display:'flex',flexDirection:'column',height:'100%'}}>
            <div style={{display:'flex',borderBottom:'1px solid rgba(255,255,255,0.08)',flexShrink:0}}>
              {[['chores','📋 Chores'],['board','🏆 Board']].map(([t,l])=>(
                <button key={t} onClick={()=>setMobileTab(t)} style={{flex:1,padding:'12px',background:mobileTab===t?'rgba(255,255,255,0.1)':'transparent',border:'none',color:mobileTab===t?'white':'rgba(255,255,255,0.4)',fontWeight:mobileTab===t?700:400,cursor:'pointer',fontSize:14}}>{l}</button>
              ))}
            </div>
            <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch',padding:'14px 12px'}}>
              {mobileTab==='chores'?<ChoresPanel {...spProps}/>:<BoardPanel {...bpProps}/>}
            </div>
          </div>
        ):(
          <div style={{display:'flex',gap:14,padding:14,height:'100%',boxSizing:'border-box',overflow:'hidden'}}>
            <div style={{flex:1,overflowY:'auto',paddingRight:2}}><ChoresPanel {...spProps}/></div>
            <div style={{width:308,overflowY:'auto',flexShrink:0}}><BoardPanel {...bpProps}/></div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
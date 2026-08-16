const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
let tasks=JSON.parse(localStorage.getItem('sbTasks')||'[]');
const save=()=>{localStorage.setItem('sbTasks',JSON.stringify(tasks));render();};
function render(){const list=$('#taskList');list.innerHTML='';tasks.forEach((t,i)=>{const li=document.createElement('li');li.className=t.done?'done':'';li.innerHTML=`<input type="checkbox" ${t.done?'checked':''} aria-label="Complete task"><span>${escapeHtml(t.text)}</span><small>${t.mins} min</small><button aria-label="Delete">×</button>`;li.querySelector('input').onchange=()=>{tasks[i].done=!tasks[i].done;save();updateStreak();};li.querySelector('button').onclick=()=>{tasks.splice(i,1);save();};list.append(li)});$('#emptyTasks').hidden=tasks.length>0;}
function escapeHtml(s){const d=document.createElement('div');d.textContent=s;return d.innerHTML}
$('#taskForm').onsubmit=e=>{e.preventDefault();tasks.push({text:$('#taskInput').value.trim(),mins:+$('#taskSize').value,done:false});$('#taskInput').value='';save();};
$$('.moods button').forEach(b=>b.onclick=()=>{$$('.moods button').forEach(x=>x.classList.remove('active'));b.classList.add('active');localStorage.setItem('sbMood',JSON.stringify({mood:b.dataset.mood,date:new Date().toDateString()}));$('#moodMessage').textContent=`Check-in saved: ${b.dataset.mood}. Thank you for being honest.`;updateStreak();});
$$('.resource-grid button').forEach(b=>b.onclick=()=>$('#tipBox').textContent=b.dataset.tip);
let left=900,tick=null;function draw(){const m=Math.floor(left/60),s=left%60;$('#timer').textContent=`${m}:${String(s).padStart(2,'0')}`};
$('#startTimer').onclick=()=>{if(tick){clearInterval(tick);tick=null;$('#startTimer').textContent='Resume focus';return}$('#startTimer').textContent='Pause';tick=setInterval(()=>{if(left<=0){clearInterval(tick);tick=null;$('#startTimer').textContent='Done!';tasks.push({text:'Focused for 15 minutes',mins:15,done:true});save();return}left--;draw()},1000)};
$('#resetTimer').onclick=()=>{clearInterval(tick);tick=null;left=900;draw();$('#startTimer').textContent='Start focus'};
$('#themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('sbDark',document.body.classList.contains('dark'))};
if(localStorage.getItem('sbDark')==='true')document.body.classList.add('dark');
function updateStreak(){const dates=JSON.parse(localStorage.getItem('sbDates')||'[]'),today=new Date().toISOString().slice(0,10);if(!dates.includes(today)){dates.push(today);localStorage.setItem('sbDates',JSON.stringify(dates))}$('#streak').textContent=`🔥 ${dates.length} day${dates.length===1?'':'s'} active`};
$('#helpPlan').onclick=()=>$('#helpDialog').showModal();$('.close').onclick=()=>$('#helpDialog').close();
$('#savePerson').onclick=()=>{localStorage.setItem('sbTrusted',$('#trustedPerson').value);$('#savePerson').textContent='Saved privately ✓'};$('#trustedPerson').value=localStorage.getItem('sbTrusted')||'';
render();updateStreak();

import { useState, useEffect } from "react";

function FocusTimer() {

const FOCUS = 1500;
const BREAK = 300;

const [time,setTime] = useState(FOCUS);
const [running,setRunning] = useState(false);
const [mode,setMode] = useState("focus");
const [sessions,setSessions] = useState(0);

useEffect(()=>{

let timer;

if(running && time>0){
timer = setInterval(()=>{
setTime(t=>t-1);
},1000);
}

if(running && time===0){

if(mode==="focus"){

alert("Focus complete! Take a break.");

setSessions(s=>s+1);
setMode("break");
setTime(BREAK);

}else{

alert("Break finished! Back to focus.");

setMode("focus");
setTime(FOCUS);

}

}

return ()=>clearInterval(timer);

},[running,time,mode]);

const minutes = Math.floor(time/60);
const seconds = time%60;

return(

<div className="timer-box">

<h3>Pomodoro Timer</h3>

<h4>{mode==="focus" ? "Focus Time" : "Break Time"}</h4>

<h2>
{minutes}:{seconds<10 ? "0"+seconds : seconds}
</h2>

<p>Sessions: {sessions}</p>

<button onClick={()=>setRunning(true)}>Start</button>
<button onClick={()=>setRunning(false)}>Pause</button>
<button onClick={()=>{
setRunning(false);
setMode("focus");
setTime(FOCUS);
}}>
Reset
</button>

</div>

);

}

export default FocusTimer;
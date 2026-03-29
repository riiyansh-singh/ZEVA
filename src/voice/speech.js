let isListening = false;
let mainRecognition = null;
function startListening() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  mainRecognition = new SR();
  mainRecognition.continuous = false;
  mainRecognition.interimResults = true;
  mainRecognition.lang = 'en-US';
  isListening = true; updateMicUI(true); mainRecognition.start();
  mainRecognition.onresult = (e) => {
    let interim='', final='';
    for (let i=e.resultIndex;i<e.results.length;i++){
      const t=e.results[i][0].transcript;
      e.results[i].isFinal?(final+=t):(interim+=t);
    }
    document.getElementById('transcript').textContent = final||interim||'—';
  };
  mainRecognition.onend = () => {
    isListening=false; updateMicUI(false);
    const text=document.getElementById('transcript').textContent.trim();
    if(text&&text!=='—') askZEVA(text); else restartWakeWord();
  };
  mainRecognition.onerror = (e) => { isListening=false; updateMicUI(false); restartWakeWord(); };
}
function toggleListen() {
  if(isListening){mainRecognition?.stop();}
  else{stopWakeWord();document.getElementById('orb')?.classList.add('listening');startListening();}
}
function speak(text) {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang='en-US'; u.rate=1.0; u.pitch=1.1;
  const v=window.speechSynthesis.getVoices();
  const pref=v.find(x=>x.name.includes('Google')||x.name.includes('Samantha'));
  if(pref) u.voice=pref;
  u.onend=()=>{document.getElementById('orb')?.classList.remove('thinking');restartWakeWord();};
  window.speechSynthesis.speak(u);
}
function updateMicUI(active) {
  const btn=document.getElementById('micBtn'),label=document.getElementById('micLabel');
  if(active){btn?.classList.add('active');if(label)label.textContent='Listening...';}
  else{btn?.classList.remove('active');if(label)label.textContent='Tap to speak';}
}
function setOrbThinking() {
  const orb=document.getElementById('orb');
  orb?.classList.remove('listening');orb?.classList.add('thinking');
  const l=document.getElementById('orbLabel');
  if(l)l.innerHTML='<strong>Thinking...</strong>';
}

const WAKE_WORD = 'hey zeva';
let wakeWordActive = false;
let wakeRecognition = null;
function initWakeWord() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) { console.warn('ZEVA: Speech API not supported'); return; }
  wakeRecognition = new SR();
  wakeRecognition.continuous = true;
  wakeRecognition.interimResults = true;
  wakeRecognition.lang = 'en-US';
  wakeRecognition.onresult = (e) => {
    const t = e.results[e.results.length-1][0].transcript.toLowerCase().trim();
    if (t.includes(WAKE_WORD)) onWakeWordDetected();
  };
  wakeRecognition.onerror = (e) => { if (e.error !== 'no-speech') console.error(e.error); };
  wakeRecognition.onend = () => { if (wakeWordActive) setTimeout(() => wakeRecognition.start(), 500); };
  wakeWordActive = true;
  wakeRecognition.start();
}
function onWakeWordDetected() {
  wakeWordActive = false; wakeRecognition?.stop();
  document.getElementById('orb')?.classList.add('listening');
  const l = document.getElementById('orbLabel');
  if (l) l.innerHTML = '<strong>Listening...</strong>';
  startListening();
}
function stopWakeWord() { wakeWordActive = false; wakeRecognition?.stop(); }
function restartWakeWord() {
  wakeWordActive = true;
  setTimeout(() => {
    wakeRecognition?.start();
    document.getElementById('orb')?.classList.remove('listening','thinking');
    const l = document.getElementById('orbLabel');
    if (l) l.innerHTML = 'Say <strong>"Hey ZEVA"</strong> to begin';
  }, 1000);
}
window.addEventListener('DOMContentLoaded', initWakeWord);

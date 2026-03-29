const ZEVA_SYSTEM_PROMPT = `You are ZEVA, a futuristic AI assistant. Keep responses short (2-3 sentences for voice). Be helpful and slightly futuristic. Never say you are Claude or made by Anthropic.`;
const conversationHistory = [];
async function askZEVA(userText) {
  if(!userText) return;
  setOrbThinking();
  document.getElementById('transcript').textContent = userText;
  document.getElementById('response').textContent = 'Processing...';
  conversationHistory.push({role:'user',content:userText});
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,system:ZEVA_SYSTEM_PROMPT,messages:conversationHistory})
    });
    const data = await res.json();
    const reply = data.content?.[0]?.text || 'I had trouble with that.';
    conversationHistory.push({role:'assistant',content:reply});
    if(conversationHistory.length>20) conversationHistory.splice(0,2);
    document.getElementById('response').textContent = reply;
    speak(reply);
  } catch(err) {
    const msg='Connection error. Check your network.';
    document.getElementById('response').textContent=msg; speak(msg);
  }
}

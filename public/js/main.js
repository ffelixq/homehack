// main.js - global helpers for accessibility & UI
// Font size controls
const root = document.documentElement;
const body = document.getElementById('body-root') || document.body;
let base = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--base-font')) || 16;

document.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('increase-font')?.addEventListener('click', ()=> { base += 1; document.documentElement.style.setProperty('--base-font', base + 'px'); });
  document.getElementById('decrease-font')?.addEventListener('click', ()=> { base = Math.max(12, base - 1); document.documentElement.style.setProperty('--base-font', base + 'px'); });
  document.getElementById('reset-font')?.addEventListener('click', ()=> { base = 16; document.documentElement.style.setProperty('--base-font', base + 'px'); });

  const contrastBtn = document.getElementById('toggle-contrast');
  contrastBtn?.addEventListener('click', ()=>{
    const enabled = body.classList.toggle('high-contrast');
    contrastBtn.setAttribute('aria-pressed', (!!enabled).toString());
  });

  // TTS read aloud of main content
  const ttsBtn = document.getElementById('tts-read');
  ttsBtn?.addEventListener('click', ()=> {
    const main = document.querySelector('main') || document.body;
    speakText(main.innerText || main.textContent || 'No content to read.');
  });

  // simple voice command (prototype)
  const vBtn = document.getElementById('voice-btn');
  if(vBtn){
    const speech = window.webkitSpeechRecognition || window.SpeechRecognition;
    if(!speech) {
      vBtn.title = 'Voice not supported in this browser';
    } else {
      const recognizer = new speech();
      recognizer.lang = 'en-US';
      recognizer.onresult = (evt) => {
        const txt = evt.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(txt);
      };
      vBtn.addEventListener('click', ()=>{
        vBtn.classList.toggle('mic-active');
        try { recognizer.start(); } catch(e) {}
      });
    }
  }

  // language select placeholder (no translations implemented)
  document.getElementById('langSelect')?.addEventListener('change', (e)=>{
    alert('Language toggle: ' + e.target.value + '\n(Translations not implemented in prototype.)');
  });
});

function speakText(text){
  if(!window.speechSynthesis) return alert('TTS not supported');
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1.0;
  window.speechSynthesis.speak(utter);
}

function handleVoiceCommand(cmd){
  // basic commands for hackathon MVP
  if(cmd.includes('show tasks') || cmd.includes('jobs')) location.href='pwd-dashboard.html';
  else if(cmd.includes('post task') || cmd.includes('create task')) location.href='company-dashboard.html';
  else if(cmd.includes('home')) location.href='index.html';
  else alert('Heard: "' + cmd + '". Try commands: "show tasks", "post task", "home".');
}


// Navbar toggle for mobile
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".navbar-toggle");
  const menu = document.querySelector(".navbar-menu");
  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => {
      const expanded = toggleBtn.getAttribute("aria-expanded") === "true";
      toggleBtn.setAttribute("aria-expanded", !expanded);
      menu.classList.toggle("active");
    });
  }
});

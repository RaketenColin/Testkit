<script>
  import { spielPunkteTeam1, spielPunkteTeam2, gesamtPunkteTeam1, gesamtPunkteTeam2, namen1, namen2} from '$lib/stores.js';
  import Buzzer from '$lib/components/Buzzer.svelte';
  import BuzzerLEDs from '$lib/components/BuzzerLEDs.svelte';
  import { goto } from '$app/navigation';
  import fragen from '$lib/spiele.json';
  import { onMount } from 'svelte';

  let zustand = 0;
  let fragenIndex = 0;
  let ersteNamen = fragen.Alle_Spiele.Namen;
  let videoElement;
  let schongedrueckt = [];
  let canvas;
  let audioElementbing;

  onMount(() => {
    const audio = new Audio('/General/Intro.mp3');
    audio.play().catch(err => {
      console.warn('Intro-Sound konnte nicht abgespielt werden', err);
    });
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const partikel = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1
    }));

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of partikel) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 217, 0, ${p.alpha})`;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        }
        requestAnimationFrame(animate);
    }
    animate();
  });
  
  function enterDruck() {
  if (fragenIndex >= ersteNamen.length - 1 && zustand === 2) {
    return;
  }
  if (zustand === 0) {
    zustand = 1;
    fragenIndex = 0;
  } else if (zustand === 1) {
    zustand = 2;
  } else if (zustand === 2) {
    zustand = 1;
    fragenIndex = Math.min(fragenIndex + 1, ersteNamen.length - 1);
    window.dispatchEvent(new CustomEvent('buzzerReset'));
  }
}

function speichernUndZurueck() {
  gesamtPunkteTeam1.update(p => p + $spielPunkteTeam1);
  gesamtPunkteTeam2.update(p => p + $spielPunkteTeam2);
  
  spielPunkteTeam1.set(0);
  spielPunkteTeam2.set(0);

  goto(`/?punkte1=${$gesamtPunkteTeam1}&punkte2=${$gesamtPunkteTeam2}`);
}

  function spielstarten() {
    if (zustand === 0){
    enterDruck();
    }
}

function handleBuzzerEnter(event) {
  const { player } = event.detail
  if (zustand !== 2 || fragenIndex >= ersteNamen.length - 1) return;
  if ($namen1.includes(player)) {
    audioElementbing.play();
    spielPunkteTeam1.update(p => p + 10);
  } else if ($namen2.includes(player)) {
    audioElementbing.play();
    spielPunkteTeam2.update(p => p + 10);
  }
}
</script>

<Buzzer {zustand} />
<svelte:window
  on:buzzerEnter={handleBuzzerEnter}
  on:keydown={(e) => {
    if (e.key === 'Enter'){
      enterDruck();
      schongedrueckt = [];
    } 
    if (e.key === 'Escape') {
      videoElement.play();
    }
    if (['F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'].includes(e.key)&&!schongedrueckt.includes(e.key)) {
      videoElement.pause();
      schongedrueckt.push(e.key);
    }
  }
}
/>

<div class="full-screen-bg">
  <canvas class="partikel-canvas" bind:this={canvas}></canvas>
  <div class="punkte-leiste">
    <div class="team-block">
      <span class="team-name">Team 1</span>
      <span class="punkte-zahl">{$spielPunkteTeam1}</span>
    </div>

    <span class="brett-info">Namen</span>

    <div class="team-block rechts">
      <span class="punkte-zahl">{$spielPunkteTeam2}</span>
      <span class="team-name">Team 2</span>
    </div>
</div>

    <button class="speichern-btn" on:click={speichernUndZurueck}>
      Zurück zum Hauptmenü
    </button>

    <button class="Spielstarten" on:click={spielstarten}>
        Spiel starten
    </button>

    <div class="quiz-container">
      {#if zustand === 1}
        <video bind:this={videoElement} src={ersteNamen[fragenIndex].Person.Videopfad} controls autoplay muted> </video>
      {/if}
 
      {#if zustand === 2}
        <p style="font-size: 5rem; color: white; font-weight: bold; margin-top: 100px;">
        {ersteNamen[fragenIndex].Person.Namen}</p>
      {/if}
    </div>
</div>

<div class="titel-wrapper">
  <div class="titel-pille">Namen</div>
</div>

<div style="position: fixed; top: 70px; left: 50%; transform: translateX(-50%); z-index: 100;">
  <BuzzerLEDs />
</div>

<audio bind:this={audioElementbing} src="/General/ding.mp3" controls> </audio>

<style>

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;700;900&display=swap');

.full-screen-bg {
    background: linear-gradient(160deg, #041D53 0%, #0a2e7a 50%, #041D53 100%);
    min-height: 100vh;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    font-family: 'Nunito', sans-serif;
}
.partikel-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 0;
    pointer-events: none;
}

.punkte-leiste {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 32px;
    background: rgba(0,0,0,0.3);
    border-bottom: 2px solid rgba(255,217,0,0.2);
    box-sizing: border-box;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
}

.team-block {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
}

.team-block.rechts {
    flex-direction: row;
}

.punkte-zahl {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem;
    color: #FFD900;
    text-shadow: 0 0 20px rgba(255,217,0,0.5);
  }

.team-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.7);
}

.brett-info {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    color: rgba(255,255,255,0.4);
    letter-spacing: 3px;
}

.speichern-btn, .Spielstarten {
    position: fixed;
    width: 200px;
    height: 50px;
    background: linear-gradient(135deg, #FFD900, #c9a800);
    border: 2px solid rgba(255,217,0,0.4);
    border-radius: 999px;
    font-family: 'Nunito', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #041D53;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
    z-index: 10;
}

.speichern-btn:hover, .Spielstarten:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}

.speichern-btn { bottom: 20px; right: 20px; }
.Spielstarten  { bottom: 20px; left: 20px; }

.quiz-container {
  position: absolute;
  top: 85px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 1;
  padding-top: 16px;
}

video {
  max-width: 1200px;
  max-height: 700px;
  width: auto;
  height: auto;
  border-radius: 16px;
  border: 2px solid rgba(255, 217, 0, 0.35);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.6),
    0 0 24px rgba(255, 217, 0, 0.15);
}

.titel-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    perspective: 800px;
}

.titel-pille {
    background: linear-gradient(135deg, #FFD900, #c9a800);
    color: #041D53;
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    letter-spacing: 6px;
    padding: 20px 60px;
    border-radius: 999px;
    box-shadow: 0 8px 40px rgba(255, 217, 0, 0.4);
    animation: pilleEinflug 5s ease-in-out forwards;
    pointer-events: none;
    transform-origin: center center;
}

@keyframes pilleEinflug {
    0% {
        opacity: 0;
        transform: translateX(-120vw) rotateY(0deg) scale(0.8);
    }
    25% {
        opacity: 1;
        transform: translateX(0) rotateY(0deg) scale(1);
    }
    75% {
        opacity: 1;
        transform: translateX(0) rotateY(360deg) scale(1);
    }
    100% {
        opacity: 0;
        transform: translateX(0) rotateY(360deg) scale(1);
    }
}

audio {
  display: none;
}

</style>
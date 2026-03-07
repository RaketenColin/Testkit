<script>
  import { spielPunkteTeam1, spielPunkteTeam2, gesamtPunkteTeam1, gesamtPunkteTeam2, namen1, namen2 } from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import fragen from '$lib/spiele.json';
  import { onMount } from 'svelte';

  let rundeTeam1 = 0;
  let rundeTeam2 = 0;
  let zustand = 0;
  let fragenIndex = 0;
  let schaetzfrage = fragen.Alle_Spiele.Schaetzen;
  let antwortzahl = 0;
  $: antwortzahl = schaetzfrage[fragenIndex]?.Frage?.Antwortzahl;
  let canvas;
  let audioElement;

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

function spielstarten() {
    if (zustand === 0){
    enterDruck();
    }
}

function enterDruck() {
  if (fragenIndex >= schaetzfrage.length - 1 && zustand === 2) {
    return;
  }
  if (zustand === 0) {
    zustand = 1;
    fragenIndex = 0;
  } else if (zustand === 1) {
    zustand = 2;
  } else if (zustand === 2) {
    $spielPunkteTeam1 += rundeTeam1;
    $spielPunkteTeam2 += rundeTeam2;
    rundeTeam1 = 0;
    rundeTeam2 = 0;
    zustand = 1;
    fragenIndex = Math.min(fragenIndex + 1, schaetzfrage.length - 1);
  }
}

function speichernUndZurueck() {
  $spielPunkteTeam1 += rundeTeam1;
  $spielPunkteTeam2 += rundeTeam2;
  gesamtPunkteTeam1.update(p => p + $spielPunkteTeam1);
  gesamtPunkteTeam2.update(p => p + $spielPunkteTeam2);
  spielPunkteTeam1.set(0);
  spielPunkteTeam2.set(0);
  goto(`/?punkte1=${$gesamtPunkteTeam1}&punkte2=${$gesamtPunkteTeam2}`);
}

function handleKeydown(event) {
    if (event.key === 'Enter') {
      enterDruck();
      return;
    }
}

</script>


<div class="full-screen-bg">
<canvas class="partikel-canvas" bind:this={canvas}></canvas>
  <div class="punkte-leiste">
    <div class="team-block">
      <span class="team-name">Team 1</span>
      <span class="punkte-zahl">{$spielPunkteTeam1}</span>
    </div>

    <span class="brett-info">Schätzen</span>

    <div class="team-block rechts">
      <span class="punkte-zahl">{$spielPunkteTeam2}</span>
      <span class="team-name">Team 2</span>
    </div>
</div>

<div class="punkte-seite links">
  <div class="punkte-buttons">
    <button class="punkte-btn" disabled={zustand !== 2} on:click={()=> $spielPunkteTeam1 += 2}>2</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam1 += 4}>4</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam1 += 6}>6</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam1 += 8}>8</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam1 += 10}>10</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam1 += 15}>15</button>
  </div>
</div>

<div class="punkte-seite rechts">
  <div class="punkte-buttons">
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam2 += 2}>2</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam2 += 4}>4</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam2 += 6}>6</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam2 += 8}>8</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam2 += 10}>10</button>
    <button class="punkte-btn" disabled={zustand !== 2} on:click={() => $spielPunkteTeam2 += 15}>15</button>
  </div>
</div>

<div class="titel-wrapper">
    <div class="titel-pille">Schätzen</div>
</div>

<audio bind:this={audioElement} src="/General/ding.mp3" controls> </audio>

  <button class="speichern-btn" on:click={speichernUndZurueck}>
    Zurück zum Hauptmenü
  </button>


    <button class="Spielstarten" on:click={spielstarten}>
        Spiel starten
    </button>

  <div class="quiz-container">
    {#if fragenIndex <=19}
      {#if zustand === 1}
        <div class="frage-kasten">
          {schaetzfrage[fragenIndex].Frage.Fragestellung}
        </div>
      {/if}
 
      {#if zustand === 2}
        <div class="frage-kasten">
          {schaetzfrage[fragenIndex].Frage.Fragestellung}
        </div>
        <p style="font-size: 2rem; color: white; font-weight: bold; margin-top: 50px;">
        {schaetzfrage[fragenIndex].Frage.Antworttext}</p>
        <div class="skala-container">
          <div class="skala-feld dunkelrot"></div>
          <div class="skala-feld hellrot"></div>
          <div class="skala-feld orange"></div>
          <div class="skala-feld gelb"></div>
          <div class="skala-feld gruen"></div>
          <div class="skala-feld gelb"></div>
          <div class="skala-feld orange"></div>
          <div class="skala-feld hellrot"></div>
          <div class="skala-feld dunkelrot"></div>
        </div>
        <div class="skala-labels">
          <div class="skala-label">{(antwortzahl * 0.5).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 0.8).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 0.9).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 0.95).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 0.98).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 1.02).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 1.05).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 1.1).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 1.2).toLocaleString()}</div>
          <div class="skala-label">{(antwortzahl * 1.5).toLocaleString()}</div>
        </div>
      {/if}
    {/if}

    {#if fragenIndex === 20}
      {#if zustand === 1}
        <div class="frage-kasten">
          {schaetzfrage[fragenIndex].Frage.Fragestellung}
        </div>
      {/if}
 
      {#if zustand === 2}
        <div class="frage-kasten">
          {schaetzfrage[fragenIndex].Frage.Fragestellung}
        </div>
        <p style="font-size: 2rem; color: white; font-weight: bold; margin-top: 50px;">
        {$spielPunkteTeam1}</p>
        <div class="skala-container">
          <div class="skala-feld dunkelrot"></div>
          <div class="skala-feld hellrot"></div>
          <div class="skala-feld orange"></div>
          <div class="skala-feld gelb"></div>
          <div class="skala-feld gruen"></div>
          <div class="skala-feld gelb"></div>
          <div class="skala-feld orange"></div>
          <div class="skala-feld hellrot"></div>
          <div class="skala-feld dunkelrot"></div>
        </div>
        <div class="skala-labels">
          <div class="skala-label">{($spielPunkteTeam1 * 0.5).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 0.8).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 0.9).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 0.95).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 0.98).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 1.02).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 1.05).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 1.1).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 1.2).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam1 * 1.5).toLocaleString()}</div>
        </div>
      {/if}
    {/if}

    {#if fragenIndex === 21}
      {#if zustand === 1}
        <div class="frage-kasten">
          {schaetzfrage[fragenIndex].Frage.Fragestellung}
        </div>
      {/if}
 
      {#if zustand === 2}
        <div class="frage-kasten">
          {schaetzfrage[fragenIndex].Frage.Fragestellung}
        </div>
        <p style="font-size: 2rem; color: white; font-weight: bold; margin-top: 50px;">
        {$spielPunkteTeam2}</p>
        <div class="skala-container">
          <div class="skala-feld dunkelrot"></div>
          <div class="skala-feld hellrot"></div>
          <div class="skala-feld orange"></div>
          <div class="skala-feld gelb"></div>
          <div class="skala-feld gruen"></div>
          <div class="skala-feld gelb"></div>
          <div class="skala-feld orange"></div>
          <div class="skala-feld hellrot"></div>
          <div class="skala-feld dunkelrot"></div>
        </div>
        <div class="skala-labels">
          <div class="skala-label">{($spielPunkteTeam2 * 0.5).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 0.8).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 0.9).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 0.95).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 0.98).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 1.02).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 1.05).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 1.1).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 1.2).toLocaleString()}</div>
          <div class="skala-label">{($spielPunkteTeam2 * 1.5).toLocaleString()}</div>
        </div>
      {/if}
    {/if}

  </div>
</div>

<svelte:window on:keydown={handleKeydown} />

<style>

@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;700;900&display=swap');
    
.full-screen-bg {
  background-color: rgba(4, 29, 83, 0.898) !important;
  min-height: 100vh !important;
  width: 100vw !important;
  height: 100vh !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  z-index: -1 !important;
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
.Spielstarten  { 
bottom: 20px; left: 20px; 
}

.quiz-container {
  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 1;
}

.frage-kasten {
  background: linear-gradient(160deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05));
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 217, 0, 0.4);
  border-radius: 20px;
  padding: 2rem 3rem;
  max-width: 80vw;
  text-align: center;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  letter-spacing: 2px;
  color: white;
  box-shadow:
    0 8px 40px rgba(255, 217, 0, 0.15),
    0 4px 12px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(255,255,255,0.1);
  margin: 0 auto;
}

.skala-container {
  display: flex;
  justify-content: center;
  gap: 0;
  margin-top: 2rem;
  padding: 1rem 0;
  filter: drop-shadow(0 6px 12px rgba(0,0,0,0.5));
}

.skala-feld {
  width: 150px;
  height: 40px;
  border-radius: 0px;
  border: none;
  flex-shrink: 0;
}

.skala-feld:first-child { border-radius: 8px 0 0 8px; }
.skala-feld:last-child  { border-radius: 0 8px 8px 0; }

.skala-labels {
  display: flex;
  gap: 0;
  font-size: 1.6rem;
  color: white;
  margin-top: 0px;
}

.skala-label {
  width: 150px;
  text-align: center;
}

.dunkelrot { background: linear-gradient(180deg, #990000, #550000); }
.hellrot   { background: linear-gradient(180deg, #ff4444, #cc1111); }
.orange    { background: linear-gradient(180deg, #ffaa00, #cc7700); }
.gelb      { background: linear-gradient(180deg, #ffff00, #cccc00); }
.gruen     { background: linear-gradient(180deg, #00ff00, #00aa00); }

.punkte-buttons {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column; 
  gap: 8px;
  justify-content: center;
  margin: 1rem 0;
}

.punkte-btn {
  width: 50px;
  height: 30px;
  background: linear-gradient(135deg, #FFD900, #c9a800);
  border: 2px solid rgba(255,217,0,0.4);
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #041D53;
  cursor: pointer;
  transition: all 0.2s;
}

.punkte-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.punkte-seite {
  position: fixed;
  top: 78%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 10;
  padding: 20px;
}

.punkte-seite.links { left: 20px; }
.punkte-seite.rechts { right: 20px; }

audio {
    display: none;
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

</style>
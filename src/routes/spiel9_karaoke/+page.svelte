<script>
  import { spielPunkteTeam1, spielPunkteTeam2, gesamtPunkteTeam1, gesamtPunkteTeam2, namen1, namen2, errateneSongsTeam1, errateneSongsTeam2 } from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let zusatzTeam1 = 0;
  let zusatzTeam2 = 0;
  let showImage = false;
  let canvas;

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

function speichernUndZurueck() {
  gesamtPunkteTeam1.update(p => p + parseInt(zusatzTeam1 || 0));
  errateneSongsTeam1.set([]);
  gesamtPunkteTeam2.update(p => p + parseInt(zusatzTeam2 || 0));
  errateneSongsTeam2.set([]);
  goto(`/?punkte1=${$gesamtPunkteTeam1}&punkte2=${$gesamtPunkteTeam2}`);
}
</script>


<div class="full-screen-bg">
<canvas class="partikel-canvas" bind:this={canvas}></canvas>
<div class="punkte-leiste">
    <div class="team-block">
      <span class="team-name">Team 1</span>
      <span class="punkte-zahl">{$spielPunkteTeam1}</span>
    </div>

    <span class="brett-info">Karaoke</span>

    <div class="team-block rechts">
      <span class="punkte-zahl">{$spielPunkteTeam2}</span>
      <span class="team-name">Team 2</span>
    </div>
</div>

  {#if $errateneSongsTeam1.length > 0}
    <div class="song-liste links">
      <div class="liste-header">Team 1: {$errateneSongsTeam1.length} Songs</div>
        <div class="songs-fixed">
        {#each $errateneSongsTeam1.slice(-29) as titel}
          <div class="song-item">{titel}</div>
        {/each}
      </div>
    </div>
  {/if}

{#if $errateneSongsTeam2.length > 0}
    <div class="song-liste rechts">
      <div class="liste-header">Team 2: {$errateneSongsTeam2.length} Songs</div>
        <div class="songs-fixed">
        {#each $errateneSongsTeam2.slice(-29) as titel}
          <div class="song-item">{titel}</div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="punkte-container">

    <div class="punkte-feld">
      <h3>Punkte Team 1</h3>
      <input type="number" bind:value={zusatzTeam1} placeholder="0" />
    </div>
    
    <div class="punkte-feld">
      <h3>Punkte Team 2</h3>
      <input type="number" bind:value={zusatzTeam2} placeholder="0" />
      
      
    </div>
  </div>

  <button class="speichern-btn" on:click={speichernUndZurueck}>Zurück zum Hauptmenü</button>
  <button class="Spielstarten" on:click={spielstarten}>Spiel starten</button>
</div>

<img class="karaokebild" src="General/Ultrastar.png" alt="Karaoke" height="700" />

<div class="titel-wrapper">
    <div class="titel-pille">Karaoke</div>
  </div>

<style>

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

.punkte-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 90vh;
  transform: translateY(-50%); 
}
  
.punkte-feld {
  text-align: center;
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

.karaokebild {
    position: fixed;
    top: 85px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    border-radius: 16px;
    border: 2px solid rgba(255,217,0,0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: bildEinblenden 0.4s ease forwards;
}

.speichern-btn { bottom: 20px; right: 20px; }
.Spielstarten  { bottom: 20px; left: 20px; }

.song-liste {
  position: absolute;
  top: 80px;           /* Von oben */
  left: 50%;           /* Horizontal zentriert */
  transform: translateX(-50%);
  width: 400px;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.3);
  font-size: 1rem;
  color: white;
  margin-bottom: 20px;
  z-index: 5;
}

.song-liste.links {
  left: calc(50% - 750px);
  transform: none;
}

.song-liste.rechts {
  left: calc(50% + 350px);
  transform: none;
}

.songs-fixed {
  max-height: calc(29 * 32px);
  overflow-y: auto;
  padding: 8px;
}

.song-item {
    line-height: 24px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    animation: songEinblenden 0.35s ease forwards;
    opacity: 0;
}

.song-item:nth-child(even) {
    background: rgba(255, 255, 255, 0.06);
}

.song-item::before {
    content: '♪';
    color: #FFD900;
    font-size: 0.9rem;
    flex-shrink: 0;
}

@keyframes songEinblenden {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.liste-header {
    background: linear-gradient(135deg, #FFD900, #c9a800);
    padding: 4px 8px;
    border-radius: 12px 12px 0 0;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.2rem;
    letter-spacing: 2px;
    color: #041D53;
}

input {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 217, 0, 0.3);
    border-radius: 12px;
    padding: 10px 20px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    color: #FFD900;
    text-align: center;
    width: 150px;
    outline: none;
    transition: border 0.2s, box-shadow 0.2s;
}

input:focus {
    border-color: rgba(255, 217, 0, 0.7);
    box-shadow: 0 0 16px rgba(255, 217, 0, 0.2);
}

.punkte-feld h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.7);
    margin-bottom: 8px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    appearance: none;
}

input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
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
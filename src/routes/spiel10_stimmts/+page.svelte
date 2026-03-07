<script>
  import { spielPunkteTeam1, spielPunkteTeam2, gesamtPunkteTeam1, gesamtPunkteTeam2, namen1, namen2 } from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import fragen from '$lib/spiele.json';
  import { onMount } from 'svelte';
  let zusatzTeam1 = 0;
  let zusatzTeam2 = 0;
  let fragenIndex = 0;
  let zustand = 0;
  let fragestellung = fragen.Alle_Spiele.Stimmts;
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
  
function enterDruck() {
  if (fragenIndex >= fragestellung.length - 1 && zustand === 2) {
    return;
  }
  if (zustand === 0) {
    zustand = 1;
    fragenIndex = 0;
  } else if (zustand === 1) {
    zustand = 2;
  } else if (zustand === 2) {
    zustand = 1;
    fragenIndex = Math.min(fragenIndex + 1, fragestellung.length - 1);
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

function handleKeydown(event) {
    if (event.key === 'Enter') {
      enterDruck();
      return;
    }
    if (event.key === 'ArrowLeft'&& $spielPunkteTeam1 < 120) {
      $spielPunkteTeam1 += 3;
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && $spielPunkteTeam2 < 120) {
      $spielPunkteTeam2 += 3;
      event.preventDefault();
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
    <span class="brett-info">Stimmt's?</span>
    <div class="team-block rechts">
      <span class="punkte-zahl">{$spielPunkteTeam2}</span>
      <span class="team-name">Team 2</span>
    </div>
  </div>

  <div class="titel-wrapper">
  <div class="titel-pille">Stimmt's?</div>
</div>

    <button class="speichern-btn" on:click={speichernUndZurueck}>
    Zurück zum Hauptmenü
    </button>


    <button class="Spielstarten" on:click={spielstarten}>
        Spiel starten
    </button>

    <div class="quiz-container">
      {#if zustand === 1}
  <div class="frage-kasten">
    {fragestellung[fragenIndex].Frage.Aussage}
  </div>
{/if}

{#if zustand === 2}
  <div class="antwort-kasten {fragestellung[fragenIndex].Frage.Antwort ? 'true' : 'false'}">
    {fragestellung[fragenIndex].Frage.Antworttext}
  </div>
{/if}
    </div>

</div>

<svelte:window on:keydown={handleKeydown} />

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

.team-block.rechts { flex-direction: row; }

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
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    z-index: 1;
    width: 90%;
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
    font-size: 3rem;
    letter-spacing: 2px;
    color: white;
    box-shadow:
        0 8px 40px rgba(255, 217, 0, 0.15),
        0 4px 12px rgba(0,0,0,0.5),
        inset 0 1px 0 rgba(255,255,255,0.1);
    animation: kastenEinblenden 0.4s ease forwards;
    opacity: 0;
}

.antwort-kasten {
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 2rem 3rem;
    max-width: 80vw;
    text-align: center;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 3rem;
    letter-spacing: 2px;
    color: white;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    animation: kastenEinblenden 0.4s ease forwards;
    opacity: 0;
}

@keyframes kastenEinblenden {
    from {
        opacity: 0;
        transform: translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.antwort-kasten.true {
    background: rgba(0, 255, 0, 0.2);
    border: 2px solid rgba(0, 255, 0, 0.7);
    box-shadow: 0 8px 32px rgba(0, 150, 0, 0.5);
}

.antwort-kasten.false {
    background: rgba(255, 0, 0, 0.2);
    border: 2px solid rgba(255, 0, 0, 0.7);
    box-shadow: 0 8px 32px rgba(150, 0, 0, 0.5);
}

.titel-wrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 5;
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
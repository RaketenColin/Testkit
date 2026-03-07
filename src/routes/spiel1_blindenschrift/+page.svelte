<script>
  import { spielPunkteTeam1, spielPunkteTeam2, gesamtPunkteTeam1, gesamtPunkteTeam2, namen1, namen2 } from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  let zusatzTeam1 = 0;
  let zusatzTeam2 = 0;
  let showImage = false;
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

  function handleKeydown(event) {
    if (event.key === 'ArrowLeft'&& $spielPunkteTeam1 < 18) {
      $spielPunkteTeam1 += 1;
      audioElement.play();
      event.preventDefault();
    } else if (event.key === 'ArrowRight' && $spielPunkteTeam2 < 18) {
      $spielPunkteTeam2 += 1;
      audioElement.play();
      event.preventDefault();
    }
  }

  function speichernUndZurueck() {
    zusatzTeam1 = $spielPunkteTeam1*5;
    zusatzTeam2 = $spielPunkteTeam2*5;
    gesamtPunkteTeam1.update(p => p + parseInt(zusatzTeam1 || 0));
    gesamtPunkteTeam2.update(p => p + parseInt(zusatzTeam2 || 0));
    spielPunkteTeam1.set(0);
    spielPunkteTeam2.set(0);
    goto(`/?punkte1=${$gesamtPunkteTeam1}&punkte2=${$gesamtPunkteTeam2}`);
  }

  function spielstarten() {
    showImage = !showImage;
  }
</script>

<div class="full-screen-bg">
<canvas class="partikel-canvas" bind:this={canvas}></canvas>
  <div class="punkte-leiste">
    <div class="team-block">
      <span class="team-name">Team 1</span>
      <div class="punkteleiste">
        {#each Array(18) as _, i}
          <div class="punkt { $spielPunkteTeam1 > i ? 'aktiv' : 'inaktiv' }"></div>
        {/each}
      </div>
    </div>

    <span class="brett-info">Blindenschrift</span>

    <div class="team-block rechts">
      <span class="team-name">Team 2</span>
      <div class="punkteleiste">
        {#each Array(18) as _, i}
          <div class="punkt { $spielPunkteTeam2 > i ? 'aktiv' : 'inaktiv' }"></div>
        {/each}
      </div>
    </div>
  </div>

  <div class="titel-wrapper">
    <div class="titel-pille">Blindenschrift</div>
  </div>

  <audio bind:this={audioElement} src="/General/ding.mp3" controls> </audio>

  <button class="speichern-btn" on:click={speichernUndZurueck}>
    Zurück zum Hauptmenü
  </button>

  <button class="Spielstarten" on:click={spielstarten}>
    Spiel starten
  </button>
</div>

{#if showImage}
  <img class="blindenschrift-bild" src="Spiel1/braille_alphabet2.png" alt="Blindenschrift" width="1650" />
{/if}

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
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
}

.team-block.rechts {
    align-items: flex-end;
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

.punkteleiste {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 6px;
    padding: 8px;
    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
}

.punkt {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #ffd700;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.aktiv {
    background: #ffd700;
    box-shadow: 0 0 25px #ffd70080, inset 0 2px 10px #ffed4a;
    animation: popEin 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes popEin {
    0%   { transform: scale(0);    opacity: 0; }
    60%  { transform: scale(1.35); opacity: 1; }
    100% { transform: scale(1.15); opacity: 1; }
}

.inaktiv {
    background: rgba(255,215,0,0.1);
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


.blindenschrift-bild {
    position: fixed;
    top: 135px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    border-radius: 16px;
    border: 2px solid rgba(255,217,0,0.3);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    animation: bildEinblenden 0.4s ease forwards;
}

@keyframes bildEinblenden {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(16px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
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
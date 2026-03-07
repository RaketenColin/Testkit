<script>
  import { spielPunkteTeam1, spielPunkteTeam2, gesamtPunkteTeam1, gesamtPunkteTeam2, namen1, namen2} from '$lib/stores.js';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import spiele from '$lib/spiele.json';

  const alleSpielbrettDaten = spiele["Alle_Spiele"]["Wer_weiss_mehr"];

  let aktuellerIndex = 0;
  let aufgedeckt = [];
  let punkteVergeben = false;

  $: aktuell = alleSpielbrettDaten[aktuellerIndex]?.Sammlung;
  $: antworten = aktuell?.Antworten ?? [];

  function initBrett() {
  const aktuelleAntworten = alleSpielbrettDaten[aktuellerIndex]?.Sammlung?.Antworten ?? [];
  aufgedeckt = new Array(aktuelleAntworten.length).fill(false);
  punkteVergeben = false;
}

  $: if (aktuell) initBrett();

  // Moderator deckt einzelne Karte auf
  function karteUmdrehen(i) {
    if (aufgedeckt[i]) return;
    aufgedeckt[i] = true;
    aufgedeckt = [...aufgedeckt];
  }

  // NEU: Moderator vergibt Punkte manuell an ein Team
  function punkteGeben(team) {
    if (punkteVergeben) return;
    punkteVergeben = true;
    if (team === 1) {
      spielPunkteTeam1.update(p => p + 15);
    } else {
      spielPunkteTeam2.update(p => p + 15);
    }
  }

  function naechstesBrett() {
  if (aktuellerIndex < alleSpielbrettDaten.length - 1) {
    aktuellerIndex++;
  } else {
    zurueckZumHauptmenu();
  }
}

  function zurueckZumHauptmenu() {
    gesamtPunkteTeam1.update(p => p + $spielPunkteTeam1);
    gesamtPunkteTeam2.update(p => p + $spielPunkteTeam2);

    spielPunkteTeam1.set(0);
    spielPunkteTeam2.set(0);

    goto(`/?punkte1=${$gesamtPunkteTeam1}&punkte2=${$gesamtPunkteTeam2}`);
  }

  onMount(() => {
    initBrett();
    const audio = new Audio('/General/Intro.mp3');
    audio.play().catch(err => {
    console.warn('Intro-Sound konnte nicht abgespielt werden', err);
    });
  });

  $: kartenHoehe = (() => {
  const anzahl = alleSpielbrettDaten[aktuellerIndex]?.Sammlung?.Antworten?.length ?? 0;
  if (anzahl <= 24) return 150;
  if (anzahl <= 32) return 135;
  if (anzahl <= 50) return 95;
  if (anzahl <= 64) return 64;
  return 54;
})();

</script>


<!-- ── HAUPT-LAYOUT ───────────────────────────────────────────────────────── -->
<div class="seite">

  <!-- Punkteanzeige oben -->
  <div class="punkte-leiste">
    <div class="team-punkte">
      <span class="team-name">Team 1</span>
      <span class="punkte-zahl">{$spielPunkteTeam1}</span>
    </div>
    <span class="brett-info">{aktuellerIndex + 1} / {alleSpielbrettDaten.length}</span>
    <div class="team-punkte">
      <span class="punkte-zahl">{$spielPunkteTeam2}</span>
      <span class="team-name">Team 2</span>
    </div>
  </div>


  {#if aktuell}
    <!-- Kategorie-Titel -->
    <div class="kategorie-header">
      <h2>{aktuell.Kategorie}</h2>
      <span class="badge">{antworten.length} Antworten · 15 Punkte</span>
    </div>

    <!-- Karten-Raster: für jede Antwort eine Karte -->
    <div class="karten-raster" style="--karten-hoehe: {kartenHoehe}px">
      {#each alleSpielbrettDaten[aktuellerIndex]?.Sammlung?.Antworten ?? [] as antwort, i}
        <button
          class="karte"
          class:aufgedeckt={aufgedeckt[i]}
          on:click={() => karteUmdrehen(i)}
          disabled={aufgedeckt[i]}
        >
          <!-- Vorderseite: verdeckt -->
          <div class="karte-vorderseite">
            <span class="kartennummer">{i + 1}</span>
          </div>
          <!-- Rückseite: Antwort -->
          <div class="karte-rueckseite">
            <span>{Object.values(antwort)[0]}</span>
          </div>
        </button>
      {/each}
    </div>

    <!-- Steuerleiste unten -->
    <div class="steuerung">

      <!-- Punkte-Vergabe: nur sichtbar solange keine Punkte vergeben wurden -->
      {#if !punkteVergeben}
        <div class="vergabe">
          <span class="vergabe-label">Punkte vergeben:</span>
          <button class="btn blau" on:click={() => punkteGeben(1)}>Team 1 +15</button>
          <button class="btn rot"  on:click={() => punkteGeben(2)}>Team 2 +15</button>
        </div>
      {:else}
        <!-- Bestätigung nach Vergabe -->
        <div class="vergabe">
          <span class="vergabe-label">✅ Punkte vergeben!</span>
        </div>
      {/if}

      <!-- Navigation -->
      <div class="navigation">
        <button class="btn dunkel" on:click={naechstesBrett}>
          Nächstes Brett →
        </button>
        <button class="btn grau" on:click={zurueckZumHauptmenu}>
          Hauptmenü
        </button>
      </div>

    </div>
  {/if}
</div>


<style>
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;700;900&display=swap');

  :global(body) {
    margin: 0;
    padding: 0;
    background: #041D53;
    overflow: hidden;
  }

  /* ── LAYOUT ──────────────────────────────────────────────────────────────── */
  .seite {
    min-height: 100vh;
    width: 100vw;
    background: linear-gradient(160deg, #041D53 0%, #0a2e7a 50%, #041D53 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Nunito', sans-serif;
    box-sizing: border-box;
    overflow: hidden;
  }

  /* ── PUNKTE-LEISTE ───────────────────────────────────────────────────────── */
  .punkte-leiste {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 32px;
    background: rgba(0,0,0,0.3);
    border-bottom: 2px solid rgba(255,217,0,0.2);
    box-sizing: border-box;
  }

  .team-punkte {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .team-name {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.7);
  }

  .punkte-zahl {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2.2rem;
    color: #FFD900;
    text-shadow: 0 0 20px rgba(255,217,0,0.5);
  }

  .brett-info {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 2rem;
    color: rgba(255,255,255,0.4);
    letter-spacing: 3px;
  }

  /* ── KATEGORIE ───────────────────────────────────────────────────────────── */
  .kategorie-header {
    text-align: center;
    margin: 20px 0 10px;
  }

  .kategorie-header h2 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.8rem, 4vw, 3rem);
    color: #FFD900;
    margin: 0;
    letter-spacing: 3px;
    text-shadow: 0 0 30px rgba(255,217,0,0.4);
  }

  .badge {
    display: inline-block;
    margin-top: 6px;
    padding: 4px 16px;
    background: rgba(255,217,0,0.1);
    border: 1px solid rgba(255,217,0,0.3);
    border-radius: 999px;
    color: rgba(255,255,255,0.6);
    font-size: 0.85rem;
  }

  /* ── KARTEN-RASTER ───────────────────────────────────────────────────────── */
  .karten-raster {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 12px;
    width: 90%;
    max-width: 1400px;
    margin: 10px auto;
  }

  /* ── EINZELNE KARTE ──────────────────────────────────────────────────────── */
  .karte {
    height: var(--karten-hoehe);
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    position: relative;
  }

  .karte:disabled {
    cursor: default;
  }

  /* Vorder- und Rückseite übereinander, per scaleX animiert */
  .karte-vorderseite,
  .karte-rueckseite {
    position: absolute;
    inset: 0;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    transition: opacity 0.2s ease, transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }

  /* VERDECKT: Vorderseite sichtbar */
  .karte-vorderseite {
    background: linear-gradient(135deg, #FFD900, #c9a800);
    border: 2px solid rgba(255, 255, 255, 0.3);
    opacity: 1;
    transform: scaleX(1);
    z-index: 2;
}

  /* VERDECKT: Rückseite versteckt */
  .karte-rueckseite {
    background: linear-gradient(135deg, #FFD900, #FFC200);
    border: 2px solid rgba(255, 200, 0, 0.6);
    opacity: 0;
    transform: scaleX(0);
    z-index: 1;
    padding: 8px;
    font-family: 'Nunito', sans-serif;
    font-size: clamp(0.6rem, 1.5vw, 0.85rem);
    font-weight: 900;
    color: #041D53;
    text-align: center;
    word-break: break-word;
    hyphens: auto;
  }

  /* AUFGEDECKT: Vorderseite verschwindet */
  .karte.aufgedeckt .karte-vorderseite {
    opacity: 0;
    transform: scaleX(0);
  }

  /* AUFGEDECKT: Rückseite erscheint */
  .karte.aufgedeckt .karte-rueckseite {
    opacity: 1;
    transform: scaleX(1);
  }

  .kartennummer {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.5rem;
    color: rgba(4, 29, 83, 0.5);
    letter-spacing: 2px;
  }

  /* ── STEUERLEISTE (unten fixiert) ────────────────────────────────────────── */
  .steuerung {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 14px 24px;
    background: rgba(4,20,60,0.95);
    backdrop-filter: blur(10px);
    border-top: 2px solid rgba(255,217,0,0.2);
    display: flex;
    flex-direction: column;
    gap: 10px;
    box-sizing: border-box;
  }

  .vergabe {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .vergabe-label {
    color: rgba(255,255,255,0.6);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 1px;
  }

  .navigation {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  /* ── BUTTONS ─────────────────────────────────────────────────────────────── */
  .btn {
    padding: 10px 22px;
    background: linear-gradient(135deg, #FFD900, #c9a800);
    border-radius: 999px;
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 0.95rem;
    color: #041D53;
    border: 2px solid rgba(255, 217, 0, 0.4);
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
}

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
  }

</style>
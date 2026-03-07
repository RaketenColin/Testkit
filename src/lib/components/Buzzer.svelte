<script>
  import { namen1, namen2 } from '$lib/stores.js';
  import { ledStore } from '$lib/stores/ledStore.js';

  let buzzerPlayer = '';
  let gedrueckt = [];
  let gesperrt = false;
  let aktiverIndex = null;
  export let zustand;
  let audioElement1;
  let audioElement2;

  const KEY_TO_INDEX = {
    F1: 0, F2: 1, F3: 2,  F4: 3,  F5: 4,  F6: 5,
    F7: 6, F8: 7, F9: 8, F10: 9, F11: 10, F12: 11,
  };

  function checkKey(event) {

    // ── Enter → Richtige Antwort ───────────────────────────
    // Punkte ans Spiel, alles zurücksetzen, LEDs weiß
    if (event.code === 'Enter' && buzzerPlayer) {
      window.dispatchEvent(new CustomEvent('buzzerEnter', {
        detail: { player: buzzerPlayer }
      }));
      buzzerPlayer = '';
      gedrueckt = [];
      gesperrt = false;
      aktiverIndex = null;
      ledStore.newQuestion();
      return;
    }

    // ── Escape → Falsche Antwort ───────────────────────────
    // Aktiver Buzzer wird gesperrt (rot), andere wieder weiß
    // buzzerPlayer bleibt → Alert bleibt sichtbar
    // gedrueckt bleibt → bereits gedrückte Keys bleiben blockiert
    if (event.code === 'Escape') {
      if (aktiverIndex !== null) {
        ledStore.lock(aktiverIndex);
      }
      gesperrt = false;
      aktiverIndex = null;
      ledStore.newQuestion();
      return;
    }

    // ── ArrowUp → Workaround ───────────────────────────────
    // Nur buzzerPlayer + gedrueckt leeren, LEDs unverändert
    if (event.code === 'ArrowUp') {
      buzzerPlayer = '';
      gedrueckt = [];
      gesperrt = false;
      return;
    }

    if (gesperrt) return;
    if (gedrueckt.includes(event.code)) return;
    if (zustand !== 1) return;

    const index = KEY_TO_INDEX[event.code];
    if (index === undefined) return;

    let player = null;
    if (index < 6) {
      player = $namen1[index];
      audioElement1.play();
    } else {
      player = $namen2[index - 6];
      audioElement2.play();
    }

    if (!player) return;

    buzzerPlayer = player;
    aktiverIndex = index;
    gesperrt = true;
    gedrueckt = [...gedrueckt, event.code];

    // Alle nicht-gesperrten → rot, dieser → grün
    ledStore.setAll('red', true);
    ledStore.setState(index, 'green');
  }

  function resetBuzzer() {
    buzzerPlayer = '';
    gedrueckt = [];
    gesperrt = false;
    aktiverIndex = null;
    ledStore.newQuestion();
  }

  // zustand 0 → vor Spielstart: alles aus
  $: if (zustand === 0) {
    ledStore.reset();
  }
  // zustand 1 → Frage läuft: nicht-gesperrte weiß, gesperrte rot
  $: if (zustand === 1) {
    ledStore.newQuestion();
  }
  // zustand 2 → Antwort gezeigt: alle Sperren weg, alle weiß
  $: if (zustand === 2) {
    ledStore.unlockAll();
  }
</script>

<svelte:window on:keydown={checkKey} on:buzzerReset={resetBuzzer} />

{#if buzzerPlayer && zustand === 1}
  <div class="buzzer-alert">
    {buzzerPlayer}
  </div>
{/if}

<audio bind:this={audioElement1} src="/General/Buzzer1.mp3" controls></audio>
<audio bind:this={audioElement2} src="/General/Buzzer2.mp3" controls></audio>

<style>
  .buzzer-alert {
    position: fixed;
    top: 80px;
    right: 20px;
    background: linear-gradient(45deg, #ff4444, #ff6666);
    color: white;
    padding: 25px 40px;
    font-size: 32px;
    font-weight: bold;
    border-radius: 20px;
    box-shadow: 0 10px 30px rgba(255, 68, 68, 0.5);
    z-index: 20 !important;
    animation: buzz 0.6s ease-in-out;
  }

  @keyframes buzz {
    0%, 100% { transform: scale(1) rotate(0deg); }
    25%       { transform: scale(1.1) rotate(2deg); }
    75%       { transform: scale(1.1) rotate(-2deg); }
  }

  audio {
    display: none;
  }
</style>
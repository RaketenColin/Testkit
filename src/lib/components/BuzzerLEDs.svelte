<script>
  import { ledStore } from '$lib/stores/ledStore.js';
  import { namen1, namen2 } from '$lib/stores.js';

  // Alle 12 Spielernamen in einer Liste: Index 0–5 = Team 1, 6–11 = Team 2
  $: allNames = [...$namen1, ...$namen2];
</script>

<div class="led-panel">
  <div class="led-gruppe">
    <span class="gruppe-label">Team 1</span>
    <div class="led-reihe">
      {#each $ledStore.slice(0, 6) as buzzer}
        <div class="led-cell">
          <div class="led led--{buzzer.state}">
            <div class="led__glare"></div>
          </div>
          <span class="led__name">{allNames[buzzer.id] ?? `P${buzzer.id + 1}`}</span>
        </div>
      {/each}
    </div>
  </div>

  <div class="led-gruppe">
    <span class="gruppe-label">Team 2</span>
    <div class="led-reihe">
      {#each $ledStore.slice(6, 12) as buzzer}
        <div class="led-cell">
          <div class="led led--{buzzer.state}">
            <div class="led__glare"></div>
          </div>
          <span class="led__name">{allNames[buzzer.id] ?? `P${buzzer.id + 1}`}</span>
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .led-panel {
    display: flex;
    gap: 24px;
    justify-content: center;
    align-items: flex-start;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.35);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.06);
  }

  .led-gruppe {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  .gruppe-label {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 0.85rem;
    letter-spacing: 2px;
    color: rgba(255, 255, 255, 0.3);
  }

  .led-reihe {
    display: flex;
    gap: 10px;
  }

  .led-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  /* ── LED-Kreis ─────────────────────────────────────────── */
  .led {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }

  /* Glanzpunkt */
  .led__glare {
    position: absolute;
    top: 18%;
    left: 22%;
    width: 28%;
    height: 22%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.45);
    pointer-events: none;
  }

  /* ── Zustände ──────────────────────────────────────────── */
  .led--off {
    background: radial-gradient(circle at 35% 30%, #2a2a2a, #111);
    box-shadow: none;
  }

  .led--white {
    background: radial-gradient(circle at 35% 30%, #ffffff, #cccccc);
    box-shadow: 0 0 10px 3px rgba(255, 255, 255, 0.45);
  }

  .led--green {
    background: radial-gradient(circle at 35% 30%, #6fff6f, #2a9a2a);
    box-shadow: 0 0 14px 5px rgba(80, 220, 80, 0.65);
    animation: pulse-green 0.8s ease-in-out infinite alternate;
  }

  .led--red {
    background: radial-gradient(circle at 35% 30%, #ff6f6f, #aa2222);
    box-shadow: 0 0 10px 3px rgba(220, 60, 60, 0.5);
  }

  /* ── Spielername ───────────────────────────────────────── */
  .led__name {
    font-family: 'Nunito', sans-serif;
    font-size: 0.6rem;
    font-weight: 700;
    color: rgba(255, 255, 255, 0.45);
    text-align: center;
    max-width: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @keyframes pulse-green {
    from { box-shadow: 0 0 10px 3px rgba(80, 220, 80, 0.4); }
    to   { box-shadow: 0 0 22px 8px rgba(80, 220, 80, 0.75); }
  }
</style>

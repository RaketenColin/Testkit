// src/lib/stores/ledStore.js

import { writable, derived } from 'svelte/store';

function createLEDStore() {
  const initial = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    state: 'off',    // 'off' | 'white' | 'green' | 'red'
    locked: false,
  }));

  const { subscribe, update } = writable(initial);

  return {
    subscribe,

    // Einen einzelnen Buzzer auf einen Zustand setzen
    setState(id, state) {
      update(buzzers =>
        buzzers.map(b => b.id === id ? { ...b, state } : b)
      );
    },

    // Alle Buzzer auf denselben Zustand setzen
    // skipLocked=true → gesperrte Buzzer werden nicht verändert
    setAll(state, skipLocked = false) {
      update(buzzers =>
        buzzers.map(b => {
          if (skipLocked && b.locked) return b;
          return { ...b, state };
        })
      );
    },

    // Einen Buzzer dauerhaft sperren (bleibt rot bis Reset)
    lock(id) {
      update(buzzers =>
        buzzers.map(b => b.id === id ? { ...b, state: 'red', locked: true } : b)
      );
    },

    // Neue Frage: gesperrte bleiben rot, alle anderen → weiß
    newQuestion() {
      update(buzzers =>
        buzzers.map(b => b.locked
          ? { ...b, state: 'red' }
          : { ...b, state: 'white' }
        )
      );
    },

    // Antwort gezeigt (zustand 2): alle Sperren aufheben, alle → weiß
    unlockAll() {
      update(buzzers =>
        buzzers.map(b => ({ ...b, locked: false, state: 'white' }))
      );
    },

    // Kompletter Reset: alles aus, alle Sperren weg (vor Spielstart)
    reset() {
      update(buzzers =>
        buzzers.map(b => ({ ...b, state: 'off', locked: false }))
      );
    },
  };
}

export const ledStore = createLEDStore();

// Abgeleiteter Store: wie viele Buzzer sind noch nicht gesperrt?
export const activeBuzzerCount = derived(ledStore, $leds =>
  $leds.filter(b => !b.locked).length
);
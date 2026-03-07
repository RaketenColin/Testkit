import { writable } from 'svelte/store';

export const gesamtPunkteTeam1 = writable(0);
export const gesamtPunkteTeam2 = writable(0);
export const spielPunkteTeam1 = writable(0);
export const spielPunkteTeam2 = writable(0);
export const namen1 = writable(new Array(6).fill(''));
export const namen2 = writable(new Array(6).fill(''));
export const errateneSongsTeam1 = writable([]);
export const errateneSongsTeam2 = writable([]);
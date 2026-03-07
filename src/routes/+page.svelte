<script>
	import { goto } from '$app/navigation';
  import {namen1, namen2, gesamtPunkteTeam1, gesamtPunkteTeam2, spielPunkteTeam1, spielPunkteTeam2 } from '$lib/stores.js';
  import { page } from '$app/stores';
  const maxPunkte = 1500;

</script>
<div class="full-screen-bg">
    <div class ="zentrierung">
        <div class="spieluebersicht">
	        <button on:click={() => goto('/spiel1_blindenschrift')}>
	    	    Spiel 1
	        </button>
            <button on:click={() => goto('/spiel2_buchcover')}>
	        	Spiel 2
    	    </button>
            <button class="orange" on:click={() => goto('/spiel3_tiere_schmecken')}>
    	    	Spiel 3
    	    </button>
            <button on:click={() => goto('/spiel4_schaetzen')}>
    	    	Spiel 4
    	    </button>
            <button on:click={() => goto('/spiel5_unscharf')}>
    		    Spiel 5
    	    </button>
            <button class="orange" on:click={() => goto('/spiel6_die_karte')}>
    		    Spiel 6
            </button>
            <button on:click={() => goto('/spiel7_namen')}>
	    	    Spiel 7
	        </button>
            <button on:click={() => goto('/spiel8_songquiz')}>
	    	    Spiel 8
	        </button>
            <button class="orange" on:click={() => goto('/spiel9_karaoke')}>
	    	    Spiel 9
	        </button>
            <button on:click={() => goto('/spiel10_stimmts')}>
	    	    Spiel 10
	        </button>
            <button on:click={() => goto('/spiel11_fernsehmelodien')}>
	    	    Spiel 11
	        </button>
            <button class="orange" on:click={() => goto('/spiel12_kartenduell')}>
	    	    Spiel 12
	        </button>
            <button on:click={() => goto('/spiel13_stimmen_erkennen')}>
	    	    Spiel 13
	        </button>
            <button on:click={() => goto('/spiel14_wer_weiss_mehr')}>
	    	    Spiel 14
	        </button>
            <button on:click={() => goto('/spiel15_spiele')}>
	    	    Spiel 15
	        </button>
        </div>
    </div>
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
    font-family: 'Nunito', sans-serif;
}
  .zentrierung {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
  }
  
  .spieluebersicht {
    width: 300px;
    text-align: center;
}
  
  button {
    display: block;
    width: 150px;
    height: 40px;
    margin: 1rem auto;
    background: linear-gradient(135deg, #FFD900, #c9a800);
    border: 2px solid rgba(255,217,0,0.4);
    border-radius: 999px;
    font-family: 'Nunito', sans-serif;
    font-size: 1.1rem;
    font-weight: 800;
    color: #041D53;
    cursor: pointer;
    transition: transform 0.15s, box-shadow 0.15s;
}

button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.4);
}

button.orange {
    background: linear-gradient(135deg, #FF9500, #cc7000);
    border-color: rgba(255,149,0,0.4);
}

table:nth-of-type(1) {
    position: absolute;
    top: 100px;
    left: 30px;
    border-collapse: collapse;
    width: 300px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    overflow: hidden;
}

table:nth-of-type(2) {
    position: absolute;
    top: 500px;
    left: 30px;
    border-collapse: collapse;
    width: 300px;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 12px;
    overflow: hidden;
}

th {
    background: linear-gradient(135deg, #FFD900, #c9a800);
    border: none;
    padding: 8px 10px;
    color: #041D53;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.1rem;
    letter-spacing: 2px;
}

td {
    border: 1px solid rgba(255,217,0,0.2);
    padding: 6px 10px;
    color: white;
    background: rgba(255,255,255,0.05);
}

tr:nth-child(even) td {
    background: rgba(255,255,255,0.1);
}

input {
    background-color: transparent;
    border: none;
    padding: 5px;
    width: 100%;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
}

.progress-container {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  text-align: center;
}

.progress-container2 {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 50px;
  background-color: rgba(255,255,255,0.1);
  border: 2px solid rgba(255,217,0,0.3);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 10px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF3B30, #cc1a10);
    transition: width 0.5s ease;
    border-radius: 999px;
}

.punkte-text {
  color: rgba(255,255,255,0.7);
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 2px;
}

</style>


<table>
  <tbody>
    <tr>
        <th>#</th>
        <th>Team 1</th>
        </tr>
        {#each $namen1 as name, i}
            <tr>
            <td>{i + 1}</td>
            <td><input bind:value={$namen1[i]} /></td>
        </tr>
        {/each}
  </tbody>
</table>

<div class="progress-container">
  <div class="progress-bar">
    <div class="progress-fill" style="width: {($gesamtPunkteTeam1 / maxPunkte) * 100}%"></div>
  </div>
  <p class="punkte-text">Team 1: {$gesamtPunkteTeam1} Punkte</p>
</div>

<div class="progress-container2">
  <div class="progress-bar">
    <div class="progress-fill" style="width: {($gesamtPunkteTeam2 / maxPunkte) * 100}%"></div>
  </div>
  <p class="punkte-text">Team 2: {$gesamtPunkteTeam2} Punkte</p>
</div>

<table>
  <tbody>
    <tr>
        <th>#</th>
        <th>Team 2</th>
        </tr>
        {#each $namen2 as name, i}
            <tr>
            <td>{i + 7}</td>
            <td><input bind:value={$namen2[i]} /></td>
        </tr>
        {/each}
  </tbody>
</table>
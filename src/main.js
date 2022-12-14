/* eslint-disable */
import { createApp } from 'vue'
import { Piano } from '@tonejs/piano'
import App from './App.vue'

import Select2 from 'vue3-select2-component'

const app = createApp(App);

    
app.component('Select2', Select2);
app.provide('whoIsPlaying', {id:0});

const piano = new Piano({
velocities: 5,
volume: {
	pedal: -12,
	strings: -12,
	keybed: -12,
	harmonics: -12,
}
})
piano.toDestination()
piano.load().then(() => {
    app.provide('piano', piano);
    console.log('piano loaded');

    app.mount('#app');

})


const zip = (a, b) => a.map((k, i) => [k, b[i]]);

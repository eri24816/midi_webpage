/* eslint-disable */
import { createApp } from 'vue'
import { Piano } from '@tonejs/piano'
import App from './App.vue'

const app = createApp(App);

    
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

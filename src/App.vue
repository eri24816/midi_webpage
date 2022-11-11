<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Arimo&family=Varela+Round&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Literata&display=swap" rel="stylesheet">

  </head>
  <PixiMidiBlock src="/midi/12similar/query.mid"/>
  <!-- <PixiMidiBlock src="/midi/12similar/query.mid"/> -->
</template>

<script>
/* eslint-disable */
import MidiBlock from './components/MidiBlock.vue'
import PixiMidiBlock from './components/PixiMidiBlock.vue';

export default {
  name: 'App',
  components: {
    MidiBlock,
    PixiMidiBlock
  },
  setup() {
    var scripts = [
      "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js",
      "https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.21.0/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.1.0",
      "https://pixijs.download/release/pixi.js"
    ];
    scripts.forEach(script => {
      let tag = document.createElement("script");
      tag.setAttribute("src", script);
      document.head.appendChild(tag);
    });
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #a2bfdd;
  margin-top: 60px;
}
body{
  
  background-color: #101010;
}
</style>

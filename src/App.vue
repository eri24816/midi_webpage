<template>
  <head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Arimo&family=Varela+Round&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Literata&display=swap" rel="stylesheet">

  </head>
  <SideBar>
    <RangeInput label="Sustain Opacity" :value=sustainOpacity @input="value => sustainOpacity = value" min=0 max=1 step=0.01 /> 
    <RangeInput label="Tempo" :value=tempo @input="value => tempo = value" min=40 max=144 step=1 /> 
  </SideBar>
  <MidiBlockWithFile :w="700"  :sustain-opacity="sustainOpacity" :bpm="tempo" />
  <MidiBlockWithFile :w="700"  :sustain-opacity="sustainOpacity" :bpm="tempo" />

</template>

<script>
/* eslint-disable */
import PixiMidiBlock from './components/PixiMidiBlock.vue';
import SideBar from './components/SideBar.vue';
import RangeInput from './components/RangeInput.vue';
import MidiBlockWithFile from './components/MidiBlockWithFile.vue';

export default {
  name: 'App',
  components: {
    PixiMidiBlock,
    SideBar,
    RangeInput,
    MidiBlockWithFile
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
  },
  data() {
    return {
      sustainOpacity: 0.4,
      tempo: 100,
      src1: '/midi/12similar/query.mid',
      src2: '/midi/29similar/query.mid'
    }
  },
  methods: {
    print(value) {
      console.log(value);
    }
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
  
  background-color: #000000;
}
</style>

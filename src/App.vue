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
    <RangeInput label="Width" :value=width @input="value => width = value" min=500 max=2100 step=1 /> 
    <RangeInput label="Height" :value=height @input="value => height = value" min=100 max=1000 step=1 />
  </SideBar>

  <Suspense>
    <ComparatorComponent folder="experiments/First8" num_elements=2 title="8 Bar Prompt" />
  </Suspense>

  <h2>Plagiarism Check</h2>
  <MidiBlockWithFile :w="690" :h="height" :sustain-opacity="sustainOpacity" :bpm="tempo" />
  <MidiBlockWithFile :w="690" :h="height" :sustain-opacity="sustainOpacity" :bpm="tempo" />
  <div>
    <h3>
      說明:
    </h3>
    <p>
      總共有 32 首 generated midi, 每首 midi 都分成 4 個 4-bar 的 query 去跟 dataset 的所有歌比較，取出最相似的 10 個 4-bar 片段。
    </p>
    <h4>
      檔案命名規則:
    </h4>
    <ul>
      <li>
        4 小節的 query 片段: [ i ] / [ start_bar ] _query.mid
      </li>
      <li>
        4 小節的 dataset 片段: [ i ] / [ start_bar ] _ [ rank ] .mid
      </li>
    </ul>
    Where i ∈ [0, 32] is the generation index, start_bar ∈ {0,4,8,12} is the start bar of the query, and rank ∈ [0, 9] is the similarity rank.
  </div>

</template>

<script>
/* eslint-disable */
import PixiMidiBlock from './components/PixiMidiBlock.vue';
import SideBar from './components/SideBar.vue';
import RangeInput from './components/RangeInput.vue';
import MidiBlockWithFile from './components/MidiBlockWithFile.vue';
import ComparatorComponent from './components/ComparatorComponent.vue';

export default {
  name: 'App',
  components: {
    PixiMidiBlock,
    SideBar,
    RangeInput,
    MidiBlockWithFile,
    ComparatorComponent
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
      width: 1200,
      height: 250,
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
  width: 1100px;
  margin: auto;
  margin-top: 60px;
}
body{
  
  background-color: #21262C;
  font-size: 75%;
}
</style>

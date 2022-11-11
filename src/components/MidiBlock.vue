<template>
  {{src}}
  <!-- input: models, song_idx -->
  <section id="inpainted-music-song-1">
      <h3>Song 1</h3>
      <midi-visualizer id='inpainted-music-song-1-visualizer'
        :src="src">
    
      </midi-visualizer>
      <midi-player id='inpainted-music-song-1-player'
        :src="src" 
        sound-font="https://storage.googleapis.com/magentadata/js/soundfonts/salamander"
        visualizer="#inpainted-music-song-1-visualizer"
        style="color:wheat">
      </midi-player>
    </section>
</template>

<script>
export default {
  name: 'MidiBlock',
  props: ["src"],
  options: {
    compilerOptions: {
      isCustomElement: (tag) => ['midi-visualizer',',midi-player'].includes(tag),
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
midi-player {
  display: block;
  width: inherit;
  margin: 0 4px 1.5rem 4px;
  margin-top: 0;
}

midi-player::part(control-panel) {
  background: linear-gradient(#121212, #000000);
  border-top: none;
  border-radius: 0 0 10px 10px;
}

midi-visualizer .piano-roll-visualizer {
  background: #121212;
  border: 1px solid #e9e9e9;
  border-bottom: none;
  /* border-radius: 10px 10px 0 0 ; */
  margin: 0 4px;
  margin-bottom: 0;
  overflow: auto;
}
midi-visualizer svg rect.note {
  opacity: 0.6;
}
midi-visualizer svg rect.note[data-instrument="0"]{
  fill: #e22;
}
midi-visualizer svg rect.note[data-instrument="1"]{
  fill: #904e95;
}

midi-visualizer svg rect.note.active {
  opacity: 1.0;
  stroke: slategrey;
}

.anchor-container {
  margin-top: 1.5rem;
  margin-left: 4px;
  display: flex;
}

</style>
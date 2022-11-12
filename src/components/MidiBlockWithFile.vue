<template>

</template>

<script>
/* eslint-disable */
import PixiMidiBlock from './PixiMidiBlock.vue';
import FileSelector from './FileSelector.vue';

export default {
  name: 'MidiBlockWithFile',
  components: {
    PixiMidiBlock,
    FileSelector
  },
    props: {
        w: {
            type: Number,
            default: 700
        },
        h: {
            type: Number,
            default: 250
        },
        padding: {
            type: Number,
            default: 30
        },
        sustainOpacity: {
            type: Number,
            default: 0.4
        },
        bpm: {
            type: Number,
            default: 100
        },

    },
  data: function() {
    return {
      sustainOpacity: 0.4,
      tempo: 100,
      filename: '/midi/12similar/query.mid'
    }
  },
  emits:['input'],
  setup(props, { emit }) {
    const updateValue = (value) => {
      console.log("updateValue",value);
      emit('input', value);
    }

    return { updateValue }
  },
}
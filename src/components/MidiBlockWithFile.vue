<template>
    <div style="">
        <div style="display:inline-block; ">
            <PixiMidiBlock :src="src" :w="w" :h="h" :padding="padding" :sustain-opacity="sustainOpacity" :bpm="bpm" />
        </div>
        <div style="display:inline-block; width: 300px;   text-align: left;">
            
            <div style="margin:30px">
                <p>
                    <b>{{ metadata.title }}</b>
                </p>
                <p>
                    Bar: {{ metadata.start }} - {{ metadata.end }}
                </p>
                <p>
                    Similarity: {{ metadata.score }}
                </p>
            </div>
            
            <FileSelector root='/midi/similar/' @input="UpdateSrc" />
            <br/>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import PixiMidiBlock from './PixiMidiBlock.vue';
import FileSelector from './FileSelector.vue';

function UpdateSrc(value) {
    this.src = value.name;
    this.metadata = value.metadata;
}

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
        src: '/midi/12similar/query.mid',
        metadata: '',
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
    methods: { UpdateSrc },
}
</script>
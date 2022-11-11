<template>
    <div ref="root">
        <h1>
            Pixi Midi Block
        </h1>
    </div>
</template>


<script>
/* eslint-disable */
import * as PIXI from '@/assets/pixi.mjs'
const { Midi } = require('@tonejs/midi')
import { Piano } from '@tonejs/piano'
function InitPixi() {
    const root = this.$refs.root;

    const app = new PIXI.Application({ background: '#000000', width: this.w, height: this.h });
    root.appendChild(app.view);
    app.stage.interactive = true;
    app.stage.hitArea = app.screen;

    const cursorPreviewLine = new PIXI.Graphics()
        .lineStyle(2, 0x00ff00, 1)
        .lineTo(0, app.screen.height);
    cursorPreviewLine.x = -100;
    cursorPreviewLine.alpha=0.2;

    app.stage.addChild(cursorPreviewLine);

    const cursorLine = new PIXI.Graphics()
        .lineStyle(2, 0x00ff00, 1)
        .lineTo(0, app.screen.height); 

    app.stage.addChild(cursorLine);
    this.cursorLine = cursorLine;

    // Listen for animate update
    app.ticker.add((delta) => {

    });

    app.stage.addEventListener('pointermove', (e) => {
        cursorPreviewLine.x = e.data.global.x;
    });
    app.stage.addEventListener('pointerleave', (e) => {
        // disable the line
        cursorPreviewLine.x = -100;
    });
    app.stage.addEventListener('pointerdown', (e) => {
        this.tick = (e.data.global.x + this.shift) / this.PixelPerTick;
        this.StopSounds();
        this.lastTick = this.tick;
    });
    this.pixi = app;

}
function LoadMidi() {
    Midi.fromUrl(this.src).then((midi) => {
        // store the notes into a map
        const noteList = midi.tracks[0].notes;
        const keyDownMap = new Map();
        for (let i = 0; i < noteList.length; i++) {
            const note = noteList[i];
            const tick = note.ticks / 60;
            if (!keyDownMap.has(tick)) {
                keyDownMap.set(tick, []);
            }
            keyDownMap.get(tick).push(note);
        }
        this.keyDownMap = keyDownMap;

        const keyUpMap = new Map();
        for (let i = 0; i < noteList.length; i++) {
            const note = noteList[i];
            const tick = (note.ticks + note.durationTicks) / 60;
            if (!keyUpMap.has(tick)) {
                keyUpMap.set(tick, []);
            }
            keyUpMap.get(tick).push(note);
        }
        this.keyUpMap = keyUpMap;

        var maxTick = 0;
        for (let i = 0; i < noteList.length; i++) {
            const note = noteList[i];
            const tick = (note.ticks + note.durationTicks) / 60;
            if (tick > maxTick) {
                maxTick = tick;
            }
        }

        this.PixelPerTick = (this.w - 2*this.padding) / maxTick;
        this.shift = - this.padding;
        // draw the notes with pixi
        const rectList = [];
        const app = this.pixi;
        noteList.forEach((note) => {
            const rect = new PIXI.Graphics()
            app.stage.addChild(rect);
            rectList.push(rect);
        });
        this.noteList = noteList;
        this.rectList = rectList;
    });
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
        //piano.keyDown({note:"C7"});
        //piano.keyDown({ note: "G6" });
        this.piano = piano;
    })
}
function Midi2Pitch(midiNum) {
    const midiToPitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    var pitch = midiToPitch[(midiNum - 12) % 12];
    pitch += Math.floor((midiNum - 12) / 12);
    return pitch;
}
function Update() {
    const time = new Date().getTime();
    const delta = this.lastUpdateTime?  time - this.lastUpdateTime:0;
    this.lastUpdateTime = time;

    if (this.keyDownMap == null) return;
    if (this.piano == null) return;
    this.tick += delta / 1000.0 / 60.0 * this.bpm * this.tpb;
    let intTick = Math.floor(this.tick);


    for (let t = this.lastTick + 1; t <= intTick; t++) {
        if (this.keyUpMap.has(t)) {
            this.keyUpMap.get(t).forEach((note) => {
                const pitch = Midi2Pitch(note.midi);

                this.piano.keyUp({ note: pitch});

            });
        }

        if (this.keyDownMap.has(t)) {
            this.keyDownMap.get(t).forEach((note) => {
                const midiToPitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                var pitch = midiToPitch[(note.midi - 12) % 12];
                pitch += Math.floor((note.midi - 12) / 12);

                this.piano.keyDown({ note: pitch, velocity: note.velocity});

            });
        }

    }
    this.lastTick = intTick;

    this.cursorLine.x = this.PixelPerTick * this.tick - this.shift;

    const gap = 1;
    const zip = (a, b) => a.map((k, i) => [k, b[i]]);
    zip(this.noteList, this.rectList).forEach((note_rect) => {
        const note = note_rect[0];
        const rect = note_rect[1];
        const x = (note.ticks / 60) * this.PixelPerTick - this.shift;
        const y = (1-(note.midi - 21) / 88 )* (this.h);
        const w = (note.durationTicks / 60) * this.PixelPerTick - gap;
        const h = (this.h)/88 - gap;
        rect.clear();
        rect.beginFill(0xffffff)
        rect.drawRect(x, y, w, h)
        rect.endFill();
    });
}
function StopSounds() {
    if (this.piano == null) return;
    for(let i=21;i<=108;i++){ 
        this.piano.keyUp({ note: Midi2Pitch(i) });
    }
}
export default {
    name: 'PixiMidiBlock',
    props: {
        w: {
            type: Number,
            default: 700
        },
        h: {
            type: Number,
            default: 350
        },
        padding: {
            type: Number,
            default: 30
        },
        src: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            shift: -10,
            duration: 0,
            PixelPerTick: 10,
            tick: 0,
            lastTick: -1,
            bpm: 120,
            tpb: 8,
            keyDownMap: null,
            keyUpMap: null,
            timer: null
        }
    },
    mounted() {
        InitPixi.call(this);
        LoadMidi.call(this);
        this.timer = setInterval(() => {
            this.Update()
        }, 20);
    },
    methods: {  InitPixi, LoadMidi, Update, StopSounds },
    beforeDestroy() {
        this.$refs.root.removeChild(this.app.view);
        clearInterval(this.timer);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
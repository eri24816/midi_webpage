<template>
    <div ref="root" style="border: 2px gray; border-style: solid; border-radius: 3px;">
        <!-- {{src}} -->
    </div>
</template>


<script>
/* eslint-disable */
import * as PIXI from '@/assets/pixi.mjs'
const { Midi } = require('@tonejs/midi')
import { inject } from 'vue'
import { Midi2Pitch } from '@/assets/musicUtils.js'
import { HSVtoRGB } from '@/assets/graphicsUtils.js'

function InitPixi() {
    const root = this.$refs.root;

    const app = new PIXI.Application({ background: '#0A0B0D', width: this.w, height: this.h });
    root.appendChild(app.view);
    app.stage.interactive = true;
    app.stage.hitArea = app.screen;

    const cursorPreviewLine = new PIXI.Graphics()
        .lineStyle(2, 0xffffff, .2)
        .lineTo(0, app.screen.height); 
    cursorPreviewLine.x = -100;

    app.stage.addChild(cursorPreviewLine);
    this.cursorPreviewLine = cursorPreviewLine;

    const cursorLine = new PIXI.Graphics()
        .lineStyle(2, 0xffffff, .5)
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

    });

    this.mouseData = { lastx: 0, lasty: 0, tick: 0, dragged: false };
    app.stage.on('mousedown', (e) => {
        this.mouseData.dragged = false;
    })
        // events for drag end
        .on('mouseup', (e) => {
            if (!this.mouseData.dragged) {
                this.OnMouseClick(e);
            }
        })
        .on('mouseupoutside', (e) => {
            if (!this.mouseData.dragged) {
                this.OnMouseClick(e);
            } else {
                this.OnDragEnd(e);
            }
        })
        // events for drag move
        .on('mousemove', (e) => {
            if (e.buttons) {
                if(!this.mouseData.dragged) {
                    this.mouseData.dragged = true;
                    this.OnDragStart(e);
                }
                this.OnDragMove(e);
            }
            this.mouseData.lastx = e.data.global.x;
            this.mouseData.lasty = e.data.global.y;
        });
    
    this.pixi = app;
}

function OnDragStart(event) {
    this.mouseData.tick = (event.data.global.x + this.shift) / this.PixelPerTick;
}

function OnDragEnd(event) {
}

function OnDragMove(event) {
    console.log(this.mouseData.tick);
    this.PixelPerTick *= Math.exp(-0.003 * (event.data.global.y - this.mouseData.lasty));
    
    if (this.mouseData.tick) {
        this.shift = this.mouseData.tick*this.PixelPerTick - event.data.global.x;
    }
    this.UpdateCanvas();
}

function OnMouseClick(e) {
    this.tick = (e.data.global.x + this.shift) / this.PixelPerTick;
    this.StopSounds();
    this.lastTick = Math.floor(this.tick - 1);
    this.lastUpdateTime = null;
    this.whoIsPlaying.id = this.playerId;
}

function LoadMidi() {

    console.log("Loading midi");
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

        this.PixelPerTick = (this.w - 2*this.padding) / Math.min(32*8,maxTick);
        this.shift = - this.padding;
        
        const app = this.pixi;

        // destroy all notes and beatlines of previous midi
        if(this.noteList)
            for (let i = 0; i < this.noteList.length; i++) {
                app.stage.removeChild(this.noteList[i].graphics);
            }
        if(this.beatLines)
            for (let i = 0; i < this.beatLines.length; i++) {
                app.stage.removeChild(this.beatLines[i]);
            }

        // generate bar lines and beat lines
        const beatLines = [];

        for (let i = 0; i <= maxTick; i += 8) {
            const alpha=[0.1,0.01,0.01,0.01,0.1,0.01,0.01,0.01]
            const line = new PIXI.Graphics()
                .lineStyle(2, 0xffffff, alpha[(i/8)%8])
                .lineTo(0, app.screen.height); 
            app.stage.addChild(line);
            beatLines.push(line);
        }
        this.beatLines = beatLines;
        
        // draw each notes with pixi
        noteList.forEach((note) => {
            const rect = new PIXI.Graphics()
            note.graphics = rect;
            app.stage.addChild(rect);
        });
        this.noteList = noteList;

        this.maxTick = maxTick;
        
        this.UpdateCanvas();
    });
}

 
function Update() {
    if (this.whoIsPlaying.id != this.playerId) {
        return;
    }
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
                const pitch = Midi2Pitch(note.midi);
                this.piano.keyDown({ note: pitch, velocity: note.velocity});
            });
        }

    }
    this.lastTick = intTick;

    this.UpdateCanvas();

}
function UpdateCanvas() {
    
    this.cursorLine.x = this.PixelPerTick * this.tick - this.shift;

    const gap = 1;
    this.noteList.forEach((note) => {
        const x = (note.ticks / 60) * this.PixelPerTick - this.shift;
        const y = (1-(note.midi - 21) / 88 )* (this.h);
        const w = (note.durationTicks / 60) * this.PixelPerTick - gap;
        const h = (this.h) / 88 - gap;
        const brightnessGain = 1+ ((note.ticks / 60) <= this.tick?  Math.exp(0.3*((note.ticks / 60)-this.tick)):0);
        note.graphics.clear();
        note.graphics.beginFill(HSVtoRGB(note.midi / 12, 1 - (brightnessGain - 1) * 0.3, Math.min(1, this.sustainOpacity * brightnessGain)));
        note.graphics.drawRect(x, y, w, h);
        note.graphics.endFill();
        note.graphics.beginFill(HSVtoRGB(note.midi / 12, 1 - (brightnessGain - 1) * 0.3, Math.min(1, brightnessGain)));
        note.graphics.drawRect(x - (h + 2) / 2, y - 1, h + 2, h + 2);
        note.graphics.endFill();
    });
    // update beat lines
    for(let i=0;i<this.beatLines.length;i++){
        const line = this.beatLines[i];
        line.x = (i * 8) * this.PixelPerTick - this.shift;
    }
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
            default: 250
        },
        padding: {
            type: Number,
            default: 30
        },
        src: {
            type: String,
            default: ''
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
    data() {
        return {
            shift: -10,
            duration: 0,
            PixelPerTick: 10,
            tick: 1000000,
            lastTick: 1000000,
            tpb: 8,
            keyDownMap: null,
            keyUpMap: null,
            timer: null,
            mouseData: null,
        }
    },
    watch: {
        src: function (newVal, oldVal) { 
            this.LoadMidi();
        },
        sustainOpacity: function(newVal, oldVal) {
            this.UpdateCanvas();
        },
        w: function(newVal, oldVal) {
            this.pixi.renderer.resize(newVal, this.h);
            //this.PixelPerTick = (newVal - 2*this.padding) / this.maxTick;
            //this.shift = - this.padding;
            //this.UpdateCanvas();
        },
        h: function(newVal, oldVal) {
            this.pixi.renderer.resize(this.w, newVal);
            for (let i = 0; i <= this.maxTick; i += 8) {
            const alpha=[0.1,0.01,0.01,0.01,0.1,0.01,0.01,0.01]
                const line = this.beatLines[i/8].clear()
                    .lineStyle(2, 0xffffff, alpha[(i/8)%8])
                    .lineTo(0, newVal); 
            }
            this.cursorPreviewLine.clear().lineStyle(2, 0xffffff, .2).lineTo(0, newVal);
            this.cursorLine.clear().lineStyle(2, 0xffffff, .5).lineTo(0, newVal);
            this.UpdateCanvas();
        },
    },
    setup() {
        const piano = inject('piano');
        const whoIsPlaying = inject('whoIsPlaying');
        return {
            piano, whoIsPlaying, playerId: Math.random()
        }
    },
    mounted() {
        InitPixi.call(this);
        LoadMidi.call(this);
        this.timer = setInterval(() => {
            this.Update()
        }, 20);
    },
    methods: {  InitPixi, LoadMidi, Update, UpdateCanvas,StopSounds,OnDragStart,OnDragMove,OnDragEnd, OnMouseClick },
    beforeDestroy() {
        console.log('destroy');
        this.$refs.root.removeChild(this.app.view);
        clearInterval(this.timer);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
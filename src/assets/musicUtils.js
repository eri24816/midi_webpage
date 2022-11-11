function Midi2Pitch(midiNum) {
    const midiToPitch = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    var pitch = midiToPitch[(midiNum - 12) % 12];
    pitch += Math.floor((midiNum - 12) / 12);
    return pitch;
}

export {
    Midi2Pitch
}
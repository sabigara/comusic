import { Track } from '../interface';

export default class implements Track {
  ac: AudioContext;
  gain: GainNode;
  pan: StereoPannerNode;
  analyzer: AnalyserNode;
  array:Uint8Array | null = null;
  id: string;
  name: string;
  buffer: AudioBuffer;
  source: AudioBufferSourceNode | null  = null;

  constructor(id: string, name: string, ac: AudioContext, audioBuffer: AudioBuffer) {
    this.id = id;
    this.name = name;

    this.ac = ac;
    this.buffer = audioBuffer;
    this.gain = ac.createGain();
    this.pan = ac.createStereoPanner();
    this.analyzer = ac.createAnalyser();
    this.array = new Uint8Array(this.analyzer.frequencyBinCount); 
  }

  play() {
    this.source = this.ac.createBufferSource()
    this.source.buffer = this.buffer;
    this.source.connect(this.gain).connect(this.pan).connect(this.analyzer).connect(this.ac.destination);
    this.source.start(this.ac.currentTime);
  }

  stop() {
    this.source?.stop();
  }

  setVolume(value: number) {
    this.gain.gain.value = value;
  }

  setPan(value: number) {
    this.pan.pan.value = value;
  }

  getPeak() {
    this.analyzer.getByteFrequencyData(this.array!);
    return Math.max.apply(null, Array.from(this.array!));
  }
}
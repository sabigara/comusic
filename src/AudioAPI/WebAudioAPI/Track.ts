import extractPeaks from '../../common/extractPeaks';

import { ITrack } from '../interface';
import LoaderFactory from './loader/LoaderFactory';

export class Track implements ITrack {
  public id: string;
  public name: string;
  public duration: number;
  public isPlaying: boolean;
  private ac: AudioContext;
  private isMuted: boolean;
  private masterGain: GainNode;
  private masterAnalyzer: AnalyserNode;
  private gain: GainNode
  private gainValue: number;
  private pan: StereoPannerNode
  private panValue: number;
  private analyzer: AnalyserNode
  private tmpArray: Uint8Array | null = null;
  private buffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  
  constructor(
    id: string,
    name: string,
    ac: AudioContext,
    masterGain: GainNode,
    masterAnalyzer: AnalyserNode
  ) {
    this.id = id;
    this.name = name;
    this.duration = 0;
    this.isPlaying = false;
    this.ac = ac;
    this.gain = this.ac.createGain();
    this.pan = this.ac.createStereoPanner();
    this.analyzer = this.ac.createAnalyser();
    this.isMuted = false;
    this.masterGain = masterGain;
    this.masterAnalyzer = masterAnalyzer;
    this.gainValue = 0;
    this.panValue = 0;
    this.tmpArray = null;
  }

  public async loadFile(url: string) {
    const loader = LoaderFactory.createLoader(url, this.ac);
    this.buffer = await loader.load();
    this.duration = this.buffer!.duration;
  }

  public play(offset: number): Promise<void> {
    this.tmpArray = new Uint8Array(this.analyzer.frequencyBinCount);
    this.source = this.ac.createBufferSource();
    this.connectNodes();
    this.source.buffer = this.buffer;
    this.source.start(this.ac.currentTime, offset);
    this.isPlaying = true;

    return new Promise((resolve, reject) => {
      if (!this.source) {
        this.isPlaying = false;
        reject();
      }

      this.source!.onended = (e) => {
        this.isPlaying = false;
        resolve();
      };
    });
  }

  public stop() {
    if (this.source) {
      this.source.stop();
      this.source = null;
      this.isPlaying = false;
    }
  }

  private connectNodes() {
    this.source?.connect(this.gain)
      .connect(this.pan)
      .connect(this.analyzer)
      .connect(this.masterGain)
      .connect(this.masterAnalyzer)
      .connect(this.ac.destination);
  }

  public release() {
    this.source?.disconnect();
    this.gain.disconnect();
    this.pan.disconnect();
    this.analyzer.disconnect();
    this.masterGain.disconnect();
    this.masterAnalyzer.disconnect();
    this.ac.destination.disconnect();

    delete this.source;
    delete this.buffer;
    delete this.gain;
    delete this.pan;
    delete this.analyzer;
  }

  public setVolume(value: number) {
    this.gainValue = value;
    this.gain.gain.value = value;
  }

  public setPan(value: number) {
    this.panValue = value;
    this.pan.pan.value = value;
  }

  public mute() {
    this.isMuted = true;
    this.gain.gain.value = 0;
  }

  public unMute() {
    this.isMuted = false;
    this.gain.gain.value = this.gainValue;
  }

  public get peak() {
    if (this.analyzer && this.tmpArray) {
      this.analyzer.getByteFrequencyData(this.tmpArray);
      return Math.max.apply(null, Array.from(this.tmpArray));
    } else {
      return null;
    }
  }

  public getPeakList() {
      return this.buffer 
      ? extractPeaks(this.buffer, 1000, true)
      : null;
  }
}

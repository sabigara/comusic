import extractPeaks from '../../common/extractPeaks';

import { ITrack } from '../interface';
import LoaderFactory from './loader/LoaderFactory';

export class Track implements ITrack {
  public id: string;
  public name: string;
  public duration: number;
  private ac: AudioContext;
  private isMuted: boolean;
  private masterGain: GainNode;
  private masterAnalyzer: AnalyserNode;
  private gain: GainNode | null;
  private gainValue: number;
  private pan: StereoPannerNode | null;
  private panValue: number;
  private analyzer: AnalyserNode | null;
  private tmpArray: Uint8Array | null = null;
  private buffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null  = null;
  
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
    this.ac = ac;
    this.isMuted = false;
    this.masterGain = masterGain;
    this.masterAnalyzer = masterAnalyzer;
    this.gain = null;
    this.gainValue = 0;
    this.pan = null;
    this.panValue = 0;
    this.analyzer = null;
    this.tmpArray = null;
  }

  public async loadFile(url: string) {
    const loader = LoaderFactory.createLoader(url, this.ac);
    this.buffer = await loader.load();
    this.duration = this.buffer!.duration;
  }

  public play(offset: number): Promise<void> {
    this.createNodes();
    this.setNodeValues();
    this.connectNodes();
    this.tmpArray = new Uint8Array(this.analyzer!.frequencyBinCount);
    this.source!.buffer = this.buffer;
    this.source!.start(this.ac.currentTime, offset);

    return new Promise((resolve, reject) => {
      if (!this.source) { reject(); }

      this.source!.onended = () => {
        this.releaseResources();
        resolve();
      };
    });
  }

  private createNodes() {
    this.source = this.ac.createBufferSource();
    this.gain = this.ac.createGain();
    this.pan = this.ac.createStereoPanner();
    this.analyzer = this.ac.createAnalyser();
  }

  private setNodeValues() {
    if (this.gain) {
      const value = this.isMuted ? 0 : this.gainValue;
      this.gain.gain.value = value;
    }
    if (this.pan) {
      this.pan.pan.value = this.panValue;
    }
  }

  private connectNodes() {
    this.source!
      .connect(this.gain!)
      .connect(this.pan!)
      .connect(this.analyzer!)
      .connect(this.masterGain)
      .connect(this.masterAnalyzer)
      .connect(this.ac.destination);
  }

  private releaseResources() {
    this.source?.disconnect();
    this.gain?.disconnect();
    this.pan?.disconnect();
    this.analyzer?.disconnect();
    this.masterGain.disconnect();
    this.masterAnalyzer.disconnect();
    this.ac.destination.disconnect();

    this.source = null;
    this.gain = null;
    this.pan = null;
    this.analyzer = null;
  }

  public stop() {
    this.source?.stop();
  }

  public setVolume(value: number) {
    this.gainValue = value;
    if (this.gain) {
      this.gain.gain.value = value;
    }
  }

  public setPan(value: number) {
    this.panValue = value;
    if (this.pan) {
      this.pan.pan.value = value;
    }
  }

  public mute() {
    this.isMuted = true;
    if (this.gain) {
      this.gain.gain.value = 0;
    }
  }

  public unMute() {
    this.isMuted = false;
    if (this.gain) {
      this.gain.gain.value = this.gainValue;
    }
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
    return extractPeaks(this.buffer, 1000, true);
  }
}

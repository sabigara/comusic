'use strict';

//http://jsperf.com/typed-array-min-max/2
//plain for loop for finding min/max is way faster than anything else.
/**
 * @param {TypedArray} array - Subarray of audio to calculate peaks from.
 */
function findMinMax(array: TypedArray): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  let i = 0;
  const len = array.length;
  let curr: number;

  for (; i < len; i++) {
    curr = array[i];
    if (min > curr) {
      min = curr;
    }
    if (max < curr) {
      max = curr;
    }
  }

  return {
    min: min,
    max: max,
  };
}

/**
 * @param {Number} n - peak to convert from float to Int8, Int16 etc.
 * @param {Number} bits - convert to #bits two's complement signed integer
 */
function convert(n: number, bits: number): number {
  const max = Math.pow(2, bits - 1);
  const v = n < 0 ? n * max : n * max - 1;
  return Math.max(-max, Math.min(max - 1, v));
}

type TypedArray =
  | Int8Array
  | Uint8Array
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Uint8ClampedArray
  | Float32Array
  | Float64Array;

/**
 * @param {TypedArray} channel - Audio track frames to calculate peaks from.
 * @param {Number} samplesPerPixel - Audio frames per peak
 */
function extractPeaks(
  channel: TypedArray,
  samplesPerPixel: number,
  bits: number,
): number[] {
  let i: number;
  const chanLength = channel.length;
  const numPeaks = Math.ceil(chanLength / samplesPerPixel);
  let start: number;
  let end: number;
  let segment: TypedArray;
  let max: number;
  let min: number;
  let extrema: { min: number; max: number };

  //create interleaved array of min,max
  const peaks = new (eval('Int' + bits + 'Array'))(numPeaks * 2);

  for (i = 0; i < numPeaks; i++) {
    start = i * samplesPerPixel;
    end =
      (i + 1) * samplesPerPixel > chanLength
        ? chanLength
        : (i + 1) * samplesPerPixel;

    segment = channel.subarray(start, end);
    extrema = findMinMax(segment);
    min = convert(extrema.min, bits);
    max = convert(extrema.max, bits);

    peaks[i * 2] = min;
    peaks[i * 2 + 1] = max;
  }

  return peaks;
}

function makeMono(channelPeaks: number[][], bits: number): number[][] {
  const numChan = channelPeaks.length;
  const weight = 1 / numChan;
  const numPeaks = channelPeaks[0].length / 2;
  let c = 0;
  let i = 0;
  let min: number;
  let max: number;
  const peaks = new (eval('Int' + bits + 'Array'))(numPeaks * 2);

  for (i = 0; i < numPeaks; i++) {
    min = 0;
    max = 0;

    for (c = 0; c < numChan; c++) {
      min += weight * channelPeaks[c][i * 2];
      max += weight * channelPeaks[c][i * 2 + 1];
    }

    peaks[i * 2] = min;
    peaks[i * 2 + 1] = max;
  }

  //return in array so channel number counts still work.
  return [peaks];
}

type Peaks = {
  length: number;
  data: number[][];
  bits: number;
};

/**
 * @param {AudioBuffer,TypedArray} source - Source of audio samples for peak calculations.
 * @param {Number} samplesPerPixel - Number of audio samples per peak.
 * @param {Number} cueIn - index in channel to start peak calculations from.
 * @param {Number} cueOut - index in channel to end peak calculations from (non-inclusive).
 */
export default function(
  source: AudioBuffer,
  samplesPerPixel: number,
  isMono: boolean,
  cueIn?: number,
  cueOut?: number,
  bits?: number,
): Peaks {
  samplesPerPixel = samplesPerPixel || 10000;
  bits = bits || 8;

  if (isMono === null || isMono === undefined) {
    isMono = true;
  }

  if ([8, 16, 32].indexOf(bits) < 0) {
    throw new Error('Invalid number of bits specified for peaks.');
  }

  const numChan = source.numberOfChannels;
  let peaks: number[][] = [];

  for (let c = 0; c < numChan; c++) {
    const channel = source.getChannelData(c);
    cueIn = cueIn || 0;
    cueOut = cueOut || channel.length;
    const slice = channel.subarray(cueIn, cueOut);
    peaks.push(extractPeaks(slice, samplesPerPixel, bits));
  }

  if (isMono && peaks.length > 1) {
    peaks = makeMono(peaks, bits);
  }

  const numPeaks = peaks[0].length / 2;

  return {
    length: numPeaks,
    data: peaks,
    bits: bits,
  };
}

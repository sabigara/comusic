export function samplesToSeconds(samples: number, sampleRate: number) {
  return samples / sampleRate;
}

export function secondsToSamples(seconds: number, sampleRate: number) {
  return Math.ceil(seconds * sampleRate);
}

export function samplesToPixels(samples: number, resolution: number) {
  return Math.floor(samples / resolution);
}

export function pixelsToSamples(pixels: number, resolution: number) {
  return Math.floor(pixels * resolution);
}

export function pixelsToSeconds(pixels: number, resolution: number, sampleRate: number) {
  return (pixels * resolution) / sampleRate;
}

export function secondsToPixels(seconds: number, resolution: number, sampleRate: number) {
  return Math.ceil((seconds * sampleRate) / resolution);
}

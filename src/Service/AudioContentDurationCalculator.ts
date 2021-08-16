import HasAudioContent from '../Entity/HasAudioContent';

export function getDurationInFrames(duration: number /* float */, fps: number): number {
  return Math.round(duration * fps)
}

export function getAudioContentDurationInFrames(content: HasAudioContent, fps: number): number {
  return getDurationInFrames(content.audioDuration, fps)
}

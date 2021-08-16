import HasAudioContent from '../Entity/HasAudioContent';

export default function getAudioContentDurationInFrames(content: HasAudioContent, fps: number): number {
  return Math.ceil(content.audioDuration * fps)
}
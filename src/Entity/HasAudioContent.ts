import AudioCue from './AudioCue'

export default interface HasAudioContent {
  audio: string
  audioDuration: number //float
  audioCues: Array<AudioCue>
}

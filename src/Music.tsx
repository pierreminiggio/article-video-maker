import { useMemo } from "react";
import { Audio, interpolate, Sequence, useCurrentFrame, useVideoConfig } from "remotion";
import cueDisplayTime from "./Config/cueDisplayTime";
import introLength from "./Config/introLength";
import textDisparitionFrame from "./Config/textDisparitionFrame";
import News from './news.mp3'

interface MusicProps {
  durationInFrames: number
  collidingAudio: boolean
}

const musicDurationInSeconds = 112

export default function Music({durationInFrames, collidingAudio}: MusicProps) {

  const {fps} = useVideoConfig()
  const musicDurationInFrames = useMemo<number>(() => musicDurationInSeconds * fps, [fps])
  const numberOfLoops = useMemo<number>(
    () => Math.ceil(durationInFrames / musicDurationInFrames),
    [durationInFrames, musicDurationInFrames]
  )

  const frame = useCurrentFrame()
  const maxIntroMusicVolume = 0.8
  const maxMusicVolume = 0.2
  const musicVolume = useMemo<number>(() => {

    if (frame <= introLength) {
      return Math.min(maxIntroMusicVolume, interpolate(
        frame,
        [textDisparitionFrame, introLength],
        [maxIntroMusicVolume, maxMusicVolume]
      ))
    }

    return Math.min(maxMusicVolume, interpolate(
      frame,
      [durationInFrames - cueDisplayTime / 2, durationInFrames + introLength],
      [maxMusicVolume, 0]
    ))
  }, [frame])

  return <>
    {[...Array(numberOfLoops).keys()].map(loop => {
      
      const isLastLoop = loop === numberOfLoops - 1

      return <Sequence
        key={loop}
        from={loop * musicDurationInFrames}
        durationInFrames={isLastLoop ? (durationInFrames % musicDurationInFrames) : musicDurationInFrames}
        name="Musique News"
      >
        <Audio src={News} volume={collidingAudio ? 0 : musicVolume} />
    </Sequence>
    })}
  </>
}
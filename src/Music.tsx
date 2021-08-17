import { useMemo } from "react";
import { Audio, interpolate, Sequence, useCurrentFrame } from "remotion";
import cueDisplayTime from "./Config/cueDisplayTime";
import News from './news.mp3'

interface MusicProps {
  durationInFrames: number
  fps: number
}

const musicDurationInSeconds = 112

export default function Music({durationInFrames, fps}: MusicProps) {

  const musicDurationInFrames = useMemo<number>(() => musicDurationInSeconds * fps, [fps])
  const numberOfLoops = useMemo<number>(
    () => Math.ceil(durationInFrames / musicDurationInFrames),
    [durationInFrames, musicDurationInFrames]
  )

  const frame = useCurrentFrame()
  const maxMusicVolume = 0.2
  const musicVolume = Math.min(maxMusicVolume, interpolate(
    frame,
    [durationInFrames - cueDisplayTime / 2, durationInFrames],
    [maxMusicVolume, 0]
  ))

  return <>
    {[...Array(numberOfLoops).keys()].map(loop => {
      
      const isLastLoop = loop === numberOfLoops - 1

      return <Sequence
        key={loop}
        from={loop * musicDurationInFrames}
        durationInFrames={isLastLoop ? (durationInFrames % musicDurationInFrames) : musicDurationInFrames}
        name="Musique News"
      >
        <Audio src={News} volume={musicVolume} />
    </Sequence>
    })}
  </>
}
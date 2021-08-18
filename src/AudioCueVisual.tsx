import { useMemo } from 'react'
import { Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'
import { Gif } from '@remotion/gif'
import AudioCueType from './Entity/AudioCueType'
import cueDisplayTime from './Config/cueDisplayTime'
import imagesHeightRatio from './Config/imagesHeightRatio'
import introLength from './Config/introLength'

interface AudioCueVisualProps {
  name: AudioCueType
  from: number
  durationInFrames: number
}

enum VisualType {
  Image = 'image',
  Gif = 'gif'
}

interface Visual {
  type: VisualType
  src: string
}

export default function AudioCueVisual({name, from, durationInFrames}: AudioCueVisualProps): JSX.Element {

  const visual = useMemo<Visual>(() => {
    const type = [
      AudioCueType.Add
    ].includes(name) ? VisualType.Image : VisualType.Gif

    const src = require('./Static/' + name + '.' + (type === VisualType.Image ? 'png' : 'gif'))

    return {type, src}
  }, [name])

  const {width, height} = useVideoConfig()

  const imageWidth = useMemo<number>(() => {
    return width / 4
  }, [width])

  const imageHeight = useMemo<number>(() => {
    return height * imagesHeightRatio
  }, [height, imagesHeightRatio])

  const frame = useCurrentFrame()
  const currentFrame = useMemo<number>(() => frame - from, [frame, from])
  const startFrame = 0
  const endFrame = cueDisplayTime
  
  const negativeMargin = interpolate(currentFrame, [startFrame, endFrame], [1, 0])

  const opacity = Math.min(1, interpolate(
		frame,
		[durationInFrames - cueDisplayTime / 2, durationInFrames + introLength],
		[1, 0]
	))

  return <Sequence
    from={from}
    durationInFrames={endFrame}
    name={'Gif ' + name + ' ' + from}
  >
    <div style={{
      position: 'absolute',
      top: 0,
      left: width * (negativeMargin) - imageWidth,
    }}>
      {visual.type === VisualType.Image ? (
        <Img
          src={visual.src}
          height={imageHeight}
          style={{opacity}}
        />
      ) : (
        <Gif
          src={visual.src}
          fit="contain"
          width={imageWidth}
          height={imageHeight}
          style={{opacity}}
        />
      )}
    </div>
  </Sequence>
}
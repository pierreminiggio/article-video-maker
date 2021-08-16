import { useMemo } from 'react'
import { Img } from 'remotion'
import { Gif } from '@remotion/gif'
import AudioCueType from './Entity/AudioCueType'

interface AudioCueVisualProps {
  name: AudioCueType
  index: number,
}

enum VisualType {
  Image = 'image',
  Gif = 'gif'
}

interface Visual {
  type: VisualType
  src: string
}

export default function AudioCueVisual({name, index}: AudioCueVisualProps): JSX.Element {

  const visual = useMemo<Visual>(() => {
    const type = [
      AudioCueType.Add
    ].includes(name) ? VisualType.Image : VisualType.Gif

    const src = require('./Static/' + name + '.' + (type === VisualType.Image ? 'png' : 'gif'))

    return {type, src}
  }, [name])

  return <div style={{marginTop: (index * 10) + '%'}}>
    {visual.type === VisualType.Image ? <Img src={visual.src} /> : <Gif src={visual.src} />}
  </div>
}
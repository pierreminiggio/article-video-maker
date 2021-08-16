import { useMemo } from 'react'
import { Img } from 'remotion'
import AudioCueType from './Entity/AudioCueType'

interface AudioCueVisualProps {
  name: AudioCueType
  index: number,
}

export default function AudioCueVisual({name, index}: AudioCueVisualProps): JSX.Element {

  const imgSrc = useMemo<string>(() => {
    return require('./Static/' + name + '.' + ([
      AudioCueType.Add
    ].includes(name) ? 'png' : 'gif'))
  }, [name])

  return <div style={{marginTop: (index * 10) + '%'}}>
    <Img src={imgSrc} />
  </div>
}
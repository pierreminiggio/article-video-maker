import { useMemo } from 'react';
import { Audio, Sequence, useCurrentFrame } from 'remotion';
import AudioCueVisual from './AudioCueVisual';
import AudioCueType from './Entity/AudioCueType';
import Content from './Entity/Content';
import ContentType from './Entity/ContentType';
import EmbedTwitterContent from './Entity/EmbedTwitterContent';
import HasAudioContent from './Entity/HasAudioContent';
import {getDurationInFrames, getAudioContentDurationInFrames} from './Service/AudioContentDurationCalculator';

interface ContentHandlerProps {
  contents: Content[]
  fps: number
  from: number
}

interface Incrementable {
  from: number
}

interface FrameAudioCue {
  frame: number
  name: AudioCueType
}

interface Editable extends Incrementable {
  audioCues: Array<FrameAudioCue>
}

interface AudioSequences {
  audioSequences: Array<JSX.Element>
  audioCues: Array<FrameAudioCue>
}

export default function ContentHandler({contents, fps, from}: ContentHandlerProps): JSX.Element {

  const frame = useCurrentFrame()
  const {audioSequences, audioCues} = useMemo<AudioSequences>(() => {

    const audioSequences: Array<JSX.Element> = []

    const editable: Editable = {
      from: from,
      audioCues: []
    }

    contents.forEach((content, contentIndex) => {

      const contentType = content.type

      if ([ContentType.BlockQuote, ContentType.CaptionedImage, ContentType.Text, ContentType.Title].includes(contentType)) {
        const audioContent = content as HasAudioContent
        audioSequences.push(audioContentHandler(
          audioContent,
          contentIndex.toString(),
          (contentIndex + 1).toString(),
          editable,
          fps
        ))
      } else if (contentType === ContentType.EmbedTwitter) {
        const twitterContent = content as EmbedTwitterContent
        const main = twitterContent.main

        audioSequences.push(audioContentHandler(
          main,
          contentIndex.toString() + '-main',
          (contentIndex + 1).toString() + ' Main',
          editable,
          fps
        ))

        const reply = twitterContent.reply

        if (reply !== null) {
          audioSequences.push(audioContentHandler(
            reply,
            contentIndex.toString() + '-reply',
            (contentIndex + 1).toString() + ' Reply',
            editable,
            fps
          ))
        }
      }
    })

    return {audioSequences, audioCues: editable.audioCues}
  }, [contents, from, fps])

  const currentAudioCues = useMemo<Array<FrameAudioCue>>(() => {
    const currentCues: Array<FrameAudioCue> = []
    const maxCueDuration = 300

    audioCues.forEach(audioCue => {
      const audioCueFrame = audioCue.frame
      const isPresentOnScreen = frame >= audioCueFrame && (audioCueFrame + maxCueDuration) >= frame

      if (isPresentOnScreen) {
        const isAlreadyPresent = currentCues.filter(filteredCue => filteredCue.name === audioCue.name).length >= 1
        
        if (! isAlreadyPresent) {
          currentCues.push(audioCue)
        }
      }
    })

    return currentCues.sort((a: FrameAudioCue, b: FrameAudioCue): number => {
      return a.frame - b.frame
    })
    
  }, [audioCues, frame])

  return <>
    {audioSequences}
    {currentAudioCues.map((audioCue, audioCueIndex) => (
      <AudioCueVisual key={audioCueIndex} name={audioCue.name} index={audioCueIndex} />
    ))}
  </>
}

function audioContentHandler(
  content: HasAudioContent,
  sequenceKey: string,
  name: string,
  editable: Editable,
  fps: number
): JSX.Element {
  const audioDurationInFrames = getAudioContentDurationInFrames(content, fps)

  const sequence = (
    <Sequence
      key={'audio-' + sequenceKey}
      from={editable.from}
      durationInFrames={audioDurationInFrames}
      name={'Audio ' + name}
    >
      <Audio src={content.audio} />
    </Sequence>
  );

  content.audioCues.forEach(audioCue => {
    const frameAudioCue: FrameAudioCue = {
      frame: editable.from + getDurationInFrames(audioCue.time, fps),
      name: audioCue.name
    }
    editable.audioCues.push(frameAudioCue)
  })

  editable.from += audioDurationInFrames

  return sequence
}
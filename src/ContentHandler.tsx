import { Audio, Sequence } from 'remotion';
import Content from './Entity/Content';
import ContentType from './Entity/ContentType';
import EmbedTwitterContent from './Entity/EmbedTwitterContent';
import HasAudioContent from './Entity/HasAudioContent';

interface ContentHandlerProps {
  contents: Content[]
  fps: number
  from: number
}

interface Incrementable {
  from: number
}

export default function ContentHandler({contents, fps, from}: ContentHandlerProps): JSX.Element {
  const increments: Incrementable = {
    from: from
  }

  return <>
    {contents.map((content, contentIndex) => {
      const jsx: Array<JSX.Element> = []

      const contentType = content.type

      if ([ContentType.BlockQuote, ContentType.CaptionedImage, ContentType.Text, ContentType.Title].includes(contentType)) {
        const audioContent = content as HasAudioContent
        jsx.push(createSequenceForAudioContent(
          audioContent,
          contentIndex.toString(),
          (contentIndex + 1).toString(),
          increments,
          fps
        ))
      } else if (contentType === ContentType.EmbedTwitter) {
        const twitterContent = content as EmbedTwitterContent
        const main = twitterContent.main

        jsx.push(createSequenceForAudioContent(
          main,
          contentIndex.toString() + '-main',
          (contentIndex + 1).toString() + ' Main',
          increments,
          fps
        ))

        const reply = twitterContent.reply

        if (reply !== null) {
          jsx.push(createSequenceForAudioContent(
            reply,
            contentIndex.toString() + '-reply',
            (contentIndex + 1).toString() + ' Reply',
            increments,
            fps
          ))
        }
      }

      return jsx
    })}
  </>
}

function createSequenceForAudioContent(
  content: HasAudioContent,
  sequenceKey: string,
  name: string,
  increments: Incrementable,
  fps: number
): JSX.Element {
  
  const audioDurationInFrames = Math.ceil(content.audioDuration * fps)

  const sequence = (
    <Sequence
      key={'audio-' + sequenceKey}
      from={increments.from}
      durationInFrames={audioDurationInFrames}
      name={'Audio ' + name}
    >
      <Audio src={content.audio} />
    </Sequence>
  )

  increments.from += audioDurationInFrames

  return sequence
}
import { Audio, Sequence } from 'remotion';
import Content from './Entity/Content';
import ContentType from './Entity/ContentType';
import EmbedTwitterContent from './Entity/EmbedTwitterContent';
import HasAudioContent from './Entity/HasAudioContent';
import getAudioContentDurationInFrames from './Service/getAudioContentDurationInFrames';

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
        jsx.push(audioContentHandler(
          audioContent,
          contentIndex.toString(),
          (contentIndex + 1).toString(),
          increments,
          fps
        ))
      } else if (contentType === ContentType.EmbedTwitter) {
        const twitterContent = content as EmbedTwitterContent
        const main = twitterContent.main

        jsx.push(audioContentHandler(
          main,
          contentIndex.toString() + '-main',
          (contentIndex + 1).toString() + ' Main',
          increments,
          fps
        ))

        const reply = twitterContent.reply

        if (reply !== null) {
          jsx.push(audioContentHandler(
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

function audioContentHandler(
  content: HasAudioContent,
  sequenceKey: string,
  name: string,
  increments: Incrementable,
  fps: number
): JSX.Element {
  
  const audioDurationInFrames = getAudioContentDurationInFrames(content, fps)

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
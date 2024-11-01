import { CSSProperties, useEffect, useMemo } from 'react'
import { Audio, Img, interpolate, Sequence, useCurrentFrame, useVideoConfig, Video } from 'remotion'
import AudioCueVisual from './AudioCueVisual'
import cueDisplayTime from './Config/cueDisplayTime'
import cueMinOverlap from './Config/cueMinOverlap'
import imagesHeightRatio from './Config/imagesHeightRatio'
import AudioCueType from './Entity/AudioCueType'
import CaptionedImageContent from './Entity/CaptionedImageContent'
import Content from './Entity/Content'
import ContentType from './Entity/ContentType'
import EmbedContent, { VideoEmbedContent } from './Entity/EmbedContent'
import EmbedTwitterContent from './Entity/EmbedTwitterContent'
import HasAudioContent from './Entity/HasAudioContent'
import HasStringContent from './Entity/HasStringContent'
import ImageContent from './Entity/ImageContent'
import {getDurationInFrames, getAudioContentDurationInFrames} from './Service/AudioContentDurationCalculator'

interface ContentHandlerProps {
  contents: Content[]
  from: number
  durationInFrames: number
  onCollidingAudio?: (colliding: boolean) => void
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

interface CollidingAudio {
  collidingAudio: boolean
}

interface AudioSequences {
  audioSequences: Array<JSX.Element>
  audioCues: Array<FrameAudioCue>
}

export default function ContentHandler({contents, from, durationInFrames, onCollidingAudio}: ContentHandlerProps): JSX.Element {

  const {height, fps} = useVideoConfig()

  const frame = useCurrentFrame()
  const contentOpacity = Math.max(Math.min(1, interpolate(
		frame,
		[from + durationInFrames - cueDisplayTime * 1.5, from + durationInFrames - cueDisplayTime],
		[1, 0]
	)), 0)

  const {audioSequences, audioCues, collidingAudio} = useMemo<AudioSequences&CollidingAudio>(() => {
    const audioSequences: Array<JSX.Element> = []
    let collidingAudio = false

    const editable: Editable = {
      from: from,
      audioCues: []
    }

    let previousFrom: number
    let previousDurationInFrames: number

    contents.forEach((content, contentIndex) => {

      const contentType = content.type
      const fromBeforeAlteration = editable.from

      if ([ContentType.BlockQuote, ContentType.Text, ContentType.Title].includes(contentType)) {
        const audioAndTextContent = content as HasAudioContent&HasStringContent

        const audioDurationInFrames = getAudioContentDurationInFrames(audioAndTextContent, fps)
        previousDurationInFrames = audioDurationInFrames

        const textFrom = editable.from

        const contentLength = audioAndTextContent.content.length
        let fontSize = 55

        if (contentLength >= 450) {
          fontSize = 41
        } else if (contentLength >= 400) {
          fontSize = 45
        } else if (contentLength >= 350) {
          fontSize = 48
        } else if (contentLength >= 300) {
          fontSize = 51
        }

        const backgroundColor = '#F57C00'

        const textPadding = 20
        const shadowWidth = 20
        const shadowWidthPx = shadowWidth + 'px'
        const shadowHeightPx = shadowWidthPx

        const textDivStyle: CSSProperties = {
          position: 'absolute',
          top: 0,
          left: textPadding,
          right: textPadding
        }

        audioSequences.push(<Sequence
          key={contentType + contentIndex}
          from={textFrom}
          durationInFrames={audioDurationInFrames}
          name={contentType.substr(0, 1).toUpperCase() + contentType.substr(1, contentType.length - 1) + ' ' + contentIndex}
        >
          <div style={{
            fontSize,
            color: 'black',
            marginTop: height * (imagesHeightRatio + 0.1),
            textAlign: 'center',
            fontFamily: 'Montserrat',
            lineHeight: 1.8,
            position: 'relative',
            width: '100%',
            opacity: contentOpacity
          }}>
            <div style={textDivStyle}>
              <span
                style={{
                  color: 'transparent',
                  backgroundColor,
                  opacity: 0.7,
                  boxShadow:
                    shadowWidthPx + ' 0 0 '
                      + backgroundColor
                      + ',-' + shadowWidthPx + ' 0 0 '
                      + backgroundColor
                      + ',' + shadowWidthPx + ' ' + shadowHeightPx + ' 0 '
                      + backgroundColor
                      + ',-' + shadowWidthPx + ' -' + shadowHeightPx + ' 0 '
                      + backgroundColor
                      + ',' + shadowWidthPx + ' -' + shadowHeightPx + ' 0 '
                      + backgroundColor
                      + ',-' + shadowWidthPx + ' ' + shadowHeightPx + ' 0 '
                      + backgroundColor
                    ,
                }}
              >
                {audioAndTextContent.content}
              </span>
            </div>
            <div style={textDivStyle}>
              <span
                style={{
                  color: '#FFF'
                }}
              >
                {audioAndTextContent.content}
              </span>
            </div>
          </div>
        </Sequence>)

        audioSequences.push(audioContentHandler(
          audioAndTextContent,
          contentIndex.toString(),
          (contentIndex + 1).toString(),
          editable,
          fps
        ))
      } else if (contentType === ContentType.EmbedTwitter) {
        const twitterContent = content as EmbedTwitterContent
        const main = twitterContent.main
        const reply = twitterContent.reply
        let tweetDurationInFrames = getAudioContentDurationInFrames(main, fps)

        if (reply !== null) {
          tweetDurationInFrames += getAudioContentDurationInFrames(reply, fps)
        }
        
        if (! tweetDurationInFrames) {
          return
        }

        previousDurationInFrames = tweetDurationInFrames

        const tweetFrom = editable.from

        const twitterPadding = 0.05

        audioSequences.push(<Sequence
          key={contentType + contentIndex}
          from={tweetFrom}
          durationInFrames={tweetDurationInFrames}
          name={'Tweet ' + contentIndex}
        >
          <div style={{
            marginTop: height * (imagesHeightRatio + twitterPadding),
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            opacity: contentOpacity
          }}>
            <Img
              src={'data:image/png;base64, ' + twitterContent.screenshot}
              height={height * (1 - imagesHeightRatio - 2 * twitterPadding)}
              style={{flex: 'auto 0'}}
            />
          </div>
        </Sequence>)

        audioSequences.push(audioContentHandler(
          main,
          contentIndex.toString() + '-main',
          (contentIndex + 1).toString() + ' Main',
          editable,
          fps
        ))

        if (reply !== null) {
          audioSequences.push(audioContentHandler(
            reply,
            contentIndex.toString() + '-reply',
            (contentIndex + 1).toString() + ' Reply',
            editable,
            fps
          ))
        }
      } else if (contentType === ContentType.Image || (contentType === ContentType.CaptionedImage && ! content.caption)) {
        const imageContent = content as ImageContent
        const imageDurationInFrames = previousDurationInFrames || (3 * fps)

        const imageSizeRatio = 0.35

        audioSequences.push(<Sequence
          key={contentType + 'image' + contentIndex}
          from={previousFrom}
          durationInFrames={imageDurationInFrames}
          name={contentType.substr(0, 1).toUpperCase() + contentType.substr(1, contentType.length - 1) + ' ' + contentIndex}
        >
          <div style={{
            marginTop: height * 0.05,
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
            <Img src={imageContent.image} height={height * imageSizeRatio} style={{flex: 'auto 0'}} />
          </div>
        </Sequence>)
      } else if (contentType === ContentType.CaptionedImage) {
        const captionedImageContent = content as CaptionedImageContent
        const audioDurationInFrames = getAudioContentDurationInFrames(captionedImageContent, fps)

        previousDurationInFrames = audioDurationInFrames

        const textFrom = editable.from

        const backgroundColor = '#F57C00'

        const textPadding = 20
        const shadowWidth = 20
        const shadowWidthPx = shadowWidth + 'px'
        const shadowHeightPx = shadowWidthPx

        const textDivStyle: CSSProperties = {
          position: 'absolute',
          top: 0,
          left: textPadding,
          right: textPadding
        }

        const imageSizeRatio = 0.35

        audioSequences.push(<Sequence
          key={contentType + 'image' + contentIndex}
          from={textFrom}
          durationInFrames={audioDurationInFrames}
          name={contentType.substr(0, 1).toUpperCase() + contentType.substr(1, contentType.length - 1) + ' ' + contentIndex}
        >
          <div style={{
            marginTop: height * (imagesHeightRatio + 0.05),
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
            <Img src={captionedImageContent.image} height={height * imageSizeRatio} style={{flex: 'auto 0'}} />
          </div>
        </Sequence>)

        audioSequences.push(<Sequence
          key={contentType + contentIndex}
          from={textFrom}
          durationInFrames={audioDurationInFrames}
          name={contentType.substr(0, 1).toUpperCase() + contentType.substr(1, contentType.length - 1) + ' ' + contentIndex}
        >
          <div style={{
            fontSize: 40,
            color: 'black',
            marginTop: height * (imagesHeightRatio + 0.1 + imageSizeRatio),
            textAlign: 'center',
            fontFamily: 'Montserrat',
            lineHeight: 1.8,
            position: 'relative',
            width: '100%',
            opacity: contentOpacity
          }}>
            <div style={textDivStyle}>
              <span
                style={{
                  color: 'transparent',
                  backgroundColor,
                  opacity: 0.7,
                  boxShadow:
                    shadowWidthPx + ' 0 0 '
                      + backgroundColor
                      + ',-' + shadowWidthPx + ' 0 0 '
                      + backgroundColor
                      + ',' + shadowWidthPx + ' ' + shadowHeightPx + ' 0 '
                      + backgroundColor
                      + ',-' + shadowWidthPx + ' -' + shadowHeightPx + ' 0 '
                      + backgroundColor
                      + ',' + shadowWidthPx + ' -' + shadowHeightPx + ' 0 '
                      + backgroundColor
                      + ',-' + shadowWidthPx + ' ' + shadowHeightPx + ' 0 '
                      + backgroundColor
                    ,
                }}
              >
                {captionedImageContent.caption}
              </span>
            </div>
            <div style={textDivStyle}>
              <span
                style={{
                  color: '#FFF'
                }}
              >
                {captionedImageContent.caption}
              </span>
            </div>
            
          </div>
        </Sequence>)

        audioSequences.push(audioContentHandler(
          captionedImageContent,
          contentIndex.toString(),
          (contentIndex + 1).toString(),
          editable,
          fps
        ))
      } else if (contentType === ContentType.Embed) {
        const embedContent = content as EmbedContent

        if (embedContent.video_clip && embedContent.video_clip_duration && embedContent.video_title) {
          const videoEmbedContent = embedContent as VideoEmbedContent
          const clipDurationInFrames = getDurationInFrames(videoEmbedContent.video_clip_duration, fps)
          previousDurationInFrames = clipDurationInFrames

          const clipFrom = editable.from

          const backgroundColor = '#F57C00'

          const textPadding = 20
          const shadowWidth = 20
          const shadowWidthPx = shadowWidth + 'px'
          const shadowHeightPx = shadowWidthPx

          const textDivStyle: CSSProperties = {
            position: 'absolute',
            top: 0,
            left: textPadding,
            right: textPadding
          }

          const imageSizeRatio = 0.35

          audioSequences.push(<Sequence
            key={contentType + contentIndex}
            from={clipFrom}
            durationInFrames={clipDurationInFrames}
            name={'Tweet ' + contentIndex}
          >
            <Video src={videoEmbedContent.video_clip} style={{position: 'absolute'}} />
            <div style={{
              fontSize: 40,
              color: 'black',
              marginTop: height * (imagesHeightRatio + 0.1 + imageSizeRatio),
              textAlign: 'center',
              fontFamily: 'Montserrat',
              lineHeight: 1.8,
              position: 'relative',
              width: '100%',
              opacity: contentOpacity
            }}>
              <div style={textDivStyle}>
                <span
                  style={{
                    color: 'transparent',
                    backgroundColor,
                    opacity: 0.7,
                    boxShadow:
                      shadowWidthPx + ' 0 0 '
                        + backgroundColor
                        + ',-' + shadowWidthPx + ' 0 0 '
                        + backgroundColor
                        + ',' + shadowWidthPx + ' ' + shadowHeightPx + ' 0 '
                        + backgroundColor
                        + ',-' + shadowWidthPx + ' -' + shadowHeightPx + ' 0 '
                        + backgroundColor
                        + ',' + shadowWidthPx + ' -' + shadowHeightPx + ' 0 '
                        + backgroundColor
                        + ',-' + shadowWidthPx + ' ' + shadowHeightPx + ' 0 '
                        + backgroundColor
                      ,
                  }}
                >
                  {videoEmbedContent.video_title}
                </span>
              </div>
              <div style={textDivStyle}>
                <span
                  style={{
                    color: '#FFF'
                  }}
                >
                  {videoEmbedContent.video_title}
                </span>
              </div>
            </div>
          </Sequence>)

          if (frame >= clipFrom && frame <= (clipFrom + clipDurationInFrames)) {
            collidingAudio = true
          }

          editable.from += clipDurationInFrames
          
        } else {
          const embedContentUrl = embedContent.url
          const isUrlYoutube = embedContentUrl.includes('youtube.com') || embedContentUrl.includes('youtu.be')

          if (isUrlYoutube) {
            // Downloading video clip fails, whatever, we'll not include it in the video
          } else {
            console.log(content)
            throw new Error(contentType + ' not implemented')
          }
        }
      } else {
      }

      previousFrom = fromBeforeAlteration
    })

    let audioCues: Array<FrameAudioCue> = editable.audioCues.sort((a: FrameAudioCue, b: FrameAudioCue): number => {
      return a.frame - b.frame
    })

    audioCues = audioCues.map((audioCue: FrameAudioCue, audioCueIndex: number, audioCues: Array<FrameAudioCue>): FrameAudioCue => {

      const audioCueFrameOffset = Math.round(cueDisplayTime / 3)
      audioCue.frame = Math.max(audioCue.frame - audioCueFrameOffset, 0)

      if (audioCueIndex === 0) {
        return audioCue
      }

      const lastAudioCue = audioCues[audioCueIndex - 1]
      const cueOverlap = audioCue.frame - lastAudioCue.frame

      if (cueOverlap < cueMinOverlap) {
        audioCue.frame += cueMinOverlap - cueOverlap
      }

      return audioCue
    })

    return {audioSequences, audioCues, collidingAudio}
  }, [contents, from, fps, contentOpacity, frame])

  useEffect(() => onCollidingAudio && onCollidingAudio(collidingAudio), [collidingAudio, onCollidingAudio])

  return <>
    <Sequence
			from={from}
      durationInFrames={durationInFrames}
      name="Fond Gif"
		>
      <div style={{
        background: 'linear-gradient(rgba(255, 255, 255, 1), rgba(255, 255, 254, 0))',
        opacity: 0.2,
        width: '100%',
        height: height * imagesHeightRatio
      }} />
		</Sequence>
    {audioSequences}
    {audioCues.map((audioCue, audioCueIndex) => (
      <AudioCueVisual key={audioCueIndex} name={audioCue.name} from={audioCue.frame} durationInFrames={durationInFrames} />
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

    let frame = editable.from + getDurationInFrames(audioCue.time, fps)

    const IsSameCueAlreadyDisplayedAtTheSameTime = editable.audioCues.filter(filteredCue => 
      filteredCue.name === audioCue.name && filteredCue.frame <= frame && (filteredCue.frame + cueDisplayTime / 2) >= frame
    ).length >= 1

    if (IsSameCueAlreadyDisplayedAtTheSameTime) {
      return
    }

    const frameAudioCue: FrameAudioCue = {
      frame,
      name: audioCue.name
    }
    editable.audioCues.push(frameAudioCue)
  })

  editable.from += audioDurationInFrames

  return sequence
}
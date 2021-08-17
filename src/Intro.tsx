import { useMemo } from "react";
import { Img, interpolate, Sequence, useCurrentFrame } from "remotion";
import textApparitionFrame from "./Config/textApparitionFrame";
import textDisparitionFrame from "./Config/textDisparitionFrame";
import thumbnailMaxBlur from "./Config/thumbnailMaxBlur";

interface IntroProps {
  introLength: number
  thumbnail: string
  title: string
  description: string
}

export default function Intro({
  introLength,
  thumbnail,
  title,
  description
}: IntroProps) {

  const frame = useCurrentFrame()
  const thumnailBlur = interpolate(
    frame,
    [9 * introLength / 10, introLength],
    [0, thumbnailMaxBlur]
  )

  const finalTopTitle = 20

  const topTitle = Math.min(interpolate(
    frame,
    [0, textApparitionFrame],
    [-200, finalTopTitle]
  ), finalTopTitle)

  const backgroundOpacity = Math.max(interpolate(
    frame,
    [textDisparitionFrame, introLength],
    [1, 0]
  ), 0)

  const textOpacity = useMemo<number>(() => {

    if (frame < 100) {
      return 0
    }
    
    return backgroundOpacity

  }, [backgroundOpacity])

  const textShadow = '3px 3px 3px black, 5px 5px 10px black, -2px -2px 3px black'

  return <>
    <Sequence
			from={0}
			durationInFrames={introLength}
			name="Fond Miniature"
		>
			<Img src={thumbnail} style={{
				filter: 'blur(' + thumnailBlur + 'px)',
			}} />
		</Sequence>
    <Sequence
			from={0}
      durationInFrames={introLength}
      name="Fond Orange"
		>
      <div style={{
        backgroundColor: '#F57C00',
        width: '100%',
        height: '100%',
        opacity: backgroundOpacity
      }} />
		</Sequence>
    <Sequence
      from={0}
      durationInFrames={introLength}
      name="Intro"
    >
      <div>
        <h1 style={{
          fontFamily: 'Montserrat',
          color: '#FFF',
          fontSize: 100,
          textAlign: 'center',
          position: 'absolute',
          top: topTitle + '%',
          left: 0,
          right: 0,
          opacity: textOpacity,
          textShadow,
        }}>{title}</h1>
        <p style={{
          fontFamily: 'Montserrat',
          color: '#FFF',
          fontSize: 50,
          textAlign: 'center',
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          opacity: textOpacity,
          textShadow
        }}>{description}</p>
      </div>
    </Sequence>
  </>
}
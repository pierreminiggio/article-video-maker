import { Img, interpolate, Sequence, useCurrentFrame, useVideoConfig } from 'remotion'
import cueDisplayTime from './Config/cueDisplayTime'
import introLength from './Config/introLength'
import thumbnailMaxBlur from './Config/thumbnailMaxBlur'
import ContentHandler from './ContentHandler'
import FilledArticle from './Entity/FilledArticle'
import Intro from './Intro'
import Music from './Music'

interface ArticleHandlerProps {
  article: FilledArticle
}

export default function ArticleHandler({article}: ArticleHandlerProps) {

  const {fps} = useVideoConfig()
	const durationInFrames = Math.ceil(article.duration * fps) + cueDisplayTime

	const frame = useCurrentFrame()
	const thumbnailOpacity = Math.min(1, interpolate(
		frame,
		[introLength + durationInFrames - cueDisplayTime / 2, durationInFrames + introLength],
		[1, 0]
	))

	const contentFrom = introLength

	return <>
		<Sequence
			from={0}
      durationInFrames={durationInFrames + introLength}
      name="Fond Noir"
		>
      <div style={{
        backgroundColor: 'black',
        width: '100%',
        height: '100%'
      }} />
		</Sequence>
		<Intro
			introLength={introLength}
			thumbnail={article.thumbnail}
			title={article.title}
			description={article.description}
		/>
		<Sequence
			from={contentFrom}
			durationInFrames={durationInFrames}
			name="Fond Miniature"
		>
			<Img src={article.thumbnail} style={{
				opacity: thumbnailOpacity,
				filter: 'blur(' + thumbnailMaxBlur + 'px)',
			}} />
		</Sequence>
		<Music durationInFrames={durationInFrames} />
		<ContentHandler
			contents={article.content}
			from={contentFrom}
			durationInFrames={durationInFrames}
		/>
	</>;
}
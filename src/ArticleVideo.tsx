import fetch from 'node-fetch'
import { useEffect, useState } from 'react';
import {continueRender, delayRender, Img, interpolate, Sequence, useCurrentFrame} from 'remotion';
import cueDisplayTime from './Config/cueDisplayTime';
import thumbnailMaxBlur from './Config/thumbnailMaxBlur';
import ContentHandler from './ContentHandler';
import Article from './Entity/Article';
import Intro from './Intro';
import Music from './Music';
import './font.css'
import introLength from './Config/introLength';

interface ArticleVideoProps {
	uuid: string
}

export const ArticleVideo: React.FC<ArticleVideoProps> = ({uuid}) => {

	const [handle] = useState(() => delayRender())
	const [article, setArticle] = useState<Article|null>(null)

	useEffect(() => {
		fetch('https://article-saver-api.ggio.fr/remotion/' + uuid).then(articleResponse => {
			articleResponse.json().then(setArticle)
		})
	}, [handle])

	useEffect(() => {
		if (article !== null) {
			continueRender(handle)
		}
	}, [handle, article])

	if (article === null || article.content === null) {
		return null
	}

	const fps = 60
	const durationInFrames = Math.ceil(article.duration * fps) + cueDisplayTime

	const frame = useCurrentFrame()
	const thumbnailOpacity = Math.min(1, interpolate(
		frame,
		[durationInFrames - cueDisplayTime / 2, durationInFrames + introLength],
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
		<Music durationInFrames={durationInFrames} fps={fps} />
		<ContentHandler
			contents={article.content}
			fps={fps}
			from={contentFrom}
			durationInFrames={durationInFrames}
		/>
	</>;
};

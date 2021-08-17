import fetch from 'node-fetch'
import { useEffect, useMemo, useState } from 'react';
import {continueRender, delayRender, Img, interpolate, Sequence, useCurrentFrame} from 'remotion';
import cueDisplayTime from './Config/cueDisplayTime';
import ContentHandler from './ContentHandler';
import Article from './Entity/Article';

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
	const thumbnailOpacity = Math.min(1, interpolate(frame, [durationInFrames - cueDisplayTime / 2, durationInFrames], [1, 0]))

	const contentFrom = 0

	return <>
		<Sequence
			from={contentFrom}
      durationInFrames={durationInFrames}
      name="Fond Noir"
		>
      <div style={{
        backgroundColor: 'black',
        width: '100%',
        height: '100%'
      }} />
		</Sequence>
		<Sequence
			from={contentFrom}
			durationInFrames={durationInFrames}
			name="Fond Miniature"
		>
			<Img src={article.thumbnail} style={{
				opacity: thumbnailOpacity,
				filter: 'blur(20px)',
			}} />
		</Sequence>
		<ContentHandler
			contents={article.content}
			fps={fps}
			from={contentFrom}
			durationInFrames={durationInFrames}
		/>
	</>;
};

import fetch from 'node-fetch'
import { useEffect, useMemo, useState } from 'react';
import {continueRender, delayRender, Sequence} from 'remotion';
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

	const durationInFrames = Math.ceil(article.duration * fps)
	console.log(durationInFrames)

	return (
		<ContentHandler contents={article.content} fps={fps} from={0} />
	);
};

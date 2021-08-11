import fetch from 'node-fetch'
import { useEffect, useState } from 'react';
import {continueRender, delayRender, Sequence} from 'remotion';
import Article from './Entity/Article';

interface ArticleVideoProps {
	uuid: string
}

export const ArticleVideo: React.FC<ArticleVideoProps> = ({uuid}) => {

	const [handle] = useState(() => delayRender())
	const [article, setArticle] = useState<Article|null>(null)

	useEffect(() => {
		fetch('https://article-saver-api.ggio.fr/article/' + uuid).then(articleResponse => {
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

	return (
		<div style={{fontSize: 200}}>
			{article.title}
		</div>
	);
};

import fetch from 'node-fetch'
import { useEffect, useState } from 'react';
import {continueRender, delayRender} from 'remotion';
import Article from './Entity/Article';
import './font.css'
import ArticleHandler from './ArticleHandler';
import FilledArticle from './Entity/FilledArticle';

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

	return <ArticleHandler article={article as FilledArticle} />
};

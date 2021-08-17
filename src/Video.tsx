import {Composition} from 'remotion';
import {ArticleVideo} from './ArticleVideo';
import introLength from './Config/introLength';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="ArticleVideo"
				component={ArticleVideo}
				durationInFrames={12691 + introLength}
				fps={60}
				width={1920}
				height={1080}
				defaultProps={{
					uuid: 'VGh1LCAwOCBKdWwgMjAyMSAxMzoyODowNSArMDAwMA=='
				}}
			/>
		</>
	);
};

import {Composition} from 'remotion';
import {ArticleVideo} from './ArticleVideo';

export const RemotionVideo: React.FC = () => {
	return (
		<>
			<Composition
				id="ArticleVideo"
				component={ArticleVideo}
				durationInFrames={150}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					uuid: 'VGh1LCAwOCBKdWwgMjAyMSAxMzoyODowNSArMDAwMA=='
				}}
			/>
		</>
	);
};

import {Composition, getInputProps} from 'remotion';
import {ArticleVideo} from './ArticleVideo';
import introLength from './Config/introLength';

export const RemotionVideo: React.FC = () => {

	const {durationInFrames, fps} = getInputProps()

	return (
		<>
			<Composition
				id="ArticleVideo"
				component={ArticleVideo}
				durationInFrames={(parseInt(durationInFrames) > 0 ? parseInt(durationInFrames) : 12691) + introLength}
				fps={fps}
				width={1920}
				height={1080}
				defaultProps={{
					uuid: 'VGh1LCAwOCBKdWwgMjAyMSAxMzoyODowNSArMDAwMA=='
				}}
			/>
		</>
	);
};

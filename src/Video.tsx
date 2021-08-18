import {Composition, getInputProps} from 'remotion';
import {ArticleVideo} from './ArticleVideo';
import introLength from './Config/introLength';
import { getDurationInFrames } from './Service/AudioContentDurationCalculator';

export const RemotionVideo: React.FC = () => {

	const {durationInSeconds, fps} = getInputProps()

	return (
		<>
			<Composition
				id="ArticleVideo"
				component={ArticleVideo}
				durationInFrames={(parseFloat(durationInSeconds) > 0 ? getDurationInFrames(parseFloat(durationInSeconds), fps) : 12691) + introLength}
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

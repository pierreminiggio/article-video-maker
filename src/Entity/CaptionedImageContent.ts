import AbstractContent from './AbstractContent';
import ContentType from './ContentType';
import HasAudioContent from './HasAudioContent';
import HasImageContent from './HasImageContent';

export default interface CaptionedImageContent extends AbstractContent, HasAudioContent, HasImageContent {
  type: ContentType.CaptionedImage
  caption: string
}

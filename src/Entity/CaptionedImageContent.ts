import AbstractContent from './AbstractContent';
import ContentType from './ContentType';
import HasImageContent from './HasImageContent';

export default interface CaptionedImageContent extends AbstractContent, HasImageContent {
  type: ContentType.CaptionedImage
  caption: string
}

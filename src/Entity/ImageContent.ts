import AbstractContent from './AbstractContent';
import ContentType from './ContentType';
import HasImageContent from './HasImageContent';

export default interface ImageContent extends AbstractContent, HasImageContent {
  type: ContentType.Image
}

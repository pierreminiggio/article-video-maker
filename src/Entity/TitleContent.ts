import AbstractContent from './AbstractContent';
import ContentType from './ContentType';
import HasStringContent from './HasStringContent';

export default interface TitleContent extends AbstractContent, HasStringContent {
  type: ContentType.Title
}

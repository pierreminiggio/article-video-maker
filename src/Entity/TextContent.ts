import AbstractContent from './AbstractContent';
import ContentType from './ContentType';
import HasStringContent from './HasStringContent';

export default interface TextContent extends AbstractContent, HasStringContent {
  type: ContentType.Text
}

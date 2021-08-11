import AbstractContent from './AbstractContent';
import ContentType from './ContentType';
import HasStringContent from './HasStringContent';

export default interface BlockQuoteContent extends AbstractContent, HasStringContent {
  type: ContentType.BlockQuote
}

import AbstractContent from './AbstractContent';
import ContentType from './ContentType';
import HasAudioContent from './HasAudioContent';
import HasStringContent from './HasStringContent';

export default interface BlockQuoteContent extends AbstractContent, HasAudioContent, HasStringContent {
  type: ContentType.BlockQuote
}

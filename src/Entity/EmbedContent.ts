import AbstractContent from './AbstractContent';
import ContentType from './ContentType';

export default interface EmbedContent extends AbstractContent {
  type: ContentType.Embed
  url: string
}

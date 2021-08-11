import AbstractContent from './AbstractContent';
import ContentType from './ContentType';
import Tweet from './Twitter/Tweet';

export default interface EmbedTwitterContent extends AbstractContent {
  type: ContentType.EmbedTwitter
  main: Tweet
  reply: Tweet|null
  screenshot: string
}

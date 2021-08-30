import AbstractContent from './AbstractContent';
import ContentType from './ContentType';

interface BaseEmbedContent extends AbstractContent {
  type: ContentType.Embed
  url: string
}

interface VideoEmbed {
  video_clip: string
  video_clip_duration: number // in seconds
  video_title: string
}

export interface VideoEmbedContent extends BaseEmbedContent, VideoEmbed {}

export default interface EmbedContent extends BaseEmbedContent, Partial<VideoEmbed> {}

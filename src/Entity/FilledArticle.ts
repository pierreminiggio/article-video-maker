import Article from './Article';
import Content from './Content';

export default interface FilledArticle extends Article {
  content: Array<Content>
}

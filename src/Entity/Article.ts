import Content from './Content';

export default interface Article {
  uuid: string
  title: string
  description: string
  link: string
  thumbnail: string
  content: Array<Content>|null
}

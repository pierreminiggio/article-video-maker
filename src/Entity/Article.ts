import Content from './Content';

export default interface Article {
  uuid: string
  title: string
  description: string
  link: string
  thumbnail: string
  duration: number // float
  content: Array<Content>|null
}

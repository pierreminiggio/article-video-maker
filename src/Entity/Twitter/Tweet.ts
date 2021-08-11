import HasStringContent from '../HasStringContent';
import Author from './Author';

export default interface Tweet extends HasStringContent {
  author: Author
}

import HasAudioContent from '../HasAudioContent';
import HasStringContent from '../HasStringContent';
import Author from './Author';

export default interface Tweet extends HasAudioContent, HasStringContent {
  author: Author
}

import Article from '../../../../../lib/article';

export default interface AdminState {
  articleTotal: number;
  articleList: Article[];
  article?: Article;
}
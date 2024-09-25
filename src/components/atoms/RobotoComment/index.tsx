import styles from './index.module.css';

interface IRobotoComment {
  comment: string;
}

export const RobotoComment = ({ comment }: IRobotoComment) => (
  <p className={styles['roboto-comment']}>{comment}</p>
);

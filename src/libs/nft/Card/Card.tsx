import { ReactNode } from 'react';
import styles from './Card.module.css';

export interface CardProps {
  header: ReactNode;
  description: ReactNode;
}

export function Card(props: CardProps) {
  const { header, description } = props;
  return (
    <div className={styles['card-root']}>
      {header}
      {description}
    </div>
  );
}

export default Card;

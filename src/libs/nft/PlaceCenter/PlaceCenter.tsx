import { HTMLAttributes, ReactNode } from 'react';
import styles from './PlaceCenter.module.css';

export interface PlaceCenterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function PlaceCenter(props: PlaceCenterProps) {
  const { children, className = '', style } = props;
  return (
    <div
      className={`${styles['place-center-root']} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export default PlaceCenter;

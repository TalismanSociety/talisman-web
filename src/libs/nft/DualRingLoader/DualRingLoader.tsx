import { HTMLAttributes } from 'react';
import styles from './DualRingLoader.module.css';

export function DualRingLoader(props: HTMLAttributes<HTMLDivElement>) {
  const { className = '', style } = props;
  return (
    <div className={`${styles['lds-dual-ring']} ${className}`} style={style} />
  );
}

export default DualRingLoader;

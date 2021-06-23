import { ReactComponent as Loader } from '@icons/loader.svg'

const Pendor = 
  ({
    prefix='',
    suffix='',
    children
  }) => 
    children !== null && children !== undefined 
      ? <>{prefix}{children}{suffix}</>
      : <Loader/>
  

export default Pendor
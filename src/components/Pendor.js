import { ReactComponent as Loader } from '@icons/loader.svg'

const Pendor = 
  ({
    prefix='',
    suffix='',
    require,
    loader,
    children
  }) => {
    // undefined not set? await children
    // require is explicitly set to false
    return (require === undefined && !children) || require === false 
        ? loader || <Loader/>
        : <>{prefix}{children}{suffix}</>
  }
  

export default Pendor
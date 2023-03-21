const template = (variables, { tpl }) => {
  return tpl`
${variables.imports};
import {IconContext} from "../context";

${variables.interfaces};

const ${variables.componentName} = (props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: number | string }, ref: Ref<SVGSVGElement>) => {
  const iconContext = React.useContext(IconContext);
  return (${variables.jsx});
};
 
${variables.exports};
`
}

module.exports = template

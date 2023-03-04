const template = (variables, { tpl }) => {
  return tpl`
${variables.imports};

${variables.interfaces};

const ${variables.componentName} = (props: Omit<SVGProps<SVGSVGElement>, 'width' | 'height'> & { size?: number | string }, ref: Ref<SVGSVGElement>) => (
  ${variables.jsx}
);
 
${variables.exports};
`
}

module.exports = template

import "./Button.css"

export default function Button({style,children, ...props}){
  return(<button {...props} className={`button ${style === 'filled' ? 'filled' : 'empty'}`}>
    {children}
  </button>);
};
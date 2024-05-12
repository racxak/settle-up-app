import "./Button.css"

export default function Button({style,children, ...props}){
  return(<button onClick={props.onClick} className={` ${props.className} button ${style === 'filled' ? 'filled' : 'empty'}`}>
    {children}
  </button>);
};
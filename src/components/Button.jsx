import "./Button.css"

export default function Button({style,children}){
  return(<button className={`button ${style === 'filled' ? 'filled' : 'empty'}`}>
    {children}
  </button>);
};
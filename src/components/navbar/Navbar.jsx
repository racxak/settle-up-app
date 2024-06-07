import "./Navbar.css"
export default function Navbar({children}){
  return(
    <div id="page-header">
     <h1>SETTLEUP</h1>
      <div className='divider'> </div>
      {children}
      </div>
    );
};
import React from 'react';
import "./ComponetCSS/Header.css";
import { useNavigate } from 'react-router-dom';
function Header() {
   
   const navigate = useNavigate();
  return (
    <header className='header'>
      <div className='header__logo'>
        <img src="https://cdn-icons-png.flaticon.com/512/888/888879.png" alt="Company Logo" />
      </div>

      <div className='header__search'>
        <input type="text" placeholder='Search Ha-geez' aria-label="Search input" />
        <button aria-label="Search button">
          <img
            src="https://th.bing.com/th/id/R.2f03465fd1f1d262321bdf0181b6e933?rik=7BOMj3z74H7qsw&pid=ImgRaw&r=0"
            alt="Search Icon"
          />
        </button>
      </div>

      <nav className='header__nav'>
        <div className='header__option' onClick={()=>{navigate("/login")}}>Sing-in</div>
      </nav>
    </header>
  );
}

export default Header;

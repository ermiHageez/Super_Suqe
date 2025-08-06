import React from 'react'
import { useNavigate} from 'react-router-dom'
import "./ComponetCSS/Catagories.css"
function Catagories() {
    const navigate = useNavigate();
    const handleCategoryClick = (categoryId) => {
        navigate(`/category/${categoryId}`);
    };
  return (
    <>
   <div className="btn_container">
      <div onClick={() => handleCategoryClick("Home")}>
        {/* <img src="https://cdn0.iconfinder.com/data/icons/set-app-incredibles/24/Home-01-1024.png" alt="" /> */}
        <p>Hot Seller</p>
     </div>
    <div onClick={() => handleCategoryClick("electronics")}>
        {/* <img src="https://cdn1.iconfinder.com/data/icons/computer-technology-57/62/computer-desktop-device-monitor-electronics-1024.png" alt="" /> */}
       <p>Electronics</p>
    </div>
    <div onClick={() => handleCategoryClick("Fashion")}>
        {/* <img src="https://cdn0.iconfinder.com/data/icons/mobile-basic-vol-1/32/Tote_Bag-1024.png" alt="" /> */}
        <p>Fashion</p>
    </div>
    <div onClick={() => handleCategoryClick("Books")}>
        {/* <img src="https://cdn1.iconfinder.com/data/icons/self-care-during-self-quarantine/512/mind-care-08-1024.png" alt="" /> */}
        <p>Books</p>
    </div>
    <div onClick={() => handleCategoryClick("Toys")}>
        {/* <img src="https://cdn2.iconfinder.com/data/icons/toys-56/120/toys1-01-1024.png" alt="" /> */}
        <p>Toys</p>
    </div>
      <div onClick={() => handleCategoryClick("Toys")}>
        {/* <img src="https://cdn2.iconfinder.com/data/icons/toys-56/120/toys1-01-1024.png" alt="" /> */}
        <p>Home </p>
    </div>
      <div onClick={() => handleCategoryClick("Toys")}>
        {/* <img src="https://cdn2.iconfinder.com/data/icons/toys-56/120/toys1-01-1024.png" alt="" /> */}
        <p>Furnitures</p>
    </div>
      <div onClick={() => handleCategoryClick("Toys")}>
        {/* <img src="https://cdn2.iconfinder.com/data/icons/toys-56/120/toys1-01-1024.png" alt="" /> */}
        <p>Clothes</p>
    </div>
  
   </div>
    </>
  )
}

export default Catagories
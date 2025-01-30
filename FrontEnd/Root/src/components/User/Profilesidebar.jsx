import React from "react";
import { userLogout } from "../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";
import { Link } from "react-router-dom";

function Profilesidebar() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  console.log(auth,'sdf');
  
  const logoutHandler = async () => {
    const response = await userLogout(auth.token,auth.refreshToken);
    console.log(response.data.message,'xf');

    if (response.status == 200 || response.data.message ==='Invalid or expired refresh token' ) {
      dispatch(logout());
    }
  };
  return (
    <div className="bg-gray-800 h-screen p-4 flex flex-col space-y-5">
  <Link to={'/portfolio'}>
    <button className="w-full py-5 text-white border border-gray-500 rounded hover:bg-gray-700">
      Portfolio
    </button>
  </Link>
  <Link to={'/order'}>
    <button className="w-full py-5 text-white border border-gray-500 rounded hover:bg-gray-700">
      Orders
    </button>
  </Link>
  <Link to={'/watchlist'}>
    <button className="w-full py-5 text-white border border-gray-500 rounded hover:bg-gray-700">
      Watchlist
    </button>
  </Link>
  <Link to={'/wallet'}>
    <button className="w-full py-5 text-white border border-gray-500 rounded hover:bg-gray-700">
      Wallet
    </button>
  </Link>
  <Link to={'/contactus'}>
    <button className="w-full py-5 text-white border border-gray-500 rounded hover:bg-gray-700">
      Contact us
    </button>
  </Link>
  <button 
    className="w-full py-5 text-white border border-gray-500 rounded hover:bg-gray-700" 
    onClick={logoutHandler}
  >
    LogOut
  </button>
</div>

  );
}

export default Profilesidebar;

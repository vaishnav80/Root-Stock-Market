import React from "react";
import { userLogout } from "../../actions/user";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice";

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
    <div className="bg-gray-800 h-screen p-4 flex flex-col">
      <button className="w-full py-5 my-5 mt-8 text-white border border-gray-500 rounded">
        Portfolio
      </button>
      <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">
        Orders
      </button>
      <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">
        Watchlist
      </button>
      <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">
        Wallet
      </button>
      <button className="w-full py-5 my-5 text-white border border-gray-500 rounded">
        Contact us
      </button>
      <button className="w-full py-5 my-5 text-white border border-gray-500 rounded" onClick={logoutHandler}>
        LogOut
      </button>
    </div>
  );
}

export default Profilesidebar;

import React from "react";
import Profilesidebar from "../../components/User/Profilesidebar";
import ProfileSection from "../../components/User/Profilesection";
import { useSelector } from "react-redux";
import Header from "../../components/User/Header";

function Profile() {
    const user = useSelector((action)=>{action.auth})
  return (
    <>
    <Header/>
    <div className="flex">
      <div className="w-1/4">
        <Profilesidebar />
      </div>
      <div className="w-3/4">
        <ProfileSection />
      </div>
    </div>
    </>
  );
}

export default Profile;

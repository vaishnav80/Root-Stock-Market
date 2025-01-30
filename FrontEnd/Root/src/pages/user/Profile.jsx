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
<div className="flex flex-col md:flex-row">
  <div className="w-full md:w-1/4">
    <Profilesidebar />
  </div>
  <div className="w-full md:w-3/4">
    <ProfileSection />
  </div>
</div>
    </>
  );
}

export default Profile;

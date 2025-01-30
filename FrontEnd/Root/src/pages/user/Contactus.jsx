import React from "react";
import Profilesidebar from "../../components/User/Profilesidebar";
import ChatWithAdmin from "../../components/User/ContactComponent";
import Header from "../../components/User/Header";
import AdminUserChat from "../../components/User/ContactComponent";

function Contactus() {

  return (
    <>
      <div>
  <Header />
  <div className="flex flex-col md:flex-row">
    <div className="w-full md:w-1/4">
      <Profilesidebar />
    </div>
    <div className="w-full md:w-3/4">
      <AdminUserChat />
    </div>
  </div>
</div>

    </>
  );
}

export default Contactus;

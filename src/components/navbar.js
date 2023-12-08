import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "../../firebaseConfig";
import getUserInfo from "../hooks/getUserInfo";

const Navbar = () => {
  const buttonStyle = "pr-5 text-2xl hover:text-blue-600";
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, [auth]);

  React.useEffect(() => {
    async function loadUserInfo() {
      try {
        const userInformation = await getUserInfo();
        setUserInfo(userInformation);
        // ... rest of your code ...
      } catch {
        console.log("Failed to get user info.");
      }
    }
    loadUserInfo();
  }, []);

  return (
    <div className="w-full flex justify-between items-center bg-blue-500 fixed top-0 z-50 border-b-2 border-white h-20">
      <h1 className="text-4xl pl-10">Good NeighUBors</h1>
      {user && (
        <div className="links flex space-x-4">
          {userInfo && userInfo.accountType !== "Basic User" && (
            <Link className={buttonStyle} href="/homepage">
              Home
            </Link>
          )}
          <Link className={buttonStyle} href="/about">
            About
          </Link>
          <Link className={buttonStyle} href="/profile">
            Profile
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;

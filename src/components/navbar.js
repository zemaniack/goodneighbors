import Link from "next/link";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { app } from "../../firebaseConfig";

const Navbar = () => {
  const padding = "pr-5";
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, [auth]);

  return (
    <div className="w-full h-10 flex justify-between items-center bg-blue-500 fixed top-0 z-50 border-b-2 border-white">
      <h1 className="text-2xl pl-10">Good NeighUBors</h1>
      {user && (
        <div className="links flex space-x-4">
          <Link className={padding} href="/homepage">
            Home
          </Link>
          <Link className={padding} href="/about">
            About
          </Link>
          <Link className={padding} href="/profile">
            Profile
          </Link>
          <Link className={padding} href="/settings">
            Settings
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;

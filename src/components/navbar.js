import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="w-full h-10vh flex">
      <h1>Good NeighUBors</h1>
      <div className="links">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/profile">Profile</Link>
        <Link href="/settings">Settings</Link>
      </div>
    </div>
  );
};

export default Navbar;

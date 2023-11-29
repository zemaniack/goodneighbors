import React from "react";
import { FaUser } from "react-icons/fa";

const ProfileCard = (user) => {
  // Get the user's display name, username, and profile pic
  const displayName = user.displayName;
  const username = user.username;
  const profilePic = user.profilePic;

  // Return the JSX for the profile card
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {profilePic ? <img src={profilePic} alt="Profile" /> : <FaUser />}
      <div className="p-4">
        <div className="text-lg text-black font-bold ">{displayName}</div>
        <div className="text-sm text-black">
          {username ? "@" + username : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

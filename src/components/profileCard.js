import React from "react";
import { FaUser } from "react-icons/fa";

const ProfileCard = (user) => {
  // Get the user's display name, username, and profile pic
  const displayName = user.displayName;
  const username = user.username;
  const profilePic = user.profilePic;

  // Return the JSX for the profile card
  return (
    <div
      className="rounded-lg shadow-lg overflow-hidden p-5"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        // borderRadius: "5px",
      }}
    >
      {/* {profilePic ? <img src={profilePic} alt="Profile" /> : <FaUser />} */}
      <br />
      <div
        style={{ display: "flex", justifyContent: "center", fontSize: "3em" }}
      >
        <FaUser style={{ color: "white" }} />
      </div>
      <div className="p-4">
        <div className="text-lg text-white font-bold ">{displayName}</div>
        <div className="text-sm text-white">
          {username ? "@" + username : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

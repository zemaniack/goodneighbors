import React from "react";
import { FaUser } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { db, storage, ref } from "../../firebaseConfig";
import { useEffect } from "react";

const ProfileCard = ({ user, accountPage = false }) => {
  // Get the user's display name, username, and profile pic
  // const user = props.userProp;
  // const accountPage = props.accountPageProp;

  const displayName = user.displayName;
  const username = user.username;
  let profilePic = user.profilePic;

  // Function to edit the profile picture
  const editProfilePicture = async () => {
    // get the file from the user
    const file = document.getElementById("profilePicInput").files[0];

    // check if a file was selected
    if (!file) {
      console.error("No file selected");
      return;
    }

    // create a reference to the location where you want to upload the file
    const fileRef = ref(storage, `profilePics/${file.name}`);

    // upload the file to Firebase Storage
    try {
      const snapshot = await uploadBytesResumable(storageRef, file);
      console.log("Uploaded a blob or file!");

      // set the url of the image to the user profile in the user collection
      const url = await getDownloadURL(storageRef);
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        profilePic: url,
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // Function to open the file selection dialog
  const openFileSelection = () => {
    const fileInput = document.getElementById("profilePicInput");
    fileInput.click();
  };

  // Function to handle file selection
  const handleFileSelection = () => {
    const file = document.getElementById("profilePicInput").files[0];
    if (file) {
      editProfilePicture(file);
    }
  };

  // Add the handleFileSelection function as an event listener for the file input
  useEffect(() => {
    const fileInput = document.getElementById("profilePicInput");
    fileInput.addEventListener("change", handleFileSelection);
    return () => {
      fileInput.removeEventListener("change", handleFileSelection);
    };
  }, []);

  // Return the JSX for the profile card
  return (
    <div
      className="rounded-lg shadow-lg overflow-hidden p-5"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        // borderRadius: "5px",
      }}
    >
      <br />
      <div
        style={{
          position: "relative",
          justifyContent: "center",
          fontSize: "3em",
          width: "100%",
        }}
      >
        <div
          style={{
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid white",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {profilePic ? (
            <img src={profilePic} alt="Profile" style={{ width: "100%" }} />
          ) : (
            <FaUser />
          )}
          <input type="file" id="profilePicInput" style={{ display: "none" }} />
        </div>
        {accountPage ? (
          <div
            style={{
              cursor: "pointer",
              color: "white",
              fontSize: "0.5em",
              position: "absolute",
              top: "-1em",
              right: "1em",
            }}
            onClick={openFileSelection}
          >
            <MdModeEdit />
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <br />
        <div className="text-lg text-white font-bold ">{displayName}</div>
        <div className="text-sm text-white">
          {username ? "@" + username : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

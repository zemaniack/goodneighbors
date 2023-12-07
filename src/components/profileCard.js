"use client";
import React from "react";
import { FaUser } from "react-icons/fa";
import { MdModeEdit } from "react-icons/md";
import { db, storage } from "../../firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useState, useEffect } from "react";

const ProfileCard = ({ user, accountPage = false }) => {
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    setUserInfo(user);
  }, [user]);

  const getSnapshot = async () => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    console.log("snap", querySnapshot);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0];
    }
    return null;
  };

  // Function to edit the profile picture
  const editProfilePicture = async () => {
    const file = document.getElementById("profilePicInput").files[0];
    if (!file) {
      console.error("No file selected");
      return;
    }

    const storageRef = ref(storage, `profilePics/${file.name}`);

    // upload the file to Firebase Storage
    try {
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded a blob or file!");

      // set the url of the image to the user profile in the user collection
      const url = await getDownloadURL(storageRef);
      const docSnap = await getSnapshot();
      await updateDoc(doc(db, "users", docSnap.id), {
        profilePic: url,
      })
        .then(() => {
          console.log("Document successfully updated!");
          setUserInfo((prev) => {
            return { ...prev, profilePic: url };
          });
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
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
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid white",
            position: "relative",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 0%)",
          }}
        >
          {userInfo?.profilePic ?? false ? (
            <img
              src={userInfo.profilePic}
              alt="Profile"
              style={{ width: "100%" }}
            />
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <FaUser />
            </div>
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
              top: "0",
              right: "0.1em",
            }}
            onClick={openFileSelection}
          >
            <MdModeEdit />
          </div>
        ) : null}
      </div>
      <div className="p-4">
        <div className="text-lg text-white font-bold ">
          {userInfo
            ? userInfo.firstName + " " + userInfo.lastName
            : "loading..."}
        </div>
        <div className="text-sm text-white">
          @{userInfo ? userInfo.username : "loading..."}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

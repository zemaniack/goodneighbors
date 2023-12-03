"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { app, db } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  doc,
  setDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProfileCard from "../../components/profileCard";
import { getUserInfo } from "../../hooks/getUserInfo";
import { Button, Modal, Dropdown, Space } from "antd";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";

const ProfileScreen = () => {
  const router = useRouter();
  router.prefetch("/settings");

  // Profile information states
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [accountType, setAccountType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNumber, setEmergencyContactNumber] = useState("");
  const [emergencyContactEmail, setEmergencyContactEmail] = useState("");
  const [numberOfChildren, setNumberOfChildren] = useState("");
  const [numberOfAdults, setNumberOfAdults] = useState("");
  const [numberOfPets, setNumberOfPets] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // Modal usage state
  const [modalVisible, setModalVisible] = useState(false);

  // Dropdown items
  const items = [
    {
      key: "1",
      label: "Basic User",
    },
    {
      key: "2",
      label: "Volunteer",
    },
    {
      key: "3",
      label: "Authority",
    },
    {
      key: "4",
      label: "Authority Coordinator",
    },
  ];

  // Instantiation of auth
  const auth = getAuth(app);
  console.log(auth.currentUser);

  // When page loads, get user information
  useEffect(() => {
    const loadData = async () => {
      if (auth.currentUser) {
        const docSnap = await getSnapshot();

        if (docSnap) {
          const data = docSnap.data();
          setEmail(data?.email ?? "");
          setUsername(data?.username ?? "");
          setAddress(data?.address ?? "");
          setAccountType(data?.accountType ?? "");
          setPhoneNumber(data?.phoneNumber ?? "");
          setDob(data?.dob ?? "");
          setEmergencyContactName(data?.emergencyContactName ?? "");
          setEmergencyContactNumber(data?.emergencyContactNumber ?? "");
          setEmergencyContactEmail(data?.emergencyContactEmail ?? "");
          setNumberOfChildren(data?.numberOfChildren ?? "");
          setNumberOfAdults(data?.numberOfAdults ?? "");
          setNumberOfPets(data?.numberOfPets ?? "");
          setFirstName(data?.firstName ?? "");
          setLastName(data?.lastName ?? "");
        } else {
          console.log("No such document!");
        }
      }
    };
    auth.onAuthStateChanged(loadData);
  }, []);

  const getSnapshot = async () => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    console.log("snap", querySnapshot);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0];
    }
    return null;
  };

  const onClick = ({ key }) => {
    setAccountType(items[key - 1].label);
  };

  const handleSave = async () => {
    const docSnap = await getSnapshot();

    await updateDoc(doc(db, "users", docSnap.id), {
      email: email,
      username: username,
      address: address,
      accountType: accountType,
      phoneNumber: phoneNumber,
      dob: dob,
      emergencyContactName: emergencyContactName,
      emergencyContactNumber: emergencyContactNumber,
      emergencyContactEmail: emergencyContactEmail,
      numberOfChildren: numberOfChildren,
      numberOfAdults: numberOfAdults,
      numberOfPets: numberOfPets,
      firstName: firstName,
      lastName: lastName,
    })
      .then(() => {
        console.log("Document successfully written!");
        router.push("/Profile");
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const uploadPhoto = async () => {
    const uri = await pickImage();
    if (uri !== null) {
      const url = await uploadImage(uri);
      setProfilePicture(url);
    }
  };

  const modalContent = () => {
    return (
      <div className="flex flex-col">
        <h2 className="text-xl font-bold">Personal Information</h2>
        <label className="font-bold pl-2">First Name</label>
        <input
          type="text"
          placeholder="Jane"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Last Name</label>
        <input
          type="text"
          placeholder="Smith"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        {/* </div> */}
        <label className="font-bold pl-2">Email</label>
        <input
          type="email"
          placeholder="email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Username</label>
        <input
          type="text"
          placeholder="BuffaloBillsFan123"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Address</label>
        <input
          type="text"
          placeholder="123 Street Name, County, State Zip"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Account Type</label>
        <Dropdown
          menu={{ items, onClick }}
          className="border-gray-400 border-2 rounded p-1 pl-2 w-100"
        >
          <Space>
            Account Type <DownOutlined /> | {accountType}
          </Space>
        </Dropdown>
        <label className="font-bold pl-2">Phone Number</label>
        <input
          type="tel"
          placeholder="(123)-456-7890"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Date of Birth</label>
        <input
          type="date"
          placeholder="January 1, 2000"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <br />

        <h2 className="text-xl font-bold">Household Information</h2>
        <p>
          This information will be used to help first responders determine the
          number of people and pets that may need assistance during a disaster
          situation.
        </p>
        <label className="font-bold pl-2">Number of Adults</label>
        <input
          type="number"
          placeholder="2"
          value={numberOfAdults}
          onChange={(e) => setNumberOfAdults(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Number of Children</label>
        <input
          type="number"
          placeholder="3"
          value={numberOfChildren}
          onChange={(e) => setNumberOfChildren(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Number of Pets</label>
        <input
          type="number"
          placeholder="Number of Pets"
          value={numberOfPets}
          onChange={(e) => setNumberOfPets(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <br />

        <h2 className="text-xl font-bold">Emergency Contact Information</h2>
        <p>
          This will be used only in emergency situations, such as being
          incapacitated or unable to be reached during a disaster situation.
        </p>
        <label className="font-bold pl-2">Emergency Contact Name</label>
        <input
          type="text"
          placeholder="John Smith"
          value={emergencyContactName}
          onChange={(e) => setEmergencyContactName(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Emergency Contact Number</label>
        <input
          type="tel"
          placeholder="(123)-456-7890"
          value={emergencyContactNumber}
          onChange={(e) => setEmergencyContactNumber(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
        <label className="font-bold pl-2">Emergency Contact Email</label>
        <input
          type="email"
          placeholder="email@email.com"
          value={emergencyContactEmail}
          onChange={(e) => setEmergencyContactEmail(e.target.value)}
          className="border-gray-400 border-2 rounded p-1 pl-2"
        />
      </div>
    );
  };

  const accountInfo = () => {
    return (
      <div>
        <h1 className="text-2xl font-bold border-b-2 border-white">
          Account Information
        </h1>
        <br />
        <div
          className="rounded-lg shadow-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            // borderRadius: "5px",
          }}
        >
          <h2 className="text-xl font-bold">Personal Information</h2>
          <p className="text-l">First Name: {firstName}</p>
          <p>Last Name: {lastName}</p>
          <p>Email: {email}</p>
          <p>Username: {username}</p>
          <p>Address: {address}</p>
          <p>Account Type: {accountType}</p>
          <p>Phone Number: {phoneNumber}</p>
          <p>Date of Birth: {dob}</p>
        </div>
        <br />
        <div
          className="rounded-lg shadow-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            // borderRadius: "5px",
          }}
        >
          <h2 className="text-xl font-bold">Household Information</h2>
          <p>Number of Adults: {numberOfAdults}</p>
          <p>Number of Children: {numberOfChildren}</p>
        </div>
        <br />
        <div
          className="rounded-lg shadow-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            // borderRadius: "5px",
          }}
        >
          <h2 className="text-xl font-bold">Emergency Contact Information</h2>
          <p>Emergency Contact Name: {emergencyContactName}</p>
          <p>Emergency Contact Number: {emergencyContactNumber}</p>
          <p>Emergency Contact Email: {emergencyContactEmail}</p>
        </div>
        <br />
        <div
          className="font-bold rounded-full h-auto w-auto flex bg-blue-700 p-2 cursor-pointer items-center justify-center"
          onClick={() => setModalVisible(true)}
        >
          Edit account information
        </div>
        <br />
      </div>
    );
  };

  const handleOk = () => {
    setModalVisible(false);
    handleSave();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      <div className="flex flex-wrap w-full flex-row justify-around items-center mx-auto m-0">
        <div className="h-full flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold border-b-2 border-white">
            Your Public Profile
          </h1>
          <br />
          <ProfileCard
            user={{
              displayName: firstName + " " + lastName,
              username: username,
              profilePic: profilePicture,
            }}
            accountPage={true}
          />
          <br />
          <div
            className="font-bold rounded-full h-auto w-auto flex bg-blue-700 p-2 cursor-pointer items-center justify-center"
            onClick={() => router.push("/settings")}
          >
            Go to settings
          </div>
          <br />
        </div>
        <div className="h-full d-flex flex-column justify-content-center">
          {/* <h1 className="text-xl">Your Account Information</h1> */}
          {accountInfo()}
        </div>
      </div>
      <Modal
        open={modalVisible}
        title={
          <h2 className="text-xl font-bold border-b border-gray-400">
            Edit Account Information
          </h2>
        }
        footer={[
          <Button
            key="submit"
            type="primary"
            style={{ background: "#1677FF" }}
            onMouseEnter={(e) => (e.target.style.background = "#4096ff")}
            onMouseLeave={(e) => (e.target.style.background = "#1677FF")}
            onClick={() => handleOk()}
          >
            Save
          </Button>,
          <Button key="back" onClick={() => setModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {modalContent()}
      </Modal>
    </div>
  );
};

export default ProfileScreen;

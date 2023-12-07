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
  onSnapshot,
  addDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ProfileCard from "../../components/profileCard";
import { Button, Modal, Dropdown, Space } from "antd";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import getUserInfo from "../../hooks/getUserInfo";
import fetchNeeds from "@/hooks/fetchNeeds";
import { MdModeEdit } from "react-icons/md";
import getCoordinates from "../../hooks/coordinatesFetcher";

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
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [urgency, setUrgency] = useState("");
  const [needName, setNeedName] = useState("");
  const [needDescription, setNeedDescription] = useState("");
  const [needs, setNeeds] = useState([]);

  // Modal usage state
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [needModalVisible, setNeedModalVisible] = useState(false);

  // Dropdown items for user account type
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

  // Dropdown items for urgency of need
  const urgencyItems = [
    {
      key: "1",
      label: "Preparation",
    },
    {
      key: "2",
      label: "Upcoming",
    },
    {
      key: "3",
      label: "Urgent",
    },
  ];

  // Instantiation of auth
  const auth = getAuth(app);

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

        setUserInfo(await getUserInfo());
        setLoading(false);
        setNeeds(await fetchNeeds(auth.currentUser.uid));
      }
    };
    auth.onAuthStateChanged(loadData);
  }, []);

  const getSnapshot = async () => {
    const userRef = collection(db, "users");
    const q = query(userRef, where("uid", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0];
    }
    return null;
  };

  const onClick = ({ key }) => {
    setAccountType(items[key - 1].label);
  };

  const onClickUrgency = ({ key }) => {
    setUrgency(urgencyItems[key - 1].label);
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
        setUserInfo((prev) => {
          return {
            ...prev,
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
          };
        });
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const handleNewNeed = async () => {
    let coords = await getCoordinates(address);
    console.log(coords);
    const needRef = collection(db, "needs");
    const newNeed = await addDoc(needRef, {
      uid: auth.currentUser.uid,
      name: needName,
      description: needDescription,
      urgency: urgency,
      dateRequested: new Date(),
      fulfillment: false,
      location: coords,
    })
      .then((docRef) => {
        console.log("Document successfully written!");
        setNeedName("");
        setNeedDescription("");
        setUrgency("");
        // Update the needs state with the new need
        setNeeds((prevNeeds) => [
          ...prevNeeds,
          {
            id: docRef.id,
            uid: auth.currentUser.uid,
            name: needName,
            description: needDescription,
            urgency: urgency,
            dateRequested: new Date(),
            fulfillment: false,
            location: coords,
          },
        ]);
      })
      .catch((error) => {
        console.error("Error writing document: ", error);
      });
  };

  const AccountInfo = () => {
    return (
      <div className="h-full flex flex-col justify-center items-center p-10">
        <h1 className="text-2xl font-bold border-b-2 border-white">
          Account Information
        </h1>
        <div>
          <br />
          <div
            className="rounded-lg shadow-lg overflow-hidden p-5"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              // borderRadius: "5px",
            }}
          >
            <h2 className="text-xl font-bold">Personal Information</h2>
            <p>
              <span className="font-bold">First Name:</span> {firstName}
            </p>
            <p>
              <span className="font-bold">Last Name:</span> {lastName}
            </p>
            <p>
              <span className="font-bold">Email:</span> {email}
            </p>
            <p>
              <span className="font-bold">Username:</span> {username}
            </p>
            <p>
              <span className="font-bold">Address:</span> {address}
            </p>
            <p>
              <span className="font-bold">Account Type:</span> {accountType}
            </p>
            <p>
              <span className="font-bold">Phone Number:</span> {phoneNumber}
            </p>
            <p>
              <span className="font-bold">Date of Birth:</span> {dob}
            </p>
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
            <p>
              <span className="font-bold">Emergency Contact Name:</span>{" "}
              {emergencyContactName}
            </p>
            <p>
              <span className="font-bold">Emergency Contact Number:</span>{" "}
              {emergencyContactNumber}
            </p>
            <p>
              <span className="font-bold">Emergency Contact Email:</span>{" "}
              {emergencyContactEmail}
            </p>
          </div>
          <br />
          <div
            className="font-bold rounded-full shadow-lg h-auto w-auto flex p-2 cursor-pointer items-center justify-center"
            onClick={() => setEditModalVisible(true)}
            style={{
              background: "#1677FF",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#4096ff")}
            onMouseLeave={(e) => (e.target.style.background = "#1677FF")}
          >
            Edit account information
          </div>
          <br />
        </div>
      </div>
    );
  };

  const handleEditOk = () => {
    setEditModalVisible(false);
    handleSave();
  };

  const handleNeedOk = () => {
    setNeedModalVisible(false);
    handleNewNeed();
  };

  const PublicProfile = () => {
    return (
      <div className="h-full flex flex-col justify-center items-center p-10">
        <h1 className="text-2xl font-bold border-b-2 border-white">
          Your Public Profile
        </h1>
        <br />
        {!loading && <ProfileCard user={userInfo} accountPage={true} />}
        <br />
        <div
          className="font-bold rounded-full shadow-lg h-auto w-auto flex p-2 cursor-pointer items-center justify-center"
          onClick={() => router.push("/settings")}
          style={{
            background: "#1677FF",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#4096ff")}
          onMouseLeave={(e) => (e.target.style.background = "#1677FF")}
        >
          Go to settings
        </div>
        <br />
      </div>
    );
  };

  const UserNeeds = () => {
    return (
      <div
        className="h-full p-10 flex flex-col justify-center align-center items-center flex-wrap"
        style={{ width: "60%" }}
      >
        <h1 className="text-2xl font-bold border-b-2 border-white">
          Your Needs
        </h1>
        <br />
        <div
          className="rounded-lg shadow-lg overflow-hidden p-5 m-2 w-full"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          }}
        >
          <div className="flex flex-wrap overflow-auto">
            {needs.map((need) => {
              let date;
              if (need.dateRequested instanceof Date) {
                date = need.dateRequested;
              } else if (need.dateRequested.toDate) {
                date = need.dateRequested.toDate();
              } else {
                date = new Date(need.dateRequested);
              }
              const dateString = date.toISOString().split("T")[0];
              return (
                <div
                  className="flex flex-col flex-grow justify-around rounded-lg shadow-lg overflow-hidden p-2 m-2"
                  style={{
                    maxWidth: "300px",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    width: "250px",
                  }}
                >
                  <h2 className="text-xl font-bold border-b-2 border-white flex flex-row justify-between">
                    {need.name}
                    <MdModeEdit />
                  </h2>
                  <div>
                    <span className="font-bold">Description:</span>{" "}
                    {need.description}
                  </div>
                  <div>
                    <span className="font-bold">Urgency:</span> {need.urgency}
                  </div>
                  <div>
                    <span className="font-bold">Date Requested:</span>{" "}
                    {dateString}
                  </div>
                  <div>
                    <span className="font-bold">Fulfilled:</span>{" "}
                    {need.fulfillment ? "Yes" : "No"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <br />
        <div
          className="font-bold rounded-full shadow-lg h-auto w-auto flex p-2 cursor-pointer items-center justify-center"
          onClick={() => setNeedModalVisible(true)}
          style={{
            background: "#1677FF",
          }}
          onMouseEnter={(e) => (e.target.style.background = "#4096ff")}
          onMouseLeave={(e) => (e.target.style.background = "#1677FF")}
        >
          Add a Need
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700 overflow-y-auto">
      <div className="flex flex-row w-full justify-around items-start mx-auto m-0">
        <PublicProfile />
        <AccountInfo />
        <UserNeeds />
      </div>
      <>
        <Modal
          open={editModalVisible}
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
              onClick={() => handleEditOk()}
            >
              Save
            </Button>,
            <Button key="back" onClick={() => setEditModalVisible(false)}>
              Close
            </Button>,
          ]}
          onCancel={() => setEditModalVisible(false)}
        >
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
            <p>
              We need your address to be able to recieve emergency and disaster
              alerts for your area and assistance from volunteers around your
              neighborhood. This information will only be visible to
              authorities.
            </p>
            <input
              type="text"
              placeholder="123 Street Name, City, State, Zip"
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
        </Modal>
        <Modal
          open={needModalVisible}
          title={
            <h2 className="text-xl font-bold border-b border-gray-400">
              Add a Need
            </h2>
          }
          footer={[
            <Button
              key="submit"
              type="primary"
              style={{ background: "#1677FF" }}
              onMouseEnter={(e) => (e.target.style.background = "#4096ff")}
              onMouseLeave={(e) => (e.target.style.background = "#1677FF")}
              onClick={() => handleNeedOk()}
            >
              Save
            </Button>,
            <Button key="back" onClick={() => setNeedModalVisible(false)}>
              Close
            </Button>,
          ]}
          onCancel={() => setNeedModalVisible(false)}
        >
          <div className="flex flex-col">
            <h2 className="text-l font-bold">Name for your need</h2>
            <input
              type="text"
              placeholder="Generator"
              className="border-gray-400 border-2 rounded p-1 pl-2"
              onChange={(e) => setNeedName(e.target.value)}
            />
            <h2 className="text-l font-bold">Description of your need</h2>
            <textarea
              placeholder="I need a generator to power my ventilator."
              className="border-gray-400 border-2 rounded p-1 pl-2"
              rows="2"
              onChange={(e) => setNeedDescription(e.target.value)}
            />
            <h2 className="text-l font-bold">Urgency of your need</h2>
            <Dropdown
              menu={{ items: urgencyItems, onClick: onClickUrgency }}
              className="border-gray-400 border-2 rounded p-1 pl-2 w-100"
            >
              <Space>
                Urgency <DownOutlined /> | {urgency}
              </Space>
            </Dropdown>
          </div>
        </Modal>
      </>
    </div>
  );
};

export default ProfileScreen;

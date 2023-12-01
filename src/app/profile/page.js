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
import uploadImage from "../../hooks/uploadImage";
import ProfileCard from "../../components/profileCard";
import { getUserInfo } from "../../hooks/getUserInfo";
import { FaUser } from "react-icons/fa";

const ProfileScreen = () => {
  const router = useRouter();
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
  const [medicalConditions, setMedicalConditions] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  // Modal usage state
  const [modalVisible, setModalVisible] = useState(false);

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
          setMedicalConditions(data?.medicalConditions ?? "");
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
      medicalConditions: medicalConditions,
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
      <div>
        <h1>Edit Account Information</h1>
        <div>
          <label>First Name</label>
          <input
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label>Last Name</label>
          <input
            type="text"
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {/* </div> */}
          <label>Email</label>
          <input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Username</label>
          <input
            type="text"
            placeholder="BuffaloBillsFan123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Address</label>
          <input
            type="text"
            placeholder="123 Street Name, County, State Zip"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <label>Account Type</label>
          <input
            type="text"
            placeholder="(basic, volunteer, authority, authority coordinator)"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
          />
          <label>Phone Number</label>
          <input
            type="tel"
            placeholder="(123)-456-7890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <label>Date of Birth</label>
          <input
            type="date"
            placeholder="January 1, 2000"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
          <h2>Emergency Contact Information</h2>
          <p>
            This will be used only in emergency situations, such as being
            incapacitated or unable to be reached during a disaster situation.
          </p>
          <label>Emergency Contact Name</label>
          <input
            type="text"
            placeholder="John Smith"
            value={emergencyContactName}
            onChange={(e) => setEmergencyContactName(e.target.value)}
          />
          <label>Emergency Contact Number</label>
          <input
            type="tel"
            placeholder="(123)-456-7890"
            value={emergencyContactNumber}
            onChange={(e) => setEmergencyContactNumber(e.target.value)}
          />
          <label>Emergency Contact Email</label>
          <input
            type="email"
            placeholder="email@email.com"
            value={emergencyContactEmail}
            onChange={(e) => setEmergencyContactEmail(e.target.value)}
          />
          <h2>Household Information</h2>
          <p>
            This information will be used to help first responders determine the
            number of people and pets that may need assistance during a disaster
            situation.
          </p>
          <label>Number of Adults</label>
          <input
            type="number"
            placeholder="2"
            value={numberOfAdults}
            onChange={(e) => setNumberOfAdults(e.target.value)}
          />
          <label>Number of Children</label>
          <input
            type="number"
            placeholder="3"
            value={numberOfChildren}
            onChange={(e) => setNumberOfChildren(e.target.value)}
          />
          <label>Number of Pets</label>
          <input
            type="number"
            placeholder="Number of Pets"
            value={numberOfPets}
            onChange={(e) => setNumberOfPets(e.target.value)}
          />
          <label>Significant Medical Conditions or Disabilities</label>
          <input
            type="text"
            placeholder="Chronic Heart Disease, Asthma, Depression, etc."
            value={medicalConditions}
            onChange={(e) => setMedicalConditions(e.target.value)}
          />
        </div>
        <div>
          <button onClick={handleSave}>Save Info</button>
          <button onClick={() => setModalVisible(false)}>Close modal</button>
        </div>
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
          className="font-bold rounded-full h-auto w-auto flex bg-teal-300 p-2 cursor-pointer items-center justify-center"
          onClick={() => setModalVisible(true)}
        >
          Edit account information
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      <div className="flex w-full flex-row justify-around items-center mx-auto m-0">
        <div className="h-full flex flex-col justify-center items-center">
          <h1 className="text-2xl font-bold border-b-2 border-white">
            Your Public Profile
          </h1>
          <br />
          <ProfileCard
            displayName={firstName + " " + lastName}
            username={username}
            // profilePic={null}
          />
        </div>
        <div className="h-full d-flex flex-column justify-content-center">
          {/* <h1 className="text-xl">Your Account Information</h1> */}
          {accountInfo()}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;

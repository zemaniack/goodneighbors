"use client";
import React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
} from "firebase/auth";
import { app, db } from "../../../firebaseConfig";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AuthScreen = () => {
  // States for the form inputs
  const [action, setAction] = React.useState("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordConfirmation, setPasswordConfirmation] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
  const [createError, setCreateError] = React.useState("");

  // Firebase auth
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider(app);

  // Routing
  const router = useRouter();
  router.prefetch("/profile");
  router.prefetch("/homepage");

  // Function to chek that all fields are filled out
  const checkFields = () => {
    if (
      email === "" ||
      password === "" ||
      (action === "createAccount" &&
        (username === "" ||
          firstName === "" ||
          lastName === "" ||
          passwordConfirmation === ""))
    ) {
      return false;
    }
    return true;
  };

  // Function to create a new user in the database
  const createUser = async (user) => {
    // Check if the user already exists in the database
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      console.log("User already exists in the database, skipping creation.");
      return;
    }

    // Should create a new user in the users collection
    try {
      const docRef = await addDoc(collection(db, "users"), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        username: username,
        uid: user.uid,
        accountSetup: false,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    return;
  };

  // Function to rotate the input fields
  const rotateInput = () => {
    //Finish
    return null;
  };

  // Function to handle creating a new user
  const handleCreateAccount = () => {
    if (!checkFields()) {
      setCreateError("Please fill out all fields!");
      rotateInput();
      return;
    } else {
      if (password === passwordConfirmation) {
        if (password.length < 8) {
          setCreateError("Password must be at least 8 characters long!");
          rotateInput();
          return;
        } else {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              console.log(user);
              navigation.navigate("Profile");
              createUser(user);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(
                "Err Code: ",
                errorCode,
                "\nErr Message: ",
                errorMessage
              );
              switch (errorCode) {
                case "auth/email-already-in-use":
                  setCreateError(
                    "This email is already in use by another account."
                  );
                  setEmailError(
                    "This email is already in use by another account."
                  );
                  break;
                case "auth/invalid-email":
                  setCreateError("The email address is not valid.");
                  setEmailError("The email address is not valid.");
                  break;
                case "auth/operation-not-allowed":
                  setCreateError("Email/password accounts are not enabled.");
                  setEmailError("Email/password accounts are not enabled.");
                  break;
                case "auth/weak-password":
                  setCreateError("The password is too weak.");
                  setEmailError("The password is too weak.");
                  break;
                default:
                  setCreateError(errorMessage);
                  break;
              }
              rotateInput();
            });
        }
      } else {
        setCreateError("Passwords do not match!");
        rotateInput();
      }
    }
  };

  // Function to handle logging in an existing user
  const handleLogin = () => {
    if (!checkFields()) {
      console.log("Login:", checkFields());
      setLoginError("Please fill out all fields!");
      rotateInput();
      return;
    } else {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user);

          // navigation.navigate("Home");
          router.push("/homepage");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setLoginError("No account found with that email/password!");
          console.log("what");
          rotateInput();
        });
    }
  };

  // Function to switch between login and create account
  const handleSwitchAuthType = () => {
    if (action === "login") {
      setAction("createAccount");
    } else {
      setAction("login");
    }
    setEmail("");
    setPassword("");
    setPasswordConfirmation("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setLoginError("");
    setCreateError("");
  };

  // Function to handle signing in with Google
  const handleGoogleSignIn = () => {
    signInWithRedirect(auth, provider);
  };

  const userCreateOrSignInWithGoogle = async (user) => {
    // Check if the user is already in the database
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      // Create a new user in the database
      const docRef = await addDoc(collection(db, "users"), {
        firstName: user.displayName.split(" ")[0],
        lastName: user.displayName.split(" ")[1],
        email: user.email,
        username: "",
        uid: user.uid,
        accountSetup: false,
      });
      console.log("Document written with ID: ", docRef.id);
      router.push("/profile");
    } else {
      router.push("/homepage");
    }
  };

  getRedirectResult(auth)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access Google APIs.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      userCreateOrSignInWithGoogle(user);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });

  // Function to create a new user
  const createAccount = () => {
    return (
      <div className="flex flex-col items-center ">
        <h1 className="text-center text-3xl font-bold">Create Account</h1>
        <div className="w-full">
          <label className="font-bold ml-4 mt-2">Username</label>
          <input
            type="text"
            placeholder="BuffaloBillsFan123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-12 ml-0 m-3 border-2 p-2 rounded bg-white text-black placeholder-gray-500 w-full"
          />
        </div>
        {/* <div className="flex justify-between w-full"> */}
        <div className="w-full">
          <label className="font-bold ml-4 mt-2">First Name</label>
          <input
            type="text"
            placeholder="Jane"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="h-12 m-3 ml-0 border-2 p-2 rounded bg-white placeholder-gray-500 text-black w-full "
          />
        </div>
        <div className="w-full">
          <label className="font-bold ml-4 mt-2">Last Name</label>
          <input
            type="text"
            placeholder="Smith"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="h-12 m-3 ml-0 border-2 p-2 rounded bg-white text-black placeholder-gray-500 w-full"
          />
        </div>
        {/* </div> */}
        <div className="w-full">
          <label className="font-bold ml-4 mt-2">Email</label>
          <input
            type="email"
            placeholder="email@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 m-3 ml-0 border-2 p-2 rounded bg-white text-black placeholder-gray-500 w-full"
          />
        </div>
        <div className="w-full">
          <label className="font-bold ml-4 mt-2">Password</label>
          <input
            type="password"
            placeholder="ABCDEF123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 m-3 ml-0 border-2 p-2 rounded bg-white text-black placeholder-gray-500 w-full"
          />
        </div>
        <div className="w-full">
          <label className="font-bold ml-4 mt-2">Confirm Password</label>
          <input
            type="password"
            placeholder="ABCDEF123456"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="h-12 m-3 ml-0 border-2 p-2 rounded bg-white text-black placeholder-gray-500 w-full"
          />
        </div>
        <p>{createError === "" ? "" : createError}</p>
        <div className="flex flex-row justify-center flex-wrap w-full">
          <button
            onClick={() => handleSwitchAuthType()}
            className="m-2 w-36 text-white bg-opacity-100 rounded bg-blue-600  h-12"
          >
            Back to Login
          </button>
          <button
            onClick={() => handleCreateAccount()}
            className=" m-2 w-36 text-white bg-opacity-100 rounded bg-blue-600  h-12"
          >
            Create Account
          </button>
        </div>
      </div>
    );
  };

  // Function to login an existing user
  const login = () => {
    return (
      <div className="flex flex-col items-center">
        <div className="p-5 rounded">
          <h1 className="text-white text-center text-3xl font-bold">Login</h1>
          <div className="transform rotate-0  items-center">
            <label className="font-bold ml-4 mt-2">Email</label>
            <br />
            <input
              autoCapitalize="none"
              placeholder="email@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`h-12 m-3 ml-0 border-2 p-2 rounded w-full bg-white text-black placeholder-gray-500  ${
                email === "" && loginError !== "" ? "border-red-500" : ""
              }`}
            />
          </div>
          <div className="transform rotate-0  items-center">
            <label className="font-bold ml-4 mt-2">Password</label>
            <br />
            <input
              autoCapitalize="none"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className={`h-12 m-3 ml-0 border-2 p-2 rounded w-full bg-white text-black placeholder-gray-500 ${
                password === "" && loginError !== "" ? "border-red-500" : ""
              }`}
            />
          </div>
          <p className="text-red-400 text-center text-lg font-bold drop-shadow-md">
            {loginError}
          </p>
          <div className="flex justify-center flex-wrap">
            <div className="m-2 w-36">
              <button
                className="rounded bg-blue-600 w-full h-12"
                onClick={() => handleLogin()}
              >
                Login
              </button>
            </div>
            <div className="m-2 w-36">
              <button
                className="rounded bg-blue-600 w-full h-12"
                onClick={() => handleSwitchAuthType()}
              >
                Create Account
              </button>
            </div>
          </div>
          <p className="text-white text-center">- OR -</p>
          <div className="m-2 w-48 mx-auto flex flex-row justify-center align-center">
            <button
              onClick={() => handleGoogleSignIn()}
              className="text-white bg-opacity-100 rounded bg-blue-600 w-full h-12"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      {action === "login" ? login() : createAccount()}
    </div>
  );
};

export default AuthScreen;

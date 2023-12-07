"use client";
import React from "react";
// import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";
// import Navbar from "../../components/navbar";
import getUserInfo from "../../hooks/getUserInfo";
// import { WebView } from "react-native-webview";
import generateJwt from "../../hooks/generateToken"; // this

const HomeScreen = () => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [token, setToken] = React.useState(null);
  //const [token, generateJwt] = React.useState(null);

  React.useEffect(() => {
    async function loadUserInfo() {
      try {
        const userInformation = await getUserInfo();
        setUserInfo(userInformation);
        try {
          const token = await generateJwt();
          setToken(token);
          pageContent();
        } catch (error) {
          console.error("Error generating token.", error);
        }
        //console.log(userInfo);
        //
      } catch {
        console.log("Failed to get user info.");
      }
      
    }
    loadUserInfo();
    console.log(userInfo);
  }, []);

  
  const pageContent_with_auth = () => {
    //user
    if (userInfo === null) {
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    } else {
      if (!userInfo.accountSetup) {
        return (
          <div>
            <p>Looks like you haven't set up your account yet!</p>
          </div>
        );
      } else {
        return (
          <div>
            <p>Good job creating your account!</p>
            <tableau-viz
              id="tableauViz"
              src={tableauUrl}
              token={token}
            ></tableau-viz>
          </div>
        );
      }
    }
  };
  

  const pageContent = () => {
    console.log("loading page content with token: ", token);
    return (
      <div>
        <p>Good job creating your account!</p>
        <tableau-viz
          id="tableauViz"
          src={tableauUrl}
          token={token}
        ></tableau-viz>
      </div>
    );
  };
  

  const tableauUrl =
    "https://prod-useast-b.online.tableau.com/t/communitydashboard/views/disabilities_communities/Dashboard2/b347fd8f-9ae1-4fc9-8c1a-867b5bdd6120/8c879fdb-6fd7-46a4-bb88-a01be172d755?:embed=yes";
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      {pageContent()}
      {/* <iframe src={tableauUrl} height="90%" width="90%" /> */}
    </div>
  );
};

export default HomeScreen;

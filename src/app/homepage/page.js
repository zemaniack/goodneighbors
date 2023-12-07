"use client";
import React from "react";
// import { StyleSheet, Text, View, Button, SafeAreaView } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";
// import Navbar from "../../components/navbar";
import getUserInfo from "../../hooks/getUserInfo";
// import { WebView } from "react-native-webview";
import generateJwt from "../../hooks/generateToken";
import Script from "next/script";

const HomeScreen = () => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    async function loadTableauLibrary() {
      
      const script = document.createElement('script');
      script.type = "module";
      script.src = 'https://public.tableau.com/javascripts/api/tableau.embedding.3.latest.min.js';
      //script.async = true;

      script.onload = () => {
        // Once the Tableau script has loaded, you can use the tableau API here
        const containerDiv = document.getElementById('tableauViz');
        const options = {
          hideTabs: true,
          //toolbarPosition: tableau.ToolbarPosition.Bottom,
        };

        //const viz = new tableau.Viz(containerDiv, 'https://public.tableau.com/views/Superstore_embedded_800x800/Overview', options);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
      document.head.removeChild(script);
    };

    }
    loadTableauLibrary();
    console.log("Tableau Embedding Library loaded.");
  }, []);

  React.useEffect(() => {
    async function loadUserInfo() {
      try {
        const userInformation = await getUserInfo();
        setUserInfo(userInformation);
        
        //console.log(userInfo);
      } catch {
        console.log("Failed to get user info.");
      }
      
    }
    loadUserInfo();
    console.log(userInfo);
  }, []);

  React.useEffect(() => {
    async function getToken() {
      try {
        const token = await generateJwt(); // generate and set token for Tableau access
        setToken(token);
        //pageContent();

      } catch (error) {
        console.error("Error generating token.", error);
      }
    }
    if(token === null) {
      getToken();
      console.log("Generated token: ", token);
    }
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
            width="1000"
            height="1000"
            hide-tabs="false"
            src="https://prod-useast-b.online.tableau.com/t/communityserver95/views/map/Dashboard1"
            device="Desktop"
            toolbar="bottom"
            token= {token}
            >   
            </tableau-viz>
          </div>
        );
      }
    }
  };
  
  // Public dashboard for testing.
  const pageContent_old = () => {
    console.log("loading page content with token: ", token);
    return (
      <div>
        <p>Good job creating your account!</p>
        
        <tableau-viz id="tableauViz"       
          src='https://public.tableau.com/views/Superstore_embedded_800x800/Overview'      
          toolbar="bottom" hide-tabs>
        </tableau-viz>

        <p>Community needs dashboard</p>
      </div>
    );
  };


  // actual
  const pageContent = () => {
    console.log("loading page content with token: ", token);
    return (
      <div>
        <p>Good job creating your account!</p>

        <tableau-viz
            id="tableauViz"
            width="1000"
            height="1000"
            hide-tabs="false"
            src="https://prod-useast-b.online.tableau.com/t/communityserver95/views/map/Dashboard1"
            device="Desktop"
            toolbar="bottom"
            token= {token}
            >   
            </tableau-viz>

        <p>Community needs dashboard</p>
      </div>
    );
  };

  //const tableauUrl =
    //"https://prod-useast-b.online.tableau.com/t/communitydashboard/views/disabilities_communities/Dashboard2/b347fd8f-9ae1-4fc9-8c1a-867b5bdd6120/8c879fdb-6fd7-46a4-bb88-a01be172d755?:embed=yes";

  const tableauUrl = "https://prod-useast-b.online.tableau.com/t/communityserver95/views/map/Dashboard1" // new url
  const publicUrl = "https://public.tableau.com/views/Superstore_embedded_800x800/Overview"
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      {pageContent()}
      {/*<iframe src={tableauUrl} height="90%" width="90%" />*/}
    </div>
  );
};

export default HomeScreen;

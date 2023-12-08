"use client";
import React from "react";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";
import getUserInfo from "../../hooks/getUserInfo";
import generateJwt from "../../hooks/generateToken";

const HomeScreen = () => {
  const [userInfo, setUserInfo] = React.useState(null);
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    // loads the Tableau Embedding API for embedding the dashboard.
    async function loadTableauLibrary() {
      const script = document.createElement("script"); // create a script element for the tableau
      script.type = "module";
      script.src =
        "https://embedding.tableauusercontent.com/tableau.embedding.3.1.0.min.js";

      document.head.appendChild(script);

      return () => {
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
      } catch (error) {
        console.error("Error generating token.", error);
      }
    }
    if (token === null) {
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
              src={tableauUrl}
              device="Desktop"
              toolbar="bottom"
              token={token}
            ></tableau-viz>
          </div>
        );
      }
    }
  };

  // Loads the actual tableau dashboard. No user authorization.
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
          src={tableauUrl}
          device="Desktop"
          toolbar="bottom"
          token={token}
        ></tableau-viz>
      </div>
    );
  };

  // old url
  //const tableauUrl =
  //"https://prod-useast-b.online.tableau.com/t/communitydashboard/views/disabilities_communities/Dashboard2/b347fd8f-9ae1-4fc9-8c1a-867b5bdd6120/8c879fdb-6fd7-46a4-bb88-a01be172d755?:embed=yes";

  const tableauUrl =
    "https://prod-useast-b.online.tableau.com/t/communityserver95/views/map/Dashboard1"; // new url

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen bg-gradient-to-r from-blue-400 via-blue-500 to-blue-700">
      {pageContent()}
      {/*<iframe src={tableauUrl} height="90%" width="90%" />*/}
    </div>
  );
};

export default HomeScreen;

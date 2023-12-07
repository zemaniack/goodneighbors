const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");


const generateJwt = async () => {
  // Replace the example values below (remove the brackets).
  // Store secrets securely based on your team's best practices.
  // See: https://help.tableau.com/current/online/en-us/connected_apps_direct.htm

  const secret = "12edf817-96db-475f-a73a-8c532efdb930";
  const secretId = "8Gg0ga6p9wVKh4AEgxcoeAnN6TmsOQSpRLN58x5n3CU=";
  const clientId = "d6952b3b-5c4d-4fe4-a3e5-0b706daca150";
  //const scopes = ["tableau:views:embed", "tableau:views:embed_authoring"];
  const scopes = ["tableau:views:embed","tableau:views:embed_authoring"];
  const userId = "tablea9555@gmail.com";
  const tokenExpiryInMinutes = 10; // Max of 10 minutes.

  const userAttributes = {
    //  User attributes are optional.
    //  Add entries to this dictionary if desired.
    //  "[User Attribute Name]": "[User Attribute Value]",
  };

  const options = {
    algorithm: "HS256",
    expiresIn: tokenExpiryInMinutes * 60,
    header: {
      alg: "HS256",
      typ: "JWT",
      kid: secretId,
      iss: clientId,
    },
  };

  const data = {
    jti: uuidv4(),
    aud: "tableau",
    sub: userId,
    scp: scopes,
    ...userAttributes,
  };

  const token = jwt.sign(data, secret, options);
  console.log("Generated token: ", token);

  return token;
};

export default generateJwt;

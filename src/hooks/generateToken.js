const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const generateJwt = async () => {
  // Replace the example values below (remove the brackets).
  // Store secrets securely based on your team's best practices.
  // See: https://help.tableau.com/current/online/en-us/connected_apps_direct.htm

  const secret = "eebcab3e-c40c-4166-83ff-611731b2fe5b";
  const secretId = "Qd9/t67wOqlyRmKVyNwewcrJ531iTsyFwPMx7KnITuE=";
  const clientId = "5a33df84-4b11-45b7-9cfc-6b63630ffdef";
  const scopes = ["tableau:views:embed", "tableau:views:embed_authoring"];
  const userId = "aneshmut@buffalo.edu";
  const tokenExpiryInMinutes = 10; // Max of 10 minutes.

  const userAttributes = {
    //  User attributes are optional.
    //  Add entries to this dictionary if desired.
    //  "[User Attribute Name]": "[User Attribute Value]",
  };

  const options = {
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
    exp: Math.floor(Date.now() / 1000) + tokenExpiryInMinutes * 60,
    ...userAttributes,
  };

  const token = jwt.sign(data, secret, options);
  console.log(token);

  return token;
};

export default generateJwt;

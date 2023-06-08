import axios from "axios";

const createJwtInterceptor = (userSub, refreshTokenUUID, logoutCallback) => {
  const jwtInterceptor = axios.create({});

  jwtInterceptor.interceptors.request.use((config) => {
    let tokensData = JSON.parse(localStorage.getItem("tokens"));

    // Create the headers object if it doesn't exist
    config.headers = config.headers || {};

    // Set the "Authorization" header
    Object.assign(config.headers, { Authorization: `Bearer ${tokensData.access_token}` });

    return config;
  });

  jwtInterceptor.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      console.log("error", error);

      if (error.response && error.response.status === 403) {
        const authData = JSON.parse(localStorage.getItem("tokens"));

        try {
          await refreshAccessToken(userSub, refreshTokenUUID, authData.refresh_token);

          // Update the token in the request with the refreshed token
          error.config.headers["Authorization"] = `Bearer ${localStorage.getItem("access_token")}`;

          console.log("Request with refreshed token:", error.config);

          // Use createJwtInterceptor to make the request with the refreshed token
          return createJwtInterceptor(userSub, refreshTokenUUID, logoutCallback)(error.config);
        } catch (error) {
          alert("Reauthorization error.\nPlease log in again.");
          logoutCallback();
          // return Promise.reject(error);
          return null;
        }
      } else if (error.code === "ERR_NETWORK") {
        console.error("Network Error:", error);
        alert("Connection to server lost.\nPlease contact technical support.");
        logoutCallback();
        // return Promise.reject(error);
        return null;
      }
    }
  );

  return jwtInterceptor;
};

// Function to refresh the token
async function refreshAccessToken(userSub, refreshTokenUUID, refreshToken) {
  try {
    let apiResponse = await axios.post(
      "http://localhost:8003/api/auth/refreshtoken",
      {
        email: userSub,
        tokenUUID: refreshTokenUUID,
      },
      {
        headers: {
          "Refresh-Token": `Bearer ${refreshToken}`,
        },
      }
    );

    localStorage.setItem("tokens", JSON.stringify(apiResponse.data));
  } catch (error) {
    throw error;
  }
}

export default createJwtInterceptor;
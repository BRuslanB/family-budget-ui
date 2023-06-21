import axios from "axios";
import jwt_decode from "jwt-decode";

let isRefreshingToken = false; // Shared variable for all instances

const createJwtInterceptor = (userSub, refreshTokenUUID,
  SetRefreshToken, logoutCallback) => {

  const jwtInterceptor = axios.create({});

  jwtInterceptor.interceptors.request.use((config) => {
    let tokensData = JSON.parse(localStorage.getItem("tokens"));

    config.headers = config.headers || {};
    Object.assign(config.headers, { Authorization: `Bearer ${tokensData.access_token}` });

    return config;
  });

  jwtInterceptor.interceptors.response.use(
    async (response) => {
      return response;
    },
    async (error) => {
      console.log("error", error);

      if (error.code === "ERR_NETWORK") {
        console.error("Network Error:", error);
        alert("Connection to Server lost.\nPlease contact technical support.");
        logoutCallback();
        return null;
      }

      if (error.response && error.response.status === 403 && !isRefreshingToken) {

          if (!isRefreshingToken) {

            isRefreshingToken = true; // Setting the flag

            try {
              const response = await refreshAccessToken(userSub, refreshTokenUUID);

              // Refreshing tokens in localStorage and in the Application
              const { access_token, refresh_token } = response.data;
              localStorage.setItem("tokens", JSON.stringify({ access_token, refresh_token }));
              SetRefreshToken(jwt_decode(refresh_token));

              isRefreshingToken = false; // Reset the flag after refreshing the token

            } catch (error) {

              alert("Reauthorization error.\nPlease log in again.");
              logoutCallback();
              return Promise.reject(error);
            }

          }
      }

      return Promise.reject(error);
    }
  );

  return jwtInterceptor;
};

async function refreshAccessToken(userSub, refreshTokenUUID) {

  const axiosInstance = axios.create();

  try {
    const authData = JSON.parse(localStorage.getItem("tokens"));
    const response = await axiosInstance.post(
      "http://localhost:8003/api/auth/refreshtoken",
      {
        email: userSub,
        tokenUUID: refreshTokenUUID,
      },
      {
        headers: {
          "Refresh-Token": `Bearer ${authData.refresh_token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Error refreshtoken:", error);
    throw error;
  }
}

export default createJwtInterceptor;
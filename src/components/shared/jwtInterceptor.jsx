import axios from "axios";
import jwt_decode from "jwt-decode";

let isBadRequest = false; // Shared variable for all instances
let isNetworkError = false; // Shared variable for all instances
let isRefreshingToken = false; // Shared variable for all instances
let refreshPromise = null; // Promise for token refresh

const createJwtInterceptor = (userSub, refreshTokenUUID, SetRefreshToken, logoutCallback) => {
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

      if (error.code === "ERR_NETWORK") {
        console.error("Network Error:", error);
        if (!isNetworkError) {
          isNetworkError = true; // Setting the flag
          alert("Connection to Server lost.\nPlease contact technical support.");
          logoutCallback();
          isNetworkError = false; // Reset the flag
          return null;
          // return Promise.reject(error);
        }

      } else if (error.response && error.response.status === 403) {
        console.log("Forbidden error:", error);

        if (!isRefreshingToken) {
          isRefreshingToken = true; // Setting the flag

          try {
            // Check if refreshPromise exists and wait for its completion
            if (!refreshPromise) {
              refreshPromise = refreshAccessToken(userSub, refreshTokenUUID);
            }
            const response = await refreshPromise;

            // Refreshing tokens in localStorage and in the Application
            const { access_token, refresh_token } = response.data;
            localStorage.setItem("tokens", JSON.stringify({ access_token, refresh_token }));
            SetRefreshToken(jwt_decode(refresh_token));

            isRefreshingToken = false; // Reset the flag after refreshing the token
            refreshPromise = null; // Reset the refreshPromise

            // Retry the original request
            return jwtInterceptor(error.config);
          } catch (error) {
            alert("Reauthorization error.\nPlease log in again.");
            logoutCallback();
            return null;
            // return Promise.reject(error);
          }
        }

      } else if (error.response && error.response.status === 400) {
        if (!isBadRequest) {
          isBadRequest = true; // Setting the flag
          console.log("Bad Request error:", error);
          isBadRequest = false; // Reset the flag
          // Passing the error further down the promise chain 
          return Promise.reject(error);
        }
      } else {
        console.error("Unknow Error:", error);
        alert("Unknow Error.\nPlease contact technical support.");
        logoutCallback();
        return null;
        // return Promise.reject(error);
      }
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
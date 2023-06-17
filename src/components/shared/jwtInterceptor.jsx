import axios from "axios";
import jwt_decode from "jwt-decode";

let isRefreshingToken = false; // Shared variable for all instances

const createJwtInterceptor = (userSub, refreshTokenUUID,
  SetRefreshToken, logoutCallback, refreshContext) => {

  const { requestQueue, setRequestQueue, enqueueRequest } = refreshContext;

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
        alert("Connection to server lost.\nPlease contact technical support.");
        logoutCallback();
        return null;
        // return Promise.reject(error);
      }

      if (error.response && error.response.status === 403 && !isRefreshingToken) {

        if (!isRefreshingToken) {
          // Added error request to queue
          enqueueRequest(error.config);

          isRefreshingToken = true; // Setting the flag

          try {
            await refreshAccessToken(userSub, refreshTokenUUID, SetRefreshToken, 
              setRequestQueue, requestQueue, jwtInterceptor);

          } catch (error) {

            alert("Reauthorization error.\nPlease log in again.");
            logoutCallback();
            return Promise.reject(error);
          }

          isRefreshingToken = false; // Reset the flag after refreshing the token
        }
      }

      return Promise.reject(error);
    }
  );

  return jwtInterceptor;
};

async function refreshAccessToken(userSub, refreshTokenUUID, SetRefreshToken, 
  setRequestQueue, requestQueue, jwtInterceptor) {

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

    // Refreshing tokens in localStorage and in the Application
    const { access_token, refresh_token } = response.data;
    localStorage.setItem("tokens", JSON.stringify({ access_token, refresh_token }));
    SetRefreshToken(jwt_decode(refresh_token));

    const refreshedAxios = axios.create(); // Creating a new axios instance
    refreshedAxios.interceptors.response.handlers =
      [...jwtInterceptor.interceptors.response.handlers];
    axios.interceptors.response.handlers =
      [...refreshedAxios.interceptors.response.handlers];

    if (requestQueue.length > 0) {
      const updatedRequests = requestQueue.map((config) => {
        // Update request queue with new access token
        config.headers["Authorization"] = `Bearer ${access_token}`;
        return refreshedAxios.request(config);
      });
    
      // Current request queue
      const queueLength = requestQueue.length;
      console.log("Current request queue = ", queueLength);
    
      if (queueLength > 0) {
        return Promise.all(updatedRequests)
          .then(() => {
            // All requests in the queue have been completed
            setRequestQueue([]); // Сlearing the queue
          })
          .catch((error) => {
            // Error while executing requests from the queue
            setRequestQueue([]); // Сlearing the queue
          });
      }
    } else {
      setRequestQueue([]); // Сlearing the queue
      console.log("Queue is empty");
    }

  } catch (error) {

    setRequestQueue([]); // Сlearing the queue
    console.log("Error refreshtoken:", error);
    throw error;
  }
}

export default createJwtInterceptor;
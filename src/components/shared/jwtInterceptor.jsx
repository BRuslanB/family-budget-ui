import axios from "axios";

const createJwtInterceptor = (userSub, refreshTokenUUID) => {
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
          let apiResponse = await axios.post(
            "http://localhost:8003/api/auth/refreshtoken",
            {
              email: userSub,
              tokenUUID: refreshTokenUUID
            },
            {
              headers: {
                "Refresh-Token": `Bearer ${authData.refresh_token}`,
              },
            }
          );

          localStorage.setItem("tokens", JSON.stringify(apiResponse.data));
          error.config.headers["Authorization"] = `Bearer ${apiResponse.data.access_token}`;
          console.log("Request with refreshed token:", error.config); // Выводим конфигурацию запроса с обновленным токеном
          return createJwtInterceptor(userSub, refreshTokenUUID)(error.config); // Используем createJwtInterceptor для выполнения запроса с обновленным токеном
        } catch (error) {
          console.error("Token refresh error:", error);
          return Promise.reject(error);
        }
      } else {
        console.error("Network Error:", error);
        return Promise.reject(error);
      }
    }
  );

  return jwtInterceptor;
};

export default createJwtInterceptor;
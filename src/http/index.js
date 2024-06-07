// import axios from "axios";
// import { localStorageService } from "services/localStorage.services";

// const Axios = axios.create({
//   baseURL: "http://192.168.0.186:8000/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// const token = localStorageService.get("nuvu_token");

// if (token) {
//   Axios.interceptors.request.use(
//     (config) => {
//       config.headers["Authorization"] = `Bearer ${token}`;
//       return config;
//     },
//     (error) => {
//       if (error.response.status === 403) {
//         localStorageService.remove("nuvu_token");
//       }
//     }
//   );
// }

// export default Axios;

import axios from "axios";
import { localStorageService } from "services/localStorage.services";

const Axios = axios.create({
  baseURL: "http://192.168.0.186:8005/",
  headers: {
    "Content-Type": "application/json",
  },
});

const token = localStorageService.get("nuvu_token");
console.log("token: " + token);

if (token) {
  Axios.interceptors.request.use(
    (config) => {
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  Axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 403) {
        console.log("unauthenticated user");
        // Unauthorized - remove the token and log out the user
        location.href = "/login";
        localStorageService.remove("nuvu_token");
      }
      return Promise.reject(error);
    }
  );
}

export default Axios;

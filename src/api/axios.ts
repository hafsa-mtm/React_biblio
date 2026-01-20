import axios from "axios";

/* ===========================
   AXIOS INSTANCES
=========================== */

// Service sécurité (login, refresh)
export const apiSecurity = axios.create({
  baseURL: "http://localhost:8888/SECURITY-SERVICE",
});

// Service livres
export const apiLivre = axios.create({
  baseURL: "http://localhost:8888/LIVRE-SERVICE",
});

// Service bibliothécaire
export const apiBiblio = axios.create({
  baseURL: "http://localhost:8888/BIBLIOTHECAIRE-SERVICE",
});

// Service lecteur
export const apiLecteur = axios.create({
  baseURL: "http://localhost:8888/LECTEUR-SERVICE",
});

// Service admin
export const apiAdmin = axios.create({
  baseURL: "http://localhost:8888/ADMIN-SERVICE",
});

// Service prêt
export const apiPret = axios.create({
  baseURL: "http://localhost:8888/PRETE-SERVICE",
});

/* ===========================
   REQUEST INTERCEPTOR
   (Ajout du access_token)
=========================== */

const securedApis = [
  apiLivre,
  apiBiblio,
  apiLecteur,
  apiAdmin,
  apiPret,
];

securedApis.forEach((api) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
});

/* ===========================
   RESPONSE INTERCEPTOR
   (Refresh token sécurisé)
=========================== */

securedApis.forEach((api) => {
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/login") &&
        !originalRequest.url?.includes("/refresh")
      ) {
        originalRequest._retry = true;

        try {
          const refresh_token = localStorage.getItem("refresh_token");
          const role = localStorage.getItem("role");

          if (!refresh_token || !role) {
            throw new Error("Missing refresh token or role");
          }

          const res = await apiSecurity.post("/refresh", null, {
            params: {
              refresh_token,
              role,
            },
          });

          const newAccessToken = res.data.access_token;

          localStorage.setItem("access_token", newAccessToken);

          originalRequest.headers.Authorization =
            "Bearer " + newAccessToken;

          return axios(originalRequest);
        } catch (err) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(err);
        }
      }

      return Promise.reject(error);
    }
  );
});

/* ===========================
   EXPORT
=========================== */

const apis = {
  apiSecurity,
  apiLivre,
  apiBiblio,
  apiLecteur,
  apiAdmin,
  apiPret,
};

export default apis;
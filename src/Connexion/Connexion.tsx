import React, { useContext } from "react";
import { login, logout } from "../firebase/configuration";
import { UserContext } from "./UserContext";

export const Connexion = () => {
  const user = useContext(UserContext);
  return user ? (
    <a href="#" role="button" onClick={logout} style={{ height: "36px" }}>
      <img
        style={{ borderRadius: "50%", width: "36px", height: "36px" }}
        src={user.photoURL || ""}
        alt="user"
      />
    </a>
  ) : (
    <a href="#" role="button" onClick={login} style={{ height: "36px" }}>
      <svg
        xmlns="https://www.w3.org/2000/svg"
        width="36px"
        height="36px"
        viewBox="0 0 48 48"
        fill="#757575"
        aria-hidden="true"
      >
        <path d="M24,0C10.74,0 0,10.74 0,24C0,37.26 10.74,48 24,48C37.26,48 48,37.26 48,24C48,10.74 37.26,0 24,0ZM24,41.28C17.988,41 12.708,38.208 9.6,33.552C9.66,28.788 19.212,26.16 24,26.16C28.788,26.16 38.328,28.788 38.4,33.552C35.292,38.208 30.012,41.28 24,41.28ZM24,7.2C27.972,7.2 31.2,10.428 31.2,14.4C31.2,18.384 27.972,21.6 24,21.6C20.028,21.6 16.8,18.384 16.8,14.4C16.8,10.428 20.028,7.2 24,7.2Z" />
        <path d="M0 0h48v48H0z" fill="none" />
      </svg>
    </a>
  );
};

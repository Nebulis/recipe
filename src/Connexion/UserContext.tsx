import firebase from "firebase";
import { createContext } from "react";

export const UserContext = createContext<firebase.User | undefined>(undefined);

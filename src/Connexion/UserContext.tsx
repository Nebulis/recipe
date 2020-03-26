import * as firebase from 'firebase/app';
import { createContext } from "react";

export const UserContext = createContext<firebase.User | undefined>(undefined);

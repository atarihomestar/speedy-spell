import { auth } from "../firebase";
import { db } from "../firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  addDoc,
  updateDoc,
} from "firebase/firestore";

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error();
  }
};

export const logout = (navigate) => {
  signOut(auth);
};

export const signup = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error();
  }
};

export const getWordLists = async (user, setWordLists) => {
  const q = query(collection(db, "wordLists"), where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);
  let temp = querySnapshot.docs.map((doc) => {
    return { id: doc.id, data: doc.data() };
  });
  setWordLists(
    temp.map((wordList) => {
      return {
        id: wordList.id,
        uid: wordList.data.uid,
        name: wordList.data.name,
        words: wordList.data.words.join(", "),
      };
    })
  );
};

export const saveWordList = async (id, uid, name, words) => {
  const data = {
    uid: uid,
    name: name,
    words: words.split(", "),
  };

  console.log("data!: ", data);
  console.log("id!: ", id);

  if (id) {
    const wordListRef = doc(db, "wordList", id);
    console.log("wordListRef: ", wordListRef);
    await updateDoc(wordListRef, data);
  } else {
    console.log("here?");
    await addDoc(collection(db, "wordLists"), data);
  }
};

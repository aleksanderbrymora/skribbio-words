import { useState, useEffect } from 'react';
import { firestore } from './config';
import firebase from 'firebase/app';

export const useGame = (id: string): [boolean, null | Error, any[]] => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<null | Error>(null);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection(`games`)
      .doc(id)
      .onSnapshot((doc: firebase.firestore.DocumentSnapshot) => {
        setIsLoading(false);
        setError(null);
        const words = doc.data()?.words;
        if (words) {
          setData(words);
        } else {
          setError(new Error('There are no words yet'));
        }
      });
    return unsubscribe;
  });

  return [isLoading, error, data];
};

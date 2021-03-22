import { Button, Input } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { skribblioID } from '../utils/skribblio';
import { firestore } from '../firebase/config';

const InputLink = () => {
  const [link, setLink] = useState('');
  const [linkIsValid, setLinkIsValid] = useState(false);
  const [redirectButton, setRedirectButton] = useState('Input proper link');
  const [SID, setSID] = useState('');
  const history = useHistory();

  useEffect(() => {
    const { isValid, id } = skribblioID(link);
    setLinkIsValid(isValid);
    if (isValid) {
      setSID(id);
      setRedirectButton(`Go to room ${id}`);
    }
  }, [link]);

  const handleNewRoom = async () => {
    await firestore
      .collection('games')
      .doc(SID)
      .set({ words: [] }, { merge: true });
    history.push(`/${SID}`);
  };

  return (
    <>
      <pre>https://skribbl.io/?u44qMeq85gl2=</pre>
      <Input
        placeholder={'Enter room link to start adding words'}
        value={link}
        onChange={(e) => setLink(e.target.value)}
        w={'50%'}
        autoFocus
      />
      <Button onClick={handleNewRoom} disabled={!linkIsValid}>
        {redirectButton}
      </Button>
    </>
  );
};

export default InputLink;

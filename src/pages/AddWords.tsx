import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Text } from '@chakra-ui/layout';
import { Box, Stack, useClipboard } from '@chakra-ui/react';
import { Fade } from '@chakra-ui/transition';
import firebase from 'firebase/app';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import simplur from 'simplur';
import { firestore } from '../firebase/config';
import { useGame } from '../firebase/useGame';

const serializeWords = (words: string[]) => words.join(', ');

const AddWords = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, error, data] = useGame(id);
  const [usersWords, setUsersWords] = useState<string[]>([]);
  const [isValidWord, setIsValidWord] = useState(false);
  const [word, setWord] = useState('');
  const [shouldShowAll, setShouldShowAll] = useState(false);

  const { hasCopied, onCopy } = useClipboard(serializeWords(data as string[]));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let valid = word.trim().length > 0;
    if (valid) valid = word.trim().length <= 30;
    setIsValidWord(valid);
  }, [word]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidWord) return; // ignoring invalid words
    setUsersWords([...usersWords, word]);
    await firestore
      .collection('games')
      .doc(id)
      .update({ words: firebase.firestore.FieldValue.arrayUnion(word) });
    setWord('');
    inputRef.current!.focus();
  };

  const handleDeleteAll = async () => {
    setUsersWords([]);
    await firestore.collection('games').doc(id).set({ words: [] });
  };

  const removeUsersWords = async () => {
    const gameRef = firestore.collection('games').doc(id);
    await Promise.all(
      usersWords.map((w) =>
        gameRef.update({ words: firebase.firestore.FieldValue.arrayRemove(w) }),
      ),
    );
    setUsersWords([]);
  };

  if (loading) return null;
  if (error) return <pre>{JSON.stringify(error, null, 2)}</pre>;

  return (
    <Fade in={!loading}>
      <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <Stack
          px={5}
          w='100%'
          align='center'
          justify='center'
          direction='column'
        >
          <Input
            mr={3}
            w='20%'
            placeholder={'Add a min four letter word'}
            autoFocus
            value={word}
            onChange={(e) => setWord(e.target.value)}
            ref={inputRef}
          />
          <Button disabled={!isValidWord} px={10} type='submit'>
            Add
          </Button>
        </Stack>
      </form>
      <Box mt={5}>
        {data.length < 4 ? (
          <Text>{simplur`You need ${4 - data.length} more word[|s]`}</Text>
        ) : (
          <Text>{simplur`You have ${data.length} word[|s] combined`}</Text>
        )}
      </Box>
      <Text fontSize='sm'>
        {usersWords.length > 0 ? (
          <>
            <strong>Your words: </strong>
            {usersWords.join(', ')}
          </>
        ) : (
          "You haven't added any words yet"
        )}
      </Text>
      {shouldShowAll && (
        <Text fontSize='sm'>
          {data.length > 0 ? (
            <>
              <strong>All words: </strong>
              {data.join(', ')}
            </>
          ) : (
            'There are no words currently'
          )}
        </Text>
      )}

      <Stack mt={10} align='center' justify='center' isInline>
        <Button disabled={data.length < 4} onClick={onCopy}>
          {hasCopied ? 'Copied Words' : 'Copy Words'}
        </Button>
        <Button onClick={() => setShouldShowAll(!shouldShowAll)}>
          {shouldShowAll ? 'Hide' : 'Show'} all words
        </Button>
        <Button disabled={usersWords.length === 0} onClick={removeUsersWords}>
          Remove your words
        </Button>
        <Button disabled={data.length === 0} onClick={handleDeleteAll}>
          Remove all words
        </Button>
      </Stack>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </Fade>
  );
};

export default AddWords;

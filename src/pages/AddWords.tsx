import { Button } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Text } from '@chakra-ui/layout';
import { Box, Stack, Tooltip, useClipboard } from '@chakra-ui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import simplur from 'simplur';
import { useSkribblio } from '../hooks/useSkribblio';
import { useBeforeunload } from 'react-beforeunload';

const AddWords = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const {
    words,
    deleteAllWords,
    addWord,
    leaveRoom,
    removeWord,
    state,
  } = useSkribblio(roomId);
  const [word, setWord] = useState('');
  const [isValidWord, setIsValidWord] = useState(false);
  const [validMessage, setValidMessage] = useState('');
  const { hasCopied, onCopy } = useClipboard(words.join(', '));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (word.trim().length === 0) {
      setIsValidWord(false);
      setValidMessage('');
    } else if (word.trim().length < 4) {
      setIsValidWord(false);
      setValidMessage('Word is too short');
    } else if (word.trim().length >= 30) {
      setIsValidWord(false);
      setValidMessage('Word is too long');
    } else if (words.includes(word)) {
      setIsValidWord(false);
      setValidMessage('Word has already been added');
    } else {
      setIsValidWord(true);
      setValidMessage('');
    }
  }, [word]);

  useEffect(() => {
    return leaveRoom;
  }, []);

  useBeforeunload(leaveRoom);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addWord(word);
    setWord('');
    inputRef.current?.focus();
  };

  return (
    <Box>
      <form style={{ width: '100%' }} onSubmit={handleSubmit}>
        <Stack
          px={5}
          w='100%'
          align='center'
          justify='center'
          direction='column'
        >
          <Input
            w={[
              '100%', // 0-30em
              '70%', // 30em-48em
              '50%', // 48em-62em
              '35%', // 62em+
            ]}
            placeholder={'Add a min four letter word'}
            autoFocus
            value={word}
            onChange={(e) => setWord(e.target.value)}
            ref={inputRef}
          />
          {validMessage !== '' && <small>{validMessage}</small>}
          <Button disabled={!isValidWord} px={10} type='submit'>
            Add
          </Button>
        </Stack>
      </form>
      <Box mt={5}>
        {words.length < 4 ? (
          <Text>{simplur`You need ${4 - words.length} more word[|s]`}</Text>
        ) : (
          <Text>{simplur`You have ${words.length} word[|s] combined`}</Text>
        )}
      </Box>

      <Stack
        mt={10}
        align='center'
        justify='center'
        direction={['column', 'row']}
      >
        <Button
          disabled={words.length < 4}
          onClick={onCopy}
          w={['full', 'auto']}
        >
          {hasCopied ? 'Copied Words' : 'Copy Words'}
        </Button>
        <Tooltip
          label='This will delete words for everyone!'
          bg='red'
          color='white'
        >
          <Button
            w={['full', 'auto']}
            disabled={words.length === 0}
            onClick={deleteAllWords}
          >
            Remove all words
          </Button>
        </Tooltip>
      </Stack>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </Box>
  );
};

export default AddWords;

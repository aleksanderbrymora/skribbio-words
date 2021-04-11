import { nanoid } from 'nanoid';
import { useState, useEffect } from 'react';
import { serverLink } from '../constants/serverLink';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export interface WsData {
  event:
    | 'join-room'
    | 'leave-room'
    | 'add-word'
    | 'remove-word'
    | 'remove-all-words';
  content: {};
}

export const useSkribblio = (roomId: string) => {
  const [users, setUsers] = useState<string[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [userId, setUserId] = useState(nanoid());
  // const userId = nanoid();
  const {
    sendJsonMessage,
    lastJsonMessage,
    readyState,
    lastMessage,
  } = useWebSocket(serverLink());

  // updates state on every message
  useEffect(() => {
    if (lastJsonMessage === null) return;
    console.log(lastJsonMessage);
    const { words, users } = lastJsonMessage as {
      words: string[];
      users: string[];
    };
    setWords(words);
    setUsers(users);
  }, [lastJsonMessage, lastMessage]);

  // join room event on mount
  useEffect(() => {
    sendJsonMessage({
      event: 'join-room',
      content: { userId, roomId },
    });
  }, [userId, roomId]);

  const deleteAllWords = () => {
    sendJsonMessage({
      event: 'remove-all-words',
      content: { roomId },
    });
  };

  const addWord = (word: string) => {
    sendJsonMessage({
      event: 'add-word',
      content: { roomId, word },
    });
  };

  const removeWord = (word: string) => {};

  const leaveRoom = () => {
    sendJsonMessage({
      event: 'leave-room',
      content: { userId, roomId },
    });
  };

  return {
    state: readyState,
    words,
    deleteAllWords,
    addWord,
    leaveRoom,
    removeWord,
    users,
  };
};

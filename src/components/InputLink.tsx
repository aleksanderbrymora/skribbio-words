import { Button, Input, Stack } from '@chakra-ui/react';
import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router';

const InputLink = () => {
  const [id, setId] = useState('');
  const history = useHistory();

  const handleNewRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.push(`/${id}`);
  };

  return (
    <form onSubmit={handleNewRoom}>
      <Stack>
        <Input
          placeholder='Enter a name of the room you want to join or create (can be a link to skribblio)'
          value={id}
          onChange={(e) => setId(e.target.value)}
          w={'full'}
          autoFocus
        />
        <Button type='submit' disabled={id === ''}>
          {id === '' ? 'Input a name of the room' : `Go to ${id}`}
        </Button>
      </Stack>
    </form>
  );
};

export default InputLink;

import { Box, ChakraProvider, Grid, theme } from '@chakra-ui/react';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import AddWords from './pages/AddWords';
import Home from './pages/Home';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign='center' fontSize='xl'>
      <Grid minH='100vh' p={3}>
        <ColorModeSwitcher justifySelf='flex-end' />
        <Router>
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
            <Route path='/:id'>
              <AddWords />
            </Route>
          </Switch>
        </Router>
      </Grid>
    </Box>
  </ChakraProvider>
);

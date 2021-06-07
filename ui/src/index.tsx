import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import 'fontsource-roboto';
import theme from './shared/theme';
import { ThemeProvider } from '@material-ui/core';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

console.log(SERVER_URL);

const client = new ApolloClient({
  uri: SERVER_URL,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ThemeProvider>
  </ApolloProvider>,
  document.getElementById('root')
);

reportWebVitals();

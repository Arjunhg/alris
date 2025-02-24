import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { theme } from './styles/theme';
import Home from './home';
import './index.css';

const paths = [
  {
    path: '/',
    element: (
      <Home/>
    )
  }
]

const BrowserRouter = createBrowserRouter(paths);

const App = () => {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <RouterProvider router={BrowserRouter} />
    </MantineProvider>
  );
};

export default App;

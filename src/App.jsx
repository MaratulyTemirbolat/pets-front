import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import router from './router/router';
import { RouterProvider } from 'react-router-dom';

function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App

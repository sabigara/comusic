import React from 'react';
import { Provider } from 'react-redux';

import initStore from './store';
import PlayBackControls from './components/PlayBackControls';

const store = initStore({})

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PlayBackControls/>
    </Provider>
  );
}

export default App;

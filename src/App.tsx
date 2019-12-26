import React from 'react';

import VolumeFader from './components/VolumeFader'

const App: React.FC = () => {
  const [ val, setVal ] = React.useState(70)

  return (
    <div className="App">
      <div style={{width: '300px'}}>
      <VolumeFader
        onChange={(e, val) => {
          console.log(val);
          setVal(val);
        }}
        onChangeCommitted={(e, val) => console.log()}
        onMouseDown={() => console.log()}
        orientation="horizontal"

        max={100}
        min={0}
        step={0.01}
        value={val}
      />
      </div>
    </div>
  );
}

export default App;


import React, { useState } from 'react';

function Home() {
  const [text, setText] = useState('');

  const onClickButton = async () => {
    await window.api.get('ping')
      .then(v => (console.log(v), v.res))
      .then(setText);
  };

  return <>
    <div>{text}</div>
    <button onClick={onClickButton}>call api!!</button>
  </>;
}

export default Home;
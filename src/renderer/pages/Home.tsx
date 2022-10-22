
import React, { useCallback, useState } from 'react';

const excel = [
  { name: 'George Washington', birthday: '1732-02-22' },
  { name: 'John Adams', birthday: '1735-10-19' },
  { name: 'John Adams', birthday2: 'birthday2!!' },
];

function Home() {
  const [text, setText] = useState('');

  const onChangeImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      console.log(e.target.files[0]);
      e.target.files[0].arrayBuffer()
        .then(buf => window.api.get('import-excel', { buf }))
        .then(console.log)
        .catch(console.error);
    }
  }, []);

  const onClickExport = useCallback(() => {
    window.api.post('export-excel', { excel })
      .then(console.log)
      .catch(console.error);
  }, []);

  return <>
    <input type='file' id='import-excel' onChange={onChangeImport} />
    <button onClick={onClickExport}>exprot</button>
  </>;
}

export default Home;
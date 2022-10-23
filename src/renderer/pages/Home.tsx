
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';
import _ from 'underbarjs';

const H1 = styled.h1`
padding: 1rem .3rem;
margin: 0;
`;
const SubHeader = styled.div`
display: flex;
justify-content: space-between;
`;
const H3 = styled.h3`
margin: .3rem;
`;
const Button = styled.button`
padding: .5rem 1rem;
margin: .3rem;
`;
const Input = styled.input`
display: none;
`;

let store: any[];

function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const filesRef = useRef<HTMLInputElement>(null);

  const onChangeImport = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const result: Promise<any> = _.go(
      e.target.files,
      _.entriesL,
      _.mapL(([, file]: [any, File]) => file),
      _.filterC(file => file instanceof File),
      _.tap(setFiles),
      _.mapC((file: File) => file.arrayBuffer()),
      (bufs: ArrayBuffer[]) => window.api.get('summary-excel', bufs)
    );

    result
      .then(res => res.res.code === 500 ? Promise.reject(res.res.data) : res)
      .then(res => store = res.res.data)
      .then(() => alert('Success!!'))
      .catch(alert);
  }, []);

  const onClickImport = useCallback(() => filesRef.current?.click(), []);

  const onClickExport = useCallback(() => {
    window.api.post('export-excel', store)
      .then(res => res.res.code === 500 ? Promise.reject(res.res.data) : res)
      .then(() => alert('Success!!'))
      .catch(alert);
  }, []);

  return <>
    <header>
      <H1>Excel summary</H1>
      <SubHeader>
        <H3>Selected files:</H3>
        <div>
          <Button onClick={onClickImport}>
            Import
            <Input ref={filesRef} type='file' onChange={onChangeImport} multiple />
          </Button>
          <Button onClick={onClickExport}>Exprot</Button>
        </div>
      </SubHeader>
    </header>
    <section>
      {files.map((file, i) => <div key={`fileName${i}`}>{file.name}</div>)}
    </section>
  </>;
}

export default Home;
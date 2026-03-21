'use client'

import { useState } from 'react';
import { Mode } from './types';
import Recovery from './Recovery/recovery';
import EntryPage from './EntryPage/page';

export default function Home() {
  const [mode, setMode] = useState<Mode>('login');
  return (
    <div>
      { 
        mode === 'recovery' ? 
        <Recovery /> :
        <EntryPage mode={mode} setMode={setMode}/>
      }
    </div>
  );
}

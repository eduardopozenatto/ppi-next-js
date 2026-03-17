'use client'

import { useState } from 'react';
import { Mode } from '../components/Props/props';
import Recovery from './Recovery/recovery';
import EntryPage from './EntryPage/entrypage';

export default function Home() {
  const [mode, setMode] = useState<Mode>('login');
  return (
    <div>
      { 
        mode == 'recovery' ? 
        <Recovery mode={mode} setMode={setMode}/> :
        <EntryPage />
      }
    </div>
  );
}

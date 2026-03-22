"use client";

import { useState } from 'react';
import FormBody from './_components/FormBody';
import Title from './_components/Title';
import { Mode } from '../types';

export default function EntryPage() {
  const [mode, setMode] = useState<Mode>('login');

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-white via-azure-50 to-azure-100 p-4 md:p-8">
      <section className="flex w-full max-w-5xl flex-col items-center justify-center gap-8 lg:flex-row lg:justify-evenly lg:gap-12">
        <Title />
        <FormBody mode={mode} setMode={setMode} />
      </section>
    </main>
  );
}

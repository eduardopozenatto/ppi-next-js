"use client"
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import { FormEvent } from 'react';

export default function RecoveryForm() {

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        // Handle form submission
    }

  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="Digite seu email"
        label="Email"
      />
      <Button
        type="submit"
      >
        Enviar
      </Button>
    </form>
  );
}

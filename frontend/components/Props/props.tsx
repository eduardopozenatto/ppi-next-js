import { MouseEventHandler } from "react";

export interface setModeProps {
  setMode: (mode: Mode) => void;
  mode: 'login' | 'register' | 'recovery';
}

export interface modeProps {
  mode: 'login' | 'register' | 'recovery';
}

export type Mode = 'login' | 'register' | 'recovery';


export type LinkProps = {
    href?: string;
    rel?: string;
    target?: string;
    type?: string;
    className?: string;
    content?: string;
    onClick?: MouseEventHandler;

}

export interface permissionProps {
  id?: bigint,
  verItens: boolean,
  pedirEmprestimos: true,
  VerNotificacoes: true,
  VerEstoque: true,
  GerarRelatorios: true,
  AprovEmprestimos: true,
  CriarItens: true,
  GerenciarItens: true,
  GerenciarUsuarios: true,
  GerenciarTag: true,
  GerenciarCat: true,
  GerenciarPermissoes: true,
}
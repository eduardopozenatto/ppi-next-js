"use client";

import { Button } from "@/components/Button/Button";

export interface ApprovalsActionsProps {
  loanId: string;
}

export function ApprovalsActions({ loanId }: ApprovalsActionsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant="primary"
        className="min-w-0 flex-1 sm:flex-none"
        onClick={() => {
          // TODO: substituir por PUT /api/loans/:id (aprovar)
          void loanId;
        }}
      >
        Aprovar
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="min-w-0 flex-1 sm:flex-none"
        onClick={() => {
          // TODO: substituir por rejeição via API
          void loanId;
        }}
      >
        Rejeitar
      </Button>
    </div>
  );
}

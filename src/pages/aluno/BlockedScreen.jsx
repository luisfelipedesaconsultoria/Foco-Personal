import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, PrimaryButton } from "../../components/ui";
import { IconCard } from "../../icons";

export default function BlockedScreen() {
  const navigate = useNavigate();
  return (
    <div className="p-5 pt-10 flex flex-col items-center text-center gap-4 page-enter">
      <div className="w-14 h-14 rounded-full bg-coral/15 text-coral flex items-center justify-center">
        <IconCard size={24} />
      </div>
      <div>
        <div className="font-display font-bold text-lg mb-1.5">Pagamento pendente</div>
        <div className="text-[12.5px] text-muted leading-relaxed max-w-[280px]">
          Esse recurso fica disponível de novo assim que sua mensalidade for regularizada.
        </div>
      </div>
      <Card className="w-full">
        <PrimaryButton onClick={() => navigate("/aluno/pagamentos")}>Ver pagamentos</PrimaryButton>
      </Card>
    </div>
  );
}

import React from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Avatar } from "../../components/ui";

export default function Perfil() {
  const { treinador } = useOutletContext();
  if (!treinador) return null;

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold mb-4">Perfil</div>

      <Card className="flex items-center gap-3">
        <Avatar initials={treinador.nome?.slice(0, 2).toUpperCase()} size={44} />
        <div>
          <div className="font-bold text-[14px]">{treinador.nome}</div>
          <div className="text-[11.5px] text-muted">{treinador.marca}</div>
        </div>
      </Card>

      <div className="text-[11px] font-bold tracking-wider uppercase text-muted mt-6 mb-2.5">Conta</div>
      <Card className="text-[11.5px] text-muted leading-relaxed">
        Fase 1 — ferramenta interna de um único treinador. Personalização de marca (nome/cor) chega numa próxima etapa.
      </Card>
    </div>
  );
}

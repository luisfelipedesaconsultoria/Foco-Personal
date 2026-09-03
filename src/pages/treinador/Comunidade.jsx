import React from "react";
import { useNavigate } from "react-router-dom";
import { useAlunos } from "../../hooks/useData";
import { Card, Avatar, PrimaryButton, Spinner, EmptyState } from "../../components/ui";
import { IconUserPlus, IconPeople } from "../../icons";

export default function Comunidade() {
  const navigate = useNavigate();
  const { data: alunos, loading } = useAlunos();

  return (
    <div className="px-[18px] pt-6 pb-4 page-enter">
      <div className="font-display text-[21px] font-bold mb-4">Comunidade</div>
      <PrimaryButton onClick={() => navigate("/treinador/comunidade/novo")} className="mt-0 mb-4">
        <IconUserPlus size={16} color="#04140A" /> Cadastrar aluno
      </PrimaryButton>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner size={22} color="#31E17A" />
        </div>
      ) : !alunos?.length ? (
        <EmptyState icon={IconPeople} title="Nenhum aluno cadastrado" description="Cadastre seu primeiro aluno pra gerar o link de acesso dele." />
      ) : (
        <div className="space-y-2.5">
          {alunos.map((a) => (
            <Card key={a.id} className="flex items-center gap-3">
              <Avatar initials={a.nome.slice(0, 2).toUpperCase()} />
              <div className="flex-1">
                <div className="font-bold text-[13px]">{a.nome}</div>
                <div className="text-[11px] text-muted capitalize mt-0.5">
                  {a.tipo} · {a.status === "convite_enviado" ? "Convite enviado" : a.status === "ativo" ? "Ativo" : "Inativo"}
                </div>
              </div>
              {a.pushAtivo && <span className="text-[9px] font-bold text-green bg-greenDim px-2 py-1 rounded-full">PUSH</span>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

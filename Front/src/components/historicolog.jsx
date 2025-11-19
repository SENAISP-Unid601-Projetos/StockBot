import React from "react"; // 1. Importe o React (necessário para o <React.Fragment>)
import { Paper, Typography } from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

function HistoricoLog({ historicoProcessado }) {
  // ✅ 2. AQUI ESTÁ A FUNÇÃO CORRIGIDA E IMPLEMENTADA
  const formatarData = (dataString) => {
    if (!dataString) {
      return "Data indisponível";
    }
    const data = new Date(dataString);
    if (isNaN(data.getTime())) {
      return "Data inválida";
    }

    // Formata para o padrão pt-BR (ex: 22/10/2025, 16:30)
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (historicoProcessado.length === 0) {
    return (
      <Typography sx={{ p: 2, textAlign: "center" }}>
        Nenhuma movimentação encontrada.
      </Typography>
    );
  }

  // O resto do seu componente (que estava perfeito)
  return (
    <Timeline position="alternate">
      {historicoProcessado.map((item) => (
        <TimelineItem key={item.id}>
          <TimelineOppositeContent color="text.secondary" sx={{ pt: "12px" }}>
            {formatarData(item.dataHora)}
          </TimelineOppositeContent>

          <TimelineSeparator>
            <TimelineDot
              color={item.tipo === "ENTRADA" ? "success" : "error"}
              variant="outlined"
            >
              {item.tipo === "ENTRADA" ? (
                <ArrowUpCircle size={20} />
              ) : (
                <ArrowDownCircle size={20} />
              )}
            </TimelineDot>
            <TimelineConnector />
          </TimelineSeparator>

          <TimelineContent sx={{ py: "12px", px: 2 }}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" component="h3">
                {item.nomeComponente || `ID: ${item.componenteId}`}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {item.tipo === "ENTRADA" ? "Entrada de" : "Saída de"}{" "}
                <strong>{item.quantidade}</strong> unidade(s).
              </Typography>
              <Typography variant="caption" color="text.secondary">
                por {item.usuario || "Sistema"}
              </Typography>
            </Paper>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

export default HistoricoLog;

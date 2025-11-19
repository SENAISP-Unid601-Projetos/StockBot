// Em: src/components/ComponentesTable.jsx (VERSÃO CORRIGIDA)
import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Stack,
  Typography,
  Button, // 1. IMPORTE O BUTTON
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart"; // 2. IMPORTE O ÍCONE

// 3. ACEITE "onSolicitar" NAS PROPS
function ComponentesTable({
  componentes,
  onEdit,
  onDelete,
  onSolicitar, // <--- AQUI
  isAdmin,
}) {
  return (
    <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3 }}>
      <TableContainer>
        <Table stickyHeader aria-label="tabela de componentes">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Patrimônio</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Quantidade</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Localização</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Categoria</TableCell>

              {/* 4. A COLUNA DE AÇÕES AGORA APARECE PARA TODOS */}
              <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {componentes.length > 0 ? (
              componentes.map((componente) => (
                <TableRow hover key={componente.id}>
                  <TableCell>{componente.nome}</TableCell>
                  <TableCell>{componente.codigoPatrimonio}</TableCell>
                  <TableCell>{componente.quantidade}</TableCell>
                  <TableCell>{componente.localizacao}</TableCell>
                  <TableCell>{componente.categoria}</TableCell>

                  {/* 5. O CONTEÚDO DA CÉLULA MUDA (Admin vs User) */}
                  <TableCell align="right">
                    {isAdmin ? (
                      // --- BOTÕES DO ADMIN ---
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          color="info"
                          size="small"
                          onClick={() => onEdit(componente)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => onDelete(componente.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    ) : (
                      // --- BOTÃO DO USUÁRIO ---
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={() => onSolicitar(componente)}
                        disabled={componente.quantidade <= 0}
                      >
                        Solicitar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  {" "}
                  {/* Agora é 6 */}
                  <Typography color="text.secondary" sx={{ p: 3 }}>
                    Nenhum componente encontrado.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ComponentesTable;

import React from 'react';

// 1. IMPORTAÇÕES DE COMPONENTES E ÍCONES DO MUI
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton, // Botão de ícone
  Stack,      // Para organizar os botões
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ComponentesTable({ componentes, onEdit, onDelete, isAdmin }) {
  return (
    // 2. A "CARCAÇA" AGORA É UM COMPONENTE <Paper> DO MUI
    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 3 }}>
      <TableContainer>
        {/* Usamos 'stickyHeader' para manter o cabeçalho visível ao rolar a página */}
        <Table stickyHeader aria-label="tabela de componentes">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Patrimônio</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
              {/* A sua lógica de 'isAdmin' continua a funcionar perfeitamente */}
              {isAdmin && <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {componentes.length > 0 ? (
              componentes.map((componente) => (
                <TableRow hover key={componente.id}>
                  <TableCell>{componente.nome}</TableCell>
                  <TableCell>{componente.codigoPatrimonio}</TableCell>
                  <TableCell>{componente.quantidade}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      {/* 3. USAMOS BOTÕES DE ÍCONE PARA UMA APARÊNCIA MAIS LIMPA */}
                      {/* Stack organiza os ícones numa linha com espaçamento */}
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          aria-label="editar"
                          color="info"
                          onClick={() => onEdit(componente)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          aria-label="excluir"
                          color="error"
                          onClick={() => onDelete(componente.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              // 4. MENSAGEM DE "NENHUM ITEM" ESTILIZADA
              <TableRow>
                <TableCell colSpan={isAdmin ? 4 : 3} align="center">
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
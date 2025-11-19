// src/pages/AjudaPage.jsx

import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function AjudaPage() {
  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default' }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
          Guia Rápido do Sistema StockBot
        </Typography>

        {/* Acordeão para o Dashboard */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">O que é o Dashboard?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              O Dashboard é a sua tela inicial. Ele mostra um resumo rápido do estado do seu estoque,
              incluindo o total de itens, a quantidade de unidades, e alertas para itens em falta ou
              com estoque baixo.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Acordeão para a Página de Componentes */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Como gerenciar os Itens?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography component="div">
              <ul>
                <li>Na página "Itens" você pode ver todos os componentes cadastrados.</li>
                <li><strong>Adicionar:</strong> Clique no botão "Adicionar Item" para abrir um formulário e cadastrar um novo componente.</li>
                <li><strong>Editar:</strong> Clique no ícone de lápis para alterar os dados de um item existente.</li>
                <li><strong>Excluir:</strong> Clique no ícone de lixeira para remover um item. Cuidado, esta ação não pode ser desfeita.</li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>
        
        {/* Acordeão para Acessibilidade */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Opções de Acessibilidade</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Na página de "Configurações", você pode ativar o Modo Escuro, o Modo para Daltonismo (que ajusta as cores para melhor contraste)
              e aumentar ou diminuir o tamanho da fonte de todo o sistema para facilitar a leitura.
            </Typography>
          </AccordionDetails>
        </Accordion>

        {/* Você pode adicionar mais seções aqui para cada página */}

      </Container>
    </Box>
  );
}

export default AjudaPage;
import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Paper,
    Typography
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

import Sidebar from '../components/sidebar';
import KpiCard from '../components/kpicard';
import ActionList from '../components/actionlist';
import CategoryChart from '../components/categoriachart';

function DashboardPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true); // Garante que o loading começa aqui
      const response = await api.get('/api/componentes');
      if (Array.isArray(response.data)) {
        setComponentes(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar dados!", error);
      toast.error("Não foi possível carregar os dados do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleGeneratePdf = async () => {
    toast.info("A gerar o relatório em PDF...");
    try {
      const historicoResponse = await api.get('/api/historico?size=100');
      const historicoData = historicoResponse.data.content;

      const mapaComponentes = new Map(componentes.map(comp => [comp.id, comp.nome]));
      const historicoProcessado = historicoData
        .map(item => ({
          ...item,
          nomeComponente: mapaComponentes.get(item.componenteId) || 'N/A'
        }));

      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("Relatório de Movimentações de Estoque", 14, 22);
      doc.setFontSize(11);
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, 14, 30);

      const tableColumn = ["Data/Hora", "Componente", "Tipo", "Qtd.", "Utilizador"];
      const tableRows = [];
      historicoProcessado.forEach(item => {
        const itemData = [
          new Date(item.dataHora).toLocaleString('pt-BR'),
          item.nomeComponente,
          item.tipo,
          item.quantidade,
          item.usuario
        ];
        tableRows.push(itemData);
      });

      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 40,
      });

      doc.save('relatorio-historico.pdf');
      toast.success("Relatório gerado com sucesso!");

    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast.error("Não foi possível gerar o relatório.");
    }
  };

  const totalUnidades = componentes.reduce((total, comp) => total + comp.quantidade, 0);
  const itensEmFalta = componentes.filter(comp => comp.quantidade <= 0);
  const itensEstoqueBaixo = componentes.filter(comp => comp.quantidade > 0 && comp.quantidade <= 5); // Pode usar o 'threshold' aqui se ele vier da API

  return (
    <>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Dashboard
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleGeneratePdf}
            >
              Gerar Relatório
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            // AQUI ESTÃO AS ALTERAÇÕES: Removido 'item' dos Grid filhos
            <Grid container spacing={3}>
              {/* --- LINHA DOS KPIs --- */}
              <Grid xs={12} md={4}> {/* Removido 'item' */}
                <KpiCard title="Total de itens" value={componentes.length} description="Tipos de itens cadastrados" />
              </Grid>
              <Grid xs={12} md={4}> {/* Removido 'item' */}
                <KpiCard title="Unidades em estoque" value={totalUnidades} description="Total de unidades no inventário" />
              </Grid>
              <Grid xs={12} md={4}> {/* Removido 'item' */}
                <KpiCard title="Itens em falta" value={itensEmFalta.length} description="Itens com estoque zerado" isCritical={true} />
              </Grid>

              {/* --- LINHA DAS AÇÕES E GRÁFICO --- */}
              <Grid xs={12} lg={8}> {/* Removido 'item' */}
                <Paper sx={{ p: 2, height: '100%' }}>
                  <CategoryChart componentes={componentes} />
                </Paper>
              </Grid>
              <Grid xs={12} lg={4}> {/* Removido 'item' */}
                <Paper sx={{ p: 2, height: '100%' }}>
                  <ActionList title="Itens com estoque baixo" items={itensEstoqueBaixo} />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}

export default DashboardPage;
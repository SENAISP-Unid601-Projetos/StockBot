import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// 1. Imports de Componentes e Ícones do MUI
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

// Imports dos seus Componentes (eles continuam a funcionar!)
import Sidebar from '../components/sidebar';
import KpiCard from '../components/kpicard';
import ActionList from '../components/actionlist';
import CategoryChart from '../components/categoriachart';

function DashboardPage() {
  const [componentes, setComponentes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- A SUA LÓGICA DE DADOS CONTINUA EXATAMENTE A MESMA ---
  const fetchData = async () => {
    try {
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
      // Usaremos a busca paginada para o histórico para ser mais eficiente
      const historicoResponse = await api.get('/api/historico?size=100'); // Pega os 100 registos mais recentes
      const historicoData = historicoResponse.data.content; // Os dados estão em 'content'
      
      const mapaComponentes = new Map(componentes.map(comp => [comp.id, comp.nome]));
      const historicoProcessado = historicoData
        .map(item => ({
          ...item,
          nomeComponente: mapaComponentes.get(item.componenteId) || 'N/A'
        }));

      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text("Relatório de Movimentações de Stock", 14, 22);
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
  const itensEstoqueBaixo = componentes.filter(comp => comp.quantidade > 0 && comp.quantidade <= 5);

  return (
    // Box é a `div` do MUI. `display: 'flex'` coloca a sidebar e o conteúdo lado a lado.
    <Box sx={{ display: 'flex' }}>
      {/* O App.jsx já renderiza a Sidebar, então podemos remover daqui */}
      
      {/* O conteúdo principal da página */}
      <Box 
        component="main" 
        sx={{ flexGrow: 1, p: 3, backgroundColor: 'background.default', minHeight: '100vh' }}
      >
        <Container maxWidth="xl">
          {/* Header da página */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight="bold">
              Dashboard
            </Typography>
            <Button
              variant="contained"
              color="primary" // Usa a cor primária do nosso tema (vermelho SENAI)
              startIcon={<PictureAsPdfIcon />}
              onClick={handleGeneratePdf}
            >
              Gerar Relatório
            </Button>
          </Box>

          {loading ? (
            // CircularProgress: O spinner de loading do MUI.
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
              <CircularProgress />
            </Box>
          ) : (
            // Grid: O sistema de grelha do MUI para alinhar os elementos de forma responsiva.
            <Grid container spacing={3}>
              {/* --- LINHA DOS KPIs --- */}
              <Grid item xs={12} md={4}>
                <KpiCard title="Total de Itens" value={componentes.length} description="Tipos de itens cadastrados" />
              </Grid>
              <Grid item xs={12} md={4}>
                <KpiCard title="Unidades em Stock" value={totalUnidades} description="Total de unidades no inventário" />
              </Grid>
              <Grid item xs={12} md={4}>
                <KpiCard title="Itens em Falta" value={itensEmFalta.length} description="Itens com stock zerado" isCritical={true} />
              </Grid>
              
              {/* --- LINHA DAS AÇÕES E GRÁFICO --- */}
              <Grid item xs={12} lg={8}>
                {/* Paper: Um "pedaço de papel" elevado com sombra. Ótimo para envolver componentes. */}
                <Paper sx={{ p: 2, height: '100%' }}>
                  <CategoryChart componentes={componentes} />
                </Paper>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <ActionList title="Itens com Stock Baixo" items={itensEstoqueBaixo} />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardPage;

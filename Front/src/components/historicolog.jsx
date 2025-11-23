import React from 'react';
import { 
  Box, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Typography, 
  Paper, 
  Divider,
  Chip
} from '@mui/material';
import { 
  ArrowCircleUp, 
  ArrowCircleDown, 
  History, 
  Inventory2Outlined 
} from '@mui/icons-material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function HistoricoLog({ historicoProcessado = [] }) {

  // Helper para definir cor e ícone baseados no tipo
  const getLogStyle = (tipo) => {
    const isEntrada = tipo?.toUpperCase() === 'ENTRADA';
    return {
      icon: isEntrada ? <ArrowCircleUp /> : <ArrowCircleDown />,
      color: isEntrada ? 'success.main' : 'error.main', // Usa as cores do tema
      bgcolor: isEntrada ? 'success.light' : 'error.light', // Fundo clarinho
      label: isEntrada ? 'Entrada' : 'Saída'
    };
  };

  const formatarData = (dataString) => {
    try {
      return format(new Date(dataString), "dd 'de' MMM • HH:mm", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        borderRadius: 4,
        overflow: 'hidden' // Garante que a lista não vaze as bordas arredondadas
      }}
    >
      {/* Cabeçalho do Card */}
      <Box sx={{ p: 2, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', gap: 1 }}>
        <History sx={{ color: 'white' }} />
        <Typography variant="h6" color="white" fontWeight="bold">
          Últimas Movimentações
        </Typography>
      </Box>

      {/* Conteúdo da Lista */}
      <Box sx={{ overflowY: 'auto', maxHeight: '400px', flexGrow: 1 }}>
        {historicoProcessado.length === 0 ? (
          // Estado Vazio
          <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
            <Inventory2Outlined sx={{ fontSize: 48, mb: 1, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              Nenhuma movimentação registrada.
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {historicoProcessado.map((item, index) => {
              const style = getLogStyle(item.tipo);
              const isLast = index === historicoProcessado.length - 1;

              return (
                <React.Fragment key={item.id || index}>
                  <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: style.bgcolor, color: style.color }}>
                        {style.icon}
                      </Avatar>
                    </ListItemAvatar>
                    
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.nomeComponente || `Item #${item.componenteId}`}
                          </Typography>
                          <Chip 
                            label={style.label} 
                            size="small" 
                            sx={{ 
                              bgcolor: style.bgcolor, 
                              color: style.color, 
                              fontWeight: 'bold',
                              height: 20,
                              fontSize: '0.7rem'
                            }} 
                          />
                        </Box>
                      }
                      secondary={
                        <Box component="span" display="flex" flexDirection="column" gap={0.5} mt={0.5}>
                          <Typography variant="body2" color="text.primary">
                            Quantidade: <strong>{item.quantidade}</strong>
                          </Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                            <Typography variant="caption" color="text.secondary">
                              por {item.usuario || 'Sistema'}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                              {formatarData(item.dataHora)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {/* Adiciona linha divisória, menos no último item */}
                  {!isLast && <Divider variant="inset" component="li" />}
                </React.Fragment>
              );
            })}
          </List>
        )}
      </Box>
    </Paper>
  );
}

export default HistoricoLog;
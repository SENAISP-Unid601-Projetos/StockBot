package com.example.Back.Service;

import com.example.Back.Dto.ComponenteDTO;
import com.example.Back.Dto.DashboardDataDTO;
import com.example.Back.Entity.Empresa;
import com.example.Back.Repository.ComponenteRepository;
import com.example.Back.Repository.PedidoCompraRepository;
import com.example.Back.Repository.RequisicaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UsuarioService usuarioService;
    private final ComponenteRepository componenteRepository;
    private final RequisicaoRepository requisicaoRepository;
    private final PedidoCompraRepository pedidoCompraRepository;

    public DashboardService(UsuarioService usuarioService, ComponenteRepository componenteRepository, RequisicaoRepository requisicaoRepository, PedidoCompraRepository pedidoCompraRepository) {
        this.usuarioService = usuarioService;
        this.componenteRepository = componenteRepository;
        this.requisicaoRepository = requisicaoRepository;
        this.pedidoCompraRepository = pedidoCompraRepository;
    }

    @Transactional(readOnly = true)
    public DashboardDataDTO getDashboardData() {
        // 1. Descobre a empresa
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        Long empId = empresa.getId();

        // 2. Busca os KPIs (Contagens rápidas)
        long totalItens = componenteRepository.countByEmpresaId(empId);
        long totalQtd = componenteRepository.sumQuantidadeByEmpresaId(empId);
        long itensFalta = componenteRepository.countItensEmFaltaByEmpresaId(empId);
        long reqPendentes = requisicaoRepository.countByEmpresaIdAndStatus(empId, "PENDENTE");
        long comprasPendentes = pedidoCompraRepository.countByEmpresaIdAndStatus(empId, "PENDENTE");

        // 3. Busca dados para Gráficos e Tabelas
        var statsCategoria = componenteRepository.countByCategoriaGrouped(empId);

        var estoqueBaixo = componenteRepository.findEstoqueBaixoByEmpresaId(empId)
                .stream().map(c -> new ComponenteDTO(c)) // Usa o construtor auxiliar do DTO
                .collect(Collectors.toList());

        // 4. Monta o pacotão
        return new DashboardDataDTO(
                totalItens,
                itensFalta,
                totalQtd,
                reqPendentes,
                comprasPendentes,
                statsCategoria,
                estoqueBaixo
        );
    }
}
package com.example.Back.Service;

import com.example.Back.Entity.Empresa;
import com.example.Back.Repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service // <-- Importante: Define como um Serviço Spring
public class SettingsService {

    private final UsuarioService usuarioService; // Depende do UsuarioService
    private final EmpresaRepository empresaRepository; // Depende do EmpresaRepository

    // Construtor para injeção de dependência
    public SettingsService(UsuarioService usuarioService, EmpresaRepository empresaRepository) {
        this.usuarioService = usuarioService;
        this.empresaRepository = empresaRepository;
    }

    /**
     * Busca o limite de stock baixo da empresa do utilizador logado.
     */
    @Transactional(readOnly = true)
    public int getLowStockThreshold() {
        // Reutiliza o helper que já criámos no UsuarioService
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        return empresa.getNivelEstoqueBaixoPadrao();
    }

    /**
     * Atualiza o limite de stock baixo da empresa do utilizador logado.
     */
    @Transactional
    public void updateLowStockThreshold(int newThreshold) {
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        empresa.setNivelEstoqueBaixoPadrao(newThreshold);
        empresaRepository.save(empresa);
    }
}
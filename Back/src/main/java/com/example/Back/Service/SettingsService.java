package com.example.Back.Service;

import com.example.Back.Entity.Empresa;
import com.example.Back.Repository.EmpresaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SettingsService {

    private final UsuarioService usuarioService;
    private final EmpresaRepository empresaRepository;

    public SettingsService(UsuarioService usuarioService, EmpresaRepository empresaRepository) {
        this.usuarioService = usuarioService;
        this.empresaRepository = empresaRepository;
    }

    @Transactional(readOnly = true)
    public int getLowStockThreshold() {
        // A mágica do multi-tenant acontece aqui.
        // Não precisamos saber o ID, o token já nos diz qual empresa é.
        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        return empresa.getNivelEstoqueBaixoPadrao();
    }

    @Transactional
    public void updateLowStockThreshold(int newThreshold) {
        // Regra de negócio: Estoque mínimo não pode ser negativo
        if (newThreshold < 0) {
            throw new IllegalArgumentException("O nível de estoque não pode ser negativo.");
        }

        Empresa empresa = usuarioService.getEmpresaDoUsuarioAutenticado();
        empresa.setNivelEstoqueBaixoPadrao(newThreshold);

        // O JPA detectaria a mudança sozinho ao fechar a transação,
        // mas o save explícito deixa o código mais legível.
        empresaRepository.save(empresa);
    }
}
package com.example.Back.config;

import com.example.Back.Entity.Empresa;
import com.example.Back.Entity.UserRole;
import com.example.Back.Entity.Usuario;
import com.example.Back.Repository.EmpresaRepository;
import com.example.Back.Repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Component
@RequiredArgsConstructor // Facilita a injeção de dependências
public class DataInitializer implements CommandLineRunner {

    // Dependências necessárias
    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    // Defina aqui os dados do seu admin padrão
    private final String ADMIN_DOMAIN = "stockbot";
    private final String ADMIN_EMAIL = "admin@stockbot.com";
    private final String ADMIN_PASS = "admin123";

    @Override
    @Transactional // Garante que tudo seja salvo no banco corretamente
    public void run(String... args) throws Exception {
        System.out.println("Verificando dados iniciais (DataInitializer)...");

        // 1. Verifica e cria a Empresa "Master" se ela não existir
        Optional<Empresa> empresaOpt = empresaRepository.findByDominio(ADMIN_DOMAIN);
        Empresa adminEmpresa;

        if (empresaOpt.isEmpty()) {
            System.out.println("Criando empresa padrão: " + ADMIN_DOMAIN);
            adminEmpresa = new Empresa();
            adminEmpresa.setDominio(ADMIN_DOMAIN);
            adminEmpresa.setNivelEstoqueBaixoPadrao(10); // Um valor padrão
            adminEmpresa = empresaRepository.save(adminEmpresa);
        } else {
            adminEmpresa = empresaOpt.get();
            System.out.println("Empresa " + ADMIN_DOMAIN + " já existe.");
        }

        // 2. Verifica e cria o Usuário Admin se ele não existir
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(ADMIN_EMAIL);

        if (usuarioOpt.isEmpty()) {
            System.out.println("Criando usuário admin padrão: " + ADMIN_EMAIL);
            Usuario adminUser = new Usuario();
            adminUser.setEmail(ADMIN_EMAIL);

            // CRIPTOGRAFA a senha antes de salvar
            adminUser.setSenha(passwordEncoder.encode(ADMIN_PASS));

            adminUser.setRole(UserRole.ADMIN);
            adminUser.setEmpresa(adminEmpresa); // Associa o admin à empresa

            usuarioRepository.save(adminUser);
            System.out.println("Usuário admin criado com sucesso!");
        } else {
            System.out.println("Usuário " + ADMIN_EMAIL + " já existe.");
        }

        System.out.println("DataInitializer concluído.");
    }
}
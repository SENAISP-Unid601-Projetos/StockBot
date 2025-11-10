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
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final EmpresaRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private final String ADMIN_DOMAIN = "stockbot";
    private final String ADMIN_EMAIL = "admin@stockbot.com";
    private final String ADMIN_PASS = "admin123";

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        System.out.println("Verificando dados iniciais (DataInitializer)...");

        // 1. Verifica e cria a Empresa "Master"
        Optional<Empresa> empresaOpt = empresaRepository.findByDominio(ADMIN_DOMAIN);
        Empresa adminEmpresa;

        if (empresaOpt.isEmpty()) {
            System.out.println("Criando empresa padrão: " + ADMIN_DOMAIN);
            adminEmpresa = new Empresa();
            adminEmpresa.setDominio(ADMIN_DOMAIN);
            adminEmpresa.setNivelEstoqueBaixoPadrao(10);
            adminEmpresa = empresaRepository.save(adminEmpresa);
        } else {
            adminEmpresa = empresaOpt.get();
            System.out.println("Empresa " + ADMIN_DOMAIN + " já existe.");
        }

        // 2. Verifica e cria/ATUALIZA o Usuário Admin
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(ADMIN_EMAIL);

        if (usuarioOpt.isEmpty()) {
            System.out.println("Criando usuário admin padrão: " + ADMIN_EMAIL);
            Usuario adminUser = new Usuario();
            adminUser.setEmail(ADMIN_EMAIL);
            adminUser.setSenha(passwordEncoder.encode(ADMIN_PASS));
            adminUser.setRole(UserRole.ADMIN); // Define o Role
            adminUser.setEmpresa(adminEmpresa);
            usuarioRepository.save(adminUser);
            System.out.println("Usuário admin criado com sucesso!");
        } else {
            // --- INÍCIO DA CORREÇÃO ---
            // Usuário existe. Vamos verificar se o Role está correto.
            Usuario adminUser = usuarioOpt.get();
            if (adminUser.getRole() != UserRole.ADMIN || adminUser.getEmpresa() == null) {
                System.out.println("Usuário " + ADMIN_EMAIL + " encontrado, atualizando para ADMIN...");
                adminUser.setRole(UserRole.ADMIN);
                adminUser.setEmpresa(adminEmpresa);

                // Opcional: descomente a linha abaixo se quiser resetar a senha para "admin123"
                // adminUser.setSenha(passwordEncoder.encode(ADMIN_PASS));

                usuarioRepository.save(adminUser);
                System.out.println("Usuário admin atualizado.");
            } else {
                // O usuário já existe e já é ADMIN
                System.out.println("Usuário " + ADMIN_EMAIL + " já existe e é ADMIN.");
            }
            // --- FIM DA CORREÇÃO ---
        }

        System.out.println("DataInitializer concluído.");
    }
}
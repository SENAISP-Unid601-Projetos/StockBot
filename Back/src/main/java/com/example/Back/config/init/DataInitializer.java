package com.example.Back.config.init;

import com.example.Back.Entity.Usuario;
import com.example.Back.Entity.UserRole;
import com.example.Back.Repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
// Verifica se o utilizador admin já existe na base de dados
        if (usuarioRepository.findByEmail("admin@senai.com").isEmpty()) {

            System.out.println("Nenhum utilizador admin encontrado, a criar um novo...");

            // Se não existir, cria um novo utilizador admin
            Usuario admin = new Usuario();
            admin.setEmail("admin@senai.com");
            // IMPORTANTE: A senha é encriptada antes de ser salva
            admin.setSenha(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);

            usuarioRepository.save(admin);

            System.out.println("Utilizador admin padrão criado com sucesso!");
        } else {
            System.out.println("Utilizador admin padrão já existe.");
        }
    }


}

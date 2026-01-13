package com.controlsave.os_system.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    // ✨ ALTERAÇÃO AQUI: Adicionei ":http://localhost:5173" após os dois pontos.
    // Isso significa: "Tente ler do properties. Se não existir, use localhost:5173".
    // Isso evita que o Backend quebre se a configuração estiver faltando.
    @Value("${app.cors.origins:http://localhost:5173}")
    private String allowedOrigins;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // ✨ .split(",") permite que no futuro você coloque várias URLs separadas por vírgula
        // Ex: http://localhost:5173,http://homologacao.com
        String[] origins = allowedOrigins.split(",");

        registry.addMapping("/**") // ✅ Aplica a TODAS as rotas
                .allowedOrigins(origins) // ✅ Usa a lista processada
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH") // ✅ Garante que o PUT (Edição) funcione
                .allowedHeaders("*") // ✅ Aceita Content-Type application/json
                .allowCredentials(true);
    }
}
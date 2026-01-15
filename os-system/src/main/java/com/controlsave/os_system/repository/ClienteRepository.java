package com.controlsave.os_system.repository;

import com.controlsave.os_system.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Aqui poderemos adicionar busca por nome depois, se precisar
    boolean existsByEmail(String email);
}
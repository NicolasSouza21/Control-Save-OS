package com.controlsave.os_system.repository;

import com.controlsave.os_system.model.Servico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// ✅ Interface mágica do Spring que já cria os métodos save, findAll, delete, etc.
@Repository
public interface ServicoRepository extends JpaRepository<Servico, Long> {
}
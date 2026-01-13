package com.controlsave.os_system.repository;

import com.controlsave.os_system.model.OrdemServico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdemServicoRepository extends JpaRepository<OrdemServico, Long> {

    // ✨ MAGIC METHOD: Apenas declarando isso, o Spring cria o SQL para buscar por status
    // Ex: repository.findByStatus("ABERTO");
    List<OrdemServico> findByStatus(String status);

    // ✨ Outro exemplo útil: Buscar por nome do cliente (contendo parte do nome, ignorando maiúsculas/minúsculas)
    List<OrdemServico> findByNomeClienteContainingIgnoreCase(String nome);
}
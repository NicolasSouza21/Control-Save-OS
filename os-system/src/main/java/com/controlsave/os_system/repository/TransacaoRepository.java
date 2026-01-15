package com.controlsave.os_system.repository;

import com.controlsave.os_system.model.Transacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {
    // Busca ordenando pelas mais recentes primeiro
    List<Transacao> findAllByOrderByDataDesc();
}
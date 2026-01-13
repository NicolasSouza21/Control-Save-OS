package com.controlsave.os_system.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tb_ordens_servico")
@Data // ✨ Lombok: Gera Getters, Setters, toString, hashcode automaticamente
@NoArgsConstructor // ✨ Construtor vazio (obrigatório pro JPA)
@AllArgsConstructor // ✨ Construtor com todos os argumentos
public class OrdemServico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =================================================================
    // 👤 DADOS DO CLIENTE
    // =================================================================
    @Column(nullable = false)
    private String nomeCliente;

    private String telefoneCliente;
    
    private String emailCliente;

    // =================================================================
    // 💻 DADOS DO EQUIPAMENTO
    // =================================================================
    @Column(nullable = false)
    private String equipamento; // Ex: Notebook Dell Inspiron 15

    private String numeroSerie;

    private String senhaDispositivo; // ⚠️ Importante para testes de acesso

    private String acessorios; // Ex: Carregador, Mouse, Case (Evita disputas na entrega)

    // =================================================================
    // 🔧 DADOS TÉCNICOS
    // =================================================================
    @Column(columnDefinition = "TEXT", nullable = false)
    private String defeitoRelatado; // O que o cliente disse que está ruim

    @Column(columnDefinition = "TEXT")
    private String laudoTecnico; // O diagnóstico real do técnico

    // Status: ABERTO, EM_ANALISE, AGUARDANDO_APROVACAO, APROVADO, CONCLUIDO, ENTREGUE
    // Usaremos String por enquanto para facilitar a compilação imediata
    private String status; 

    private BigDecimal valorTotal;

    // =================================================================
    // 📅 CONTROLE DE TEMPO
    // =================================================================
    @Column(updatable = false)
    private LocalDateTime dataAbertura;

    private LocalDateTime dataFechamento;

    // ✨ Automação: Roda antes de salvar no banco pela primeira vez
    @PrePersist
    public void prePersist() {
        if (this.dataAbertura == null) {
            this.dataAbertura = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "ABERTO";
        }
    }
}
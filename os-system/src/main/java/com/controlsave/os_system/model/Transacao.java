package com.controlsave.os_system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "transacoes")
@Data
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String descricao; // Ex: "Recebimento OS #50", "Compra de SSD"

    @Column(nullable = false)
    private Double valor; // Valor absoluto

    @Column(nullable = false)
    private String tipo; // "RECEITA" ou "DESPESA"

    private String categoria; // Ex: "Serviço", "Peças", "Aluguel"

    private LocalDate data;

    @PrePersist
    public void prePersist() {
        if (this.data == null) {
            this.data = LocalDate.now();
        }
    }
}
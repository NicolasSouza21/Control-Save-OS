package com.controlsave.os_system.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "clientes")
@Data // Lombok gera Getters, Setters, etc.
@NoArgsConstructor
@AllArgsConstructor
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Column(unique = true)
    private String email;

    private String telefone;
    private String cpf; // Opcional (PF) ou CNPJ (PJ)

    // 🏠 Endereço
    private String cep;
    private String logradouro; // Rua/Av
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado; // UF
}
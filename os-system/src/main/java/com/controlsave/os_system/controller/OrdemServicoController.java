package com.controlsave.os_system.controller;

import com.controlsave.os_system.model.OrdemServico;
import com.controlsave.os_system.repository.OrdemServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // ✅ Diz ao Spring que isso responde com JSON
@RequestMapping("/api/os") // ✅ Define a URL base: http://localhost:8080/api/os
public class OrdemServicoController {

    @Autowired
    private OrdemServicoRepository repository;

    // ==========================================================
    // 🔍 1. LISTAR TODAS (GET /api/os)
    // ==========================================================
    @GetMapping
    public List<OrdemServico> listarTodos() {
        // ✨ Dica: Se quiser ordenar por data, pode usar repository.findAll(Sort.by(...))
        return repository.findAll();
    }

    // ==========================================================
    // ➕ 2. CRIAR NOVA OS (POST /api/os)
    // ==========================================================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED) // Retorna código 201 (Sucesso)
    public OrdemServico criar(@RequestBody OrdemServico ordemServico) {
        // O @RequestBody pega o JSON enviado pelo React e transforma em Objeto Java
        return repository.save(ordemServico);
    }

    // ==========================================================
    // 🆔 3. BUSCAR UMA (GET /api/os/{id})
    // ==========================================================
    @GetMapping("/{id}")
    public ResponseEntity<OrdemServico> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build()); // Retorna 404 se não achar
    }

    // ==========================================================
    // ✏️ 4. ATUALIZAR STATUS/DADOS (PUT /api/os/{id})
    // ==========================================================
    @PutMapping("/{id}")
    public ResponseEntity<OrdemServico> atualizar(@PathVariable Long id, @RequestBody OrdemServico dadosNovos) {
        return repository.findById(id)
                .map(record -> {
                    // Atualiza apenas os campos permitidos
                    record.setNomeCliente(dadosNovos.getNomeCliente());
                    record.setEquipamento(dadosNovos.getEquipamento());
                    record.setDefeitoRelatado(dadosNovos.getDefeitoRelatado());
                    record.setStatus(dadosNovos.getStatus());
                    record.setLaudoTecnico(dadosNovos.getLaudoTecnico());
                    record.setValorTotal(dadosNovos.getValorTotal());
                    
                    // Se estiver fechando a OS agora, marca a data
                    if ("CONCLUIDO".equals(dadosNovos.getStatus()) && record.getDataFechamento() == null) {
                       record.setDataFechamento(java.time.LocalDateTime.now());
                    }

                    OrdemServico atualizado = repository.save(record);
                    return ResponseEntity.ok().body(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
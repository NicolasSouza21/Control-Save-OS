package com.controlsave.os_system.controller;

import com.controlsave.os_system.model.Servico;
import com.controlsave.os_system.repository.ServicoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/servicos")
// ✅ Libera o acesso para o Front-end (React) rodando na porta 5173
@CrossOrigin(origins = "http://localhost:5173") 
public class ServicoController {

    @Autowired
    private ServicoRepository servicoRepository;

    // 🔍 Listar todos os serviços
    @GetMapping
    public List<Servico> listarTodos() {
        return servicoRepository.findAll();
    }

    // 💾 Criar um novo serviço
    @PostMapping
    public ResponseEntity<Servico> criar(@RequestBody Servico servico) {
        Servico novoServico = servicoRepository.save(servico);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoServico);
    }
    
    // 🗑️ Deletar serviço (útil para organizar o catálogo)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (servicoRepository.existsById(id)) {
            servicoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
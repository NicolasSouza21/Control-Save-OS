package com.controlsave.os_system.controller;

import com.controlsave.os_system.model.Transacao;
import com.controlsave.os_system.repository.TransacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/financeiro")
@CrossOrigin(origins = "http://localhost:5173")
public class TransacaoController {

    @Autowired
    private TransacaoRepository transacaoRepository;

    @GetMapping
    public List<Transacao> listar() {
        return transacaoRepository.findAllByOrderByDataDesc();
    }

    @PostMapping
    public ResponseEntity<Transacao> criar(@RequestBody Transacao transacao) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transacaoRepository.save(transacao));
    }

    // ✨ NOVA ROTA: Editar Transação
    @PutMapping("/{id}")
    public ResponseEntity<Transacao> atualizar(@PathVariable Long id, @RequestBody Transacao dadosNovos) {
        return transacaoRepository.findById(id)
                .map(transacao -> {
                    transacao.setDescricao(dadosNovos.getDescricao());
                    transacao.setValor(dadosNovos.getValor());
                    transacao.setTipo(dadosNovos.getTipo());
                    transacao.setCategoria(dadosNovos.getCategoria());
                    // A data mantemos a original ou atualizamos se quiser (aqui mantive a original da criação)
                    
                    Transacao atualizada = transacaoRepository.save(transacao);
                    return ResponseEntity.ok(atualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (transacaoRepository.existsById(id)) {
            transacaoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
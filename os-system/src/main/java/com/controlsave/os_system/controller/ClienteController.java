package com.controlsave.os_system.controller;

import com.controlsave.os_system.model.Cliente;
import com.controlsave.os_system.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clientes") // ✅ Prefixo /api garantido
@CrossOrigin(origins = "http://localhost:5173")
public class ClienteController {

    @Autowired
    private ClienteRepository clienteRepository;

    @GetMapping
    public List<Cliente> listar() {
        return clienteRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<?> criar(@RequestBody Cliente cliente) {
        // Validação simples de e-mail duplicado
        if (cliente.getEmail() != null && !cliente.getEmail().isEmpty() && 
            clienteRepository.existsByEmail(cliente.getEmail())) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado.");
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(clienteRepository.save(cliente));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (clienteRepository.existsById(id)) {
            clienteRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
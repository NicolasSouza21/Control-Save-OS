package com.controlsave.os_system.controller;

import com.controlsave.os_system.model.OrdemServico;
import com.controlsave.os_system.model.Transacao; // ✨ Import necessário
import com.controlsave.os_system.repository.OrdemServicoRepository;
import com.controlsave.os_system.repository.TransacaoRepository; // ✨ Import necessário
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/os")
// ✅ Libera o acesso para o React (Importante para evitar erro de CORS)
@CrossOrigin(origins = "http://localhost:5173") 
public class OrdemServicoController {

    @Autowired
    private OrdemServicoRepository repository;

    @Autowired
    private TransacaoRepository transacaoRepository; // ✨ Injeção do módulo Financeiro

    // ==========================================================
    // 🔍 1. LISTAR TODAS
    // ==========================================================
    @GetMapping
    public List<OrdemServico> listarTodos() {
        return repository.findAll();
    }

    // ==========================================================
    // ➕ 2. CRIAR NOVA OS
    // ==========================================================
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrdemServico criar(@RequestBody OrdemServico ordemServico) {
        return repository.save(ordemServico);
    }

    // ==========================================================
    // 🆔 3. BUSCAR POR ID
    // ==========================================================
    @GetMapping("/{id}")
    public ResponseEntity<OrdemServico> buscarPorId(@PathVariable Long id) {
        return repository.findById(id)
                .map(record -> ResponseEntity.ok().body(record))
                .orElse(ResponseEntity.notFound().build());
    }

    // ==========================================================
    // ✏️ 4. ATUALIZAR (COM INTEGRAÇÃO FINANCEIRA)
    // ==========================================================
    @PutMapping("/{id}")
    public ResponseEntity<OrdemServico> atualizar(@PathVariable Long id, @RequestBody OrdemServico dadosNovos) {
        return repository.findById(id)
                .map(record -> {
                    // Atualiza dados básicos
                    record.setNomeCliente(dadosNovos.getNomeCliente());
                    record.setEquipamento(dadosNovos.getEquipamento());
                    record.setDefeitoRelatado(dadosNovos.getDefeitoRelatado());
                    record.setLaudoTecnico(dadosNovos.getLaudoTecnico());
                    record.setValorTotal(dadosNovos.getValorTotal()); // Importante estar atualizado antes de faturar

                    // Verifica mudança de Status
                    String novoStatus = dadosNovos.getStatus();
                    record.setStatus(novoStatus);

                    // 📅 Se finalizou, marca a data de fechamento
                    if (("CONCLUIDO".equalsIgnoreCase(novoStatus) || "ENTREGUE".equalsIgnoreCase(novoStatus)) 
                            && record.getDataFechamento() == null) {
                        record.setDataFechamento(LocalDateTime.now());
                    }

                    // 💰 LÓGICA FINANCEIRA AUTOMÁTICA
                    // Se o status for CONCLUIDO ou ENTREGUE e ainda não tiver sido faturado:
                    if (("CONCLUIDO".equalsIgnoreCase(novoStatus) || "ENTREGUE".equalsIgnoreCase(novoStatus))
                            && !Boolean.TRUE.equals(record.getFaturado())) {
                        
                        // Só lança se tiver valor maior que zero
                        if (record.getValorTotal() != null && record.getValorTotal().doubleValue() > 0) {
                            
                            Transacao receita = new Transacao();
                            receita.setDescricao("Receita OS #" + record.getId() + " - " + record.getNomeCliente());
                            receita.setValor(record.getValorTotal().doubleValue());
                            receita.setTipo("RECEITA");
                            receita.setCategoria("Serviço Técnico"); // Categoria automática
                            receita.setData(LocalDate.now());

                            // Salva no financeiro
                            transacaoRepository.save(receita);
                            
                            // 🔒 Trava a OS para não duplicar o dinheiro se editar depois
                            record.setFaturado(true);
                        }
                    }

                    OrdemServico atualizado = repository.save(record);
                    return ResponseEntity.ok().body(atualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
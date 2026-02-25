package br.treinamento.demo.controller;

import br.treinamento.demo.domain.Quarto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/quartos")
@CrossOrigin("*") 
public class QuartoController {
    
    public static List<Quarto> quartos = new ArrayList<>();

    // 1. CADASTRAR (POST)
    @PostMapping
    public ResponseEntity<Quarto> cadastrar(@RequestBody Quarto quarto) {
        // Gera o Número do Quarto (começando do 100)
        int numero = quartos.stream().mapToInt(Quarto::getNumero).max().orElse(100) + 1;
        quarto.setNumero(numero);
        
        // Garante que todo quarto recém-criado comece livre
        quarto.setOcupado(false);
        
        quartos.add(quarto);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(quarto);
    }

    // 2. LISTAR TODOS (GET)
    @GetMapping
    public ResponseEntity<List<Quarto>> listar() {
        return ResponseEntity.ok(quartos);
    }

    // 3. BUSCAR UM QUARTO ESPECÍFICO (GET com ID)
    @GetMapping("/{numero}")
    public ResponseEntity<Quarto> buscarPorNumero(@PathVariable int numero) {
        for (Quarto q : quartos) {
            if (q.getNumero() == numero) {
                return ResponseEntity.ok(q);
            }
        }
        
        return ResponseEntity.notFound().build(); 
    }

    // 4. ATUALIZAR (PUT com ID)
    @PutMapping("/{numero}")
    public ResponseEntity<Quarto> atualizar(@PathVariable int numero, @RequestBody Quarto quartoAtualizado) {
        for (Quarto q : quartos) {
            if (q.getNumero() == numero) {
                // Atualiza apenas a capacidade e o valor da diária
                q.setQuantidadeHospedes(quartoAtualizado.getQuantidadeHospedes());
                q.setValorDiaria(quartoAtualizado.getValorDiaria());
                
                return ResponseEntity.ok(q);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // 5. EXCLUIR (DELETE com ID)
    @DeleteMapping("/{numero}")
    public ResponseEntity<Object> excluir(@PathVariable int numero) {
        for (Quarto q : quartos) {
            if (q.getNumero() == numero) {
                // REGRA DE NEGÓCIO: Impede exclusão se estiver ocupado
                if (q.isOcupado()) {
                    return ResponseEntity.badRequest().body("Erro: Não é possível excluir um quarto ocupado.");
                }
                
                quartos.remove(q);
                return ResponseEntity.noContent().build(); 
            }
        }
        
        return ResponseEntity.notFound().build();
    }
}
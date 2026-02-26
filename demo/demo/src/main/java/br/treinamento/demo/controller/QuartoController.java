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

   
    @PostMapping
    public ResponseEntity<Quarto> cadastrar(@RequestBody Quarto quarto) {
       
        int numero = quartos.stream().mapToInt(Quarto::getNumero).max().orElse(100) + 1;
        quarto.setNumero(numero);
        
       
        quarto.setOcupado(false);
        
        quartos.add(quarto);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(quarto);
    }

    
    @GetMapping
    public ResponseEntity<List<Quarto>> listar() {
        return ResponseEntity.ok(quartos);
    }

    
    @GetMapping("/{numero}")
    public ResponseEntity<Quarto> buscarPorNumero(@PathVariable int numero) {
        for (Quarto q : quartos) {
            if (q.getNumero() == numero) {
                return ResponseEntity.ok(q);
            }
        }
        
        return ResponseEntity.notFound().build(); 
    }

  
    @PutMapping("/{numero}")
    public ResponseEntity<Quarto> atualizar(@PathVariable int numero, @RequestBody Quarto quartoAtualizado) {
        for (Quarto q : quartos) {
            if (q.getNumero() == numero) {
               
                q.setQuantidadeHospedes(quartoAtualizado.getQuantidadeHospedes());
                q.setValorDiaria(quartoAtualizado.getValorDiaria());
                
                return ResponseEntity.ok(q);
            }
        }
        return ResponseEntity.notFound().build();
    }

    
    @DeleteMapping("/{numero}")
    public ResponseEntity<Object> excluir(@PathVariable int numero) {
        for (Quarto q : quartos) {
            if (q.getNumero() == numero) {
                
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
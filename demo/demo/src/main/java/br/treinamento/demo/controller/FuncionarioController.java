package br.treinamento.demo.controller;

import br.treinamento.demo.domain.Funcionario;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/funcionarios")
@CrossOrigin("*") 
public class FuncionarioController {

    private List<Funcionario> funcionarios = new ArrayList<>();

    
    @PostMapping
    public ResponseEntity<Funcionario> cadastrar(@RequestBody Funcionario funcionario) {
        
        int codigo = funcionarios.stream().mapToInt(Funcionario::getCodigo).max().orElse(0) + 1;
        funcionario.setCodigo(codigo);
        
        funcionarios.add(funcionario);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(funcionario);
    }

    
    @GetMapping
    public ResponseEntity<List<Funcionario>> listar() {
        return ResponseEntity.ok(funcionarios);
    }

    
    @GetMapping("/{codigo}")
    public ResponseEntity<Funcionario> buscarPorCodigo(@PathVariable int codigo) {
        for (Funcionario f : funcionarios) {
            if (f.getCodigo() == codigo) {
                return ResponseEntity.ok(f);
            }
        }
        
        return ResponseEntity.notFound().build(); 
    }

    
    @PutMapping("/{codigo}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable int codigo, @RequestBody Funcionario funcionarioAtualizado) {
        for (Funcionario f : funcionarios) {
            if (f.getCodigo() == codigo) {
                f.setNome(funcionarioAtualizado.getNome());
                f.setCargo(funcionarioAtualizado.getCargo());
                f.setTelefone(funcionarioAtualizado.getTelefone());
                
                f.setSalario(funcionarioAtualizado.getSalario());
                
                return ResponseEntity.ok(f);
            }
        }
        return ResponseEntity.notFound().build();
    }

    
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> excluir(@PathVariable int codigo) {
       
        boolean removido = funcionarios.removeIf(f -> f.getCodigo() == codigo);
        
        if (removido) {
            return ResponseEntity.noContent().build(); 
        }
        
        return ResponseEntity.notFound().build();
    }
}
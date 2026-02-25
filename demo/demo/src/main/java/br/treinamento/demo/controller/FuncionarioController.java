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

    // 1. CADASTRAR (POST)
    @PostMapping
    public ResponseEntity<Funcionario> cadastrar(@RequestBody Funcionario funcionario) {
        // CORREÇÃO 1: getCodigo() no lugar de getCargo()
        int codigo = funcionarios.stream().mapToInt(Funcionario::getCodigo).max().orElse(0) + 1;
        funcionario.setCodigo(codigo);
        
        funcionarios.add(funcionario);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(funcionario);
    }

    // 2. LISTAR TODOS (GET)
    @GetMapping
    public ResponseEntity<List<Funcionario>> listar() {
        return ResponseEntity.ok(funcionarios);
    }

    // 3. BUSCAR UM Funcionario ESPECÍFICO (GET com ID)
    @GetMapping("/{codigo}")
    public ResponseEntity<Funcionario> buscarPorCodigo(@PathVariable int codigo) {
        for (Funcionario f : funcionarios) {
            if (f.getCodigo() == codigo) {
                return ResponseEntity.ok(f);
            }
        }
        
        return ResponseEntity.notFound().build(); 
    }

    // 4. ATUALIZAR (PUT com ID)
    @PutMapping("/{codigo}")
    public ResponseEntity<Funcionario> atualizar(@PathVariable int codigo, @RequestBody Funcionario funcionarioAtualizado) {
        for (Funcionario f : funcionarios) {
            if (f.getCodigo() == codigo) {
                f.setNome(funcionarioAtualizado.getNome());
                f.setCargo(funcionarioAtualizado.getCargo());
                f.setTelefone(funcionarioAtualizado.getTelefone());
                // CORREÇÃO 2: Adicionado o salário na atualização
                f.setSalario(funcionarioAtualizado.getSalario());
                
                return ResponseEntity.ok(f);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // 5. EXCLUIR (DELETE com ID)
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> excluir(@PathVariable int codigo) {
        // CORREÇÃO 3: Usando removeIf para apagar com segurança
        boolean removido = funcionarios.removeIf(f -> f.getCodigo() == codigo);
        
        if (removido) {
            return ResponseEntity.noContent().build(); 
        }
        
        return ResponseEntity.notFound().build();
    }
}
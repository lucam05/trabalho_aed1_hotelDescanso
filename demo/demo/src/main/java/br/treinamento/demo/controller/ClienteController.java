package br.treinamento.demo.controller;

import br.treinamento.demo.domain.Cliente;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin("*") 
public class ClienteController {

    public static List<Cliente> clientes = new ArrayList<>();
// 1. CADASTRAR (POST)
    @PostMapping
    public ResponseEntity<Cliente> cadastrar(@RequestBody Cliente cliente) {
        // Gera o ID automaticamente (simulando o Auto-Increment do banco)
        int codigo = clientes.stream().mapToInt(Cliente::getCodigo).max().orElse(0) + 1;
        cliente.setCodigo(codigo);
        
        clientes.add(cliente);
        
        // Retorna o Status 201 (Created) e o cliente salvo
        return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
    }

    // 2. LISTAR TODOS (GET)
    @GetMapping
    public ResponseEntity<List<Cliente>> listar() {
        // Retorna a lista inteira com o Status 200 (OK)
        return ResponseEntity.ok(clientes);
    }

    // 3. BUSCAR UM CLIENTE ESPECÍFICO (GET com ID)
    
    @GetMapping("/{codigo}")
    public ResponseEntity<Cliente> buscarPorCodigo(@PathVariable int codigo) {
        for (Cliente c : clientes) {
            if (c.getCodigo() == codigo) {
                return ResponseEntity.ok(c);
            }
        }
        
        return ResponseEntity.notFound().build(); 
    }

    // 4. ATUALIZAR (PUT com ID)
    @PutMapping("/{codigo}")
    public ResponseEntity<Cliente> atualizar(@PathVariable int codigo, @RequestBody Cliente clienteAtualizado) {
        for (Cliente c : clientes) {
            if (c.getCodigo() == codigo) {
                // Atualiza apenas os campos permitidos
                c.setNome(clienteAtualizado.getNome());
                c.setEndereco(clienteAtualizado.getEndereco());
                c.setTelefone(clienteAtualizado.getTelefone());
                
                return ResponseEntity.ok(c);
            }
        }
        return ResponseEntity.notFound().build();
    }

    // 5. EXCLUIR (DELETE com ID)
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> excluir(@PathVariable int codigo) {
        boolean removido = clientes.removeIf(c -> c.getCodigo() == codigo);
        
        if (removido) {
            // Retorna Status 204 (No Content) - Deu certo, mas não há dados para mostrar na tela
            return ResponseEntity.noContent().build(); 
        }
        
        return ResponseEntity.notFound().build();
    }
}
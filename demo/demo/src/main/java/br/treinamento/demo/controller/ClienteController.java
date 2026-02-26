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

    @PostMapping
    public ResponseEntity<Cliente> cadastrar(@RequestBody Cliente cliente) {
        
        int codigo = clientes.stream().mapToInt(Cliente::getCodigo).max().orElse(0) + 1;
        cliente.setCodigo(codigo);
        
        clientes.add(cliente);
        
        
        return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
    }

   
    @GetMapping
    public ResponseEntity<List<Cliente>> listar() {
      
        return ResponseEntity.ok(clientes);
    }

    
    
    @GetMapping("/{codigo}")
    public ResponseEntity<Cliente> buscarPorCodigo(@PathVariable int codigo) {
        for (Cliente c : clientes) {
            if (c.getCodigo() == codigo) {
                return ResponseEntity.ok(c);
            }
        }
        
        return ResponseEntity.notFound().build(); 
    }

    
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

   
    @DeleteMapping("/{codigo}")
    public ResponseEntity<Void> excluir(@PathVariable int codigo) {
        boolean removido = clientes.removeIf(c -> c.getCodigo() == codigo);
        
        if (removido) {
            
            return ResponseEntity.noContent().build(); 
        }
        
        return ResponseEntity.notFound().build();
    }
}
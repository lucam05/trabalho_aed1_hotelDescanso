package br.treinamento.demo.controller;

import br.treinamento.demo.domain.Cliente;
import br.treinamento.demo.domain.Estadia;
import br.treinamento.demo.domain.Quarto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/estadias")
@CrossOrigin("*") 
public class EstadiaController {

    public static List<Estadia> estadias = new ArrayList<>();

    @PostMapping
    public ResponseEntity<Object> registrarEstadia(@RequestBody Estadia novaEstadia) {
        long dias = ChronoUnit.DAYS.between(novaEstadia.getDataEntrada(), novaEstadia.getDataSaida());
        
        if (dias <= 0) {
            return ResponseEntity.badRequest().body("Erro: A data de saída deve ser posterior à data de entrada.");
        }

        
        boolean clienteExiste = ClienteController.clientes.stream()
                .anyMatch(c -> c.getCodigo() == novaEstadia.getCodigoCliente());
        
        if (!clienteExiste) {
            return ResponseEntity.badRequest().body("Erro: Cliente não encontrado.");
        }

        
        Quarto quartoDisponivel = QuartoController.quartos.stream()
                .filter(q -> !q.isOcupado() && q.getQuantidadeHospedes() >= novaEstadia.getQuantidadeHospedes())
                .findFirst()
                .orElse(null);

        if (quartoDisponivel == null) {
            return ResponseEntity.badRequest().body("Erro: Nenhum quarto disponível para esta quantidade de hóspedes.");
        }

        
        quartoDisponivel.setOcupado(true);
        novaEstadia.setNumeroQuarto(quartoDisponivel.getNumero());
        novaEstadia.setQuantidadeDiarias((int) dias);
        novaEstadia.setAtiva(true);

        int codigo = estadias.stream().mapToInt(Estadia::getCodigo).max().orElse(0) + 1;
        novaEstadia.setCodigo(codigo);

        estadias.add(novaEstadia);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(novaEstadia);
    }

    @PostMapping("/{codigo}/checkout") 
    public ResponseEntity<Object> darBaixa(@PathVariable int codigo) {
        for (Estadia e : estadias) {
            if (e.getCodigo() == codigo) {
                if (!e.isAtiva()) {
                    return ResponseEntity.badRequest().body("Erro: Esta estadia já se encontra finalizada.");
                }

               
                e.setAtiva(false); 

                
                double valorDiaria = 0.0;
                for(Quarto q : QuartoController.quartos) {
                    if(q.getNumero() == e.getNumeroQuarto()) {
                        q.setOcupado(false);
                        valorDiaria = q.getValorDiaria();
                        break;
                    }
                }

                
                double valorTotal = valorDiaria * e.getQuantidadeDiarias();
                int pontosGanhos = e.getQuantidadeDiarias() * 10;

                
                for(Cliente c : ClienteController.clientes) {
                    if(c.getCodigo() == e.getCodigoCliente()) {
                        c.adicionarPontosFidelidade(pontosGanhos);
                        break;
                    }
                }

                
                Map<String, Object> resposta = new HashMap<>();
                resposta.put("valorTotal", valorTotal);
                resposta.put("pontosGanhos", pontosGanhos);

                return ResponseEntity.ok(resposta); 
            }
        }
        return ResponseEntity.notFound().build(); 
    }

    @GetMapping("/cliente/{codigoCliente}")
    public ResponseEntity<List<Estadia>> listarPorCliente(@PathVariable int codigoCliente) {
        
        List<Estadia> estadiasDoCliente = estadias.stream()
                .filter(e -> e.getCodigoCliente() == codigoCliente && e.isAtiva())
                .collect(Collectors.toList());

        return ResponseEntity.ok(estadiasDoCliente);
    }
}
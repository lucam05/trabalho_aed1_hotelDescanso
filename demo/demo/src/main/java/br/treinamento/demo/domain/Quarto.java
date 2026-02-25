package br.treinamento.demo.domain;

public class Quarto {
    private Integer numero;
    private int quantidadeHospedes;
    private double valorDiaria;
    private boolean ocupado;

    public Quarto(){
    }

    public Quarto(Integer numero, int quantidadeHospedes, double valorDiaria) {
        this.numero = numero;
        this.quantidadeHospedes = quantidadeHospedes;
        this.valorDiaria = valorDiaria;
        this.ocupado = false; 
    }

    
    public Integer getNumero() { 
        return numero; 
    }
    public void setNumero(int numero){
        this.numero = numero;
    }

    public boolean isOcupado() { 
        return ocupado; 
    }
    public void setOcupado(boolean ocupado) {
         this.ocupado = ocupado; 
        }
    public int getQuantidadeHospedes() { 
        return quantidadeHospedes; 
    }
    public void setQuantidadeHospedes(int quantidadeHospedes){
        this.quantidadeHospedes = quantidadeHospedes;
    }
    public double getValorDiaria(){
        return valorDiaria;
    }
    public void setValorDiaria(double valorDiaria){
        this.valorDiaria=valorDiaria;
    }

@Override
    public String toString() {
        String status = ocupado ? "Ocupado" : "Livre";
        return "Quarto: " + numero + 
               " | Cap: " + quantidadeHospedes + " pessoas" +
               " | Valor: R$ " + String.format("%.2f", valorDiaria) + 
               " | Status: " + status;
    }    

    
}
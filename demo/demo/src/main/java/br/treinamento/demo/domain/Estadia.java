package br.treinamento.demo.domain;

import java.time.LocalDate;

public class Estadia {
    private int codigo;
    private LocalDate dataEntrada;
    private LocalDate dataSaida;
    private int quantidadeDiarias;
    private int codigoCliente;
    private int numeroQuarto;
    private int quantidadeHospedes;
    private boolean ativa;

    public Estadia(){
    }

    public Estadia(int codigo, LocalDate ent, LocalDate sai, int dias, int codCli, int numQuarto, int qtdHosp) {
        this.codigo = codigo;
        this.dataEntrada = ent;
        this.dataSaida = sai;
        this.quantidadeDiarias = dias;
        this.codigoCliente = codCli;
        this.numeroQuarto = numQuarto;
        this.quantidadeHospedes = qtdHosp;
        this.ativa = true;
    }

    public int getCodigo() {
        return codigo;
    }

    public void setCodigo(int codigo) {
        this.codigo = codigo;
    }

    public LocalDate getDataEntrada() {
        return dataEntrada;
    }

    public void setDataEntrada(LocalDate dataEntrada) {
        this.dataEntrada = dataEntrada;
    }

    public LocalDate getDataSaida() {
        return dataSaida;
    }

    public void setDataSaida(LocalDate dataSaida) {
        this.dataSaida = dataSaida;
    }

    public int getQuantidadeDiarias() {
        return quantidadeDiarias;
    }

    public void setQuantidadeDiarias(int quantidadeDiarias) {
        this.quantidadeDiarias = quantidadeDiarias;
    }

    public int getCodigoCliente() {
        return codigoCliente;
    }

    public void setCodigoCliente(int codigoCliente) {
        this.codigoCliente = codigoCliente;
    }

    public int getNumeroQuarto() {
        return numeroQuarto;
    }

    public void setNumeroQuarto(int numeroQuarto) {
        this.numeroQuarto = numeroQuarto;
    }

    public int getQuantidadeHospedes() {
        return quantidadeHospedes;
    }

    public void setQuantidadeHospedes(int quantidadeHospedes) {
        this.quantidadeHospedes = quantidadeHospedes;
    }

    
    public boolean isAtiva() {
        return ativa;
    }

    public void setAtiva(boolean ativa) {
        this.ativa = ativa;
    }

    
    @Override
    public String toString() {
        String status = ativa ? "Ativa" : "Finalizada";
        return "Estadia Cod: " + codigo + 
               " | Quarto: " + numeroQuarto + 
               " | Cliente Cod: " + codigoCliente + 
               " | Entrada: " + dataEntrada +
               " | Saída: " + dataSaida +
               " | Status: " + status;
    }

    
}
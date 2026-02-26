package br.treinamento.demo.domain;

public class Cliente {
   
    private Integer codigo; 
    private String nome;
    private String endereco;
    private String telefone;
    private Integer pontosFidelidade; 

    
    public Cliente() {
    }

    public Cliente(Integer codigo, String nome, String endereco, String telefone) {
        this.codigo = codigo;
        this.nome = nome;
        this.endereco = endereco;
        this.telefone = telefone;
        this.pontosFidelidade = 0;
    }

    
    public Integer getCodigo() {
        return codigo;
    }

    public void setCodigo(Integer codigo) {
        this.codigo = codigo;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEndereco() {
        return endereco;
    }

    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

    public Integer getPontosFidelidade() {
        return pontosFidelidade;
    }

    public void setPontosFidelidade(Integer pontosFidelidade) {
        this.pontosFidelidade = pontosFidelidade;
    }
    
    public void adicionarPontosFidelidade(Integer pontos) {
        if (this.pontosFidelidade == null) {
            this.pontosFidelidade = 0;
        }
        this.pontosFidelidade += pontos;
    }

    @Override
    public String toString() {
        return "Cod: " + codigo + 
               " | Nome: " + nome + 
               " | Tel: " + telefone + 
               " | Pontos: " + pontosFidelidade;
    }
}
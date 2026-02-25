package br.treinamento.demo.domain;

public class Funcionario {
    private Integer codigo;
    private String nome;
    private String cargo;
    private String telefone;
    private double salario;

    public Funcionario(){
    }

    public Funcionario(Integer codigo, String nome, String cargo, String telefone,double salario) {
        this.codigo = codigo;
        this.nome = nome;
        this.cargo = cargo;
        this.telefone = telefone;
        this.salario = salario;
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

    public String getCargo() {
        return cargo;
    }

    public void setCargo(String cargo) {
        this.cargo = cargo;
    }

    public String getTelefone() {
        return telefone;
    }

    public void setTelefone(String telefone) {
        this.telefone = telefone;
    }

        public double getSalario() {
        return salario;
    }

    public void setSalario(double salario) {
        this.salario = salario;
    }

}

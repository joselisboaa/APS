## Padrão GoF implementado
O padrão strategy foi implementado em Services já que os services utilizam os mesmos métodos (CRUD), e apenas mudando a implementação, com isso o strategy podia ser utilizado já que basta mudarmos o algoritmo que será utilizado para poder fazer qualquer operação do CRUD em uma entidade em específico.
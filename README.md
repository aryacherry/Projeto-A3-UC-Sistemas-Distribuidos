# Projeto-A3-UC-Sistemas-Distribuidos
**Documentação de Instalação - Sistema de Reservas de Restaurante**  
**Disciplina:** Sistemas Distribuídos e Mobile  
**Turma:** Quarta/Matutina  
**Data de Entrega:** 11/06/2025  

---

# 1. Requisitos do Sistema

# 1.1. Pré-requisitos
Antes de iniciar, verifique se os seguintes componentes estão instalados:  

| **Componente**       | **Versão Recomendada** | **Link de Download**                     |
|----------------------|------------------------|------------------------------------------|
| Node.js              | 18.x ou superior       | [https://nodejs.org/](https://nodejs.org/) |
| PostgreSQL           | 15.x ou superior       | [https://www.postgresql.org/download/](https://www.postgresql.org/download/) |

---

# 2. Instalação do Banco de Dados (PostgreSQL)

# 2.1. Configuração Inicial
# 1. Instale o PostgreSQL: seguindo o instalador do seu sistema operacional.  
# 2. Abra o terminal:  e execute o comando abaixo para acessar o PostgreSQL:

    CMD (o que o senhor tiver disponível)
    (sudo -u postgres psql)

# 2.2. Criação do Banco de Dados
1. Crie o banco de dados:  

    sql
   (CREATE DATABASE restaurant_reservations;)
    
2. Conecte-se ao banco criado:

    sql
   (\c restaurant_reservations)
   
3. Execute o script `schema.sql` para criar as tabelas:  

   CMD/Bash
   (psql -U postgres -d restaurant_reservations -a -f scripts/schema.sql)


# 2.3. Configuração de Acesso
Edite o arquivo `pg_hba.conf` (localizado em `/etc/postgresql/[versão]/main/` no Linux ou `C:\Program Files\PostgreSQL\[versão]\data` no Windows) para permitir conexões:  

# Adicione esta linha:
(host    all             all             127.0.0.1/32            md5)

Reinicie o serviço:  

    CMD/ Bash
    (sudo service postgresql restart)

---

# 3. Configuração do Backend (Node.js/Express)

# 3.1. Instalação das Dependências
1. Acesse a pasta `server`:  
   
   CMD/Bash
   (cd server)

2. Instale os pacotes necessários:  
   
   CMD/Bash
   (npm install)
 

# 3.2. Configuração do Ambiente
1. Crie um arquivo `.env` na pasta `server` com:  
   
   ( DATABASE_URL=postgresql://postgres:senha@localhost:5432/restaurant_reservations
   PORT=3000 )
    
   > **Nota:** Substitua `senha` pela senha do seu PostgreSQL.

2. **Inicie o servidor:**  
   
   CMD/Bash
   (npm run dev) 
     
   Saída esperada:  
  
  (
   🚀 Servidor rodando na porta 3000
   ✔ Conectado ao PostgreSQL com sucesso!
  )

---

# 4. Configuração do Frontend

# 4.1. Execução
1. Abra os arquivos HTML diretamente no navegador:  
   - **Atendente:** `frontend/cliente-atendente/index.html`  
   - **Garçom:** `frontend/cliente-garcom/index.html`  
   - **Gerente:** `frontend/cliente-gerente/index.html`  

2. **Para desenvolvimento**, use a extensão **Live Server** do VSCode para evitar problemas com CORS.

---

# 5. Testes Iniciais

## 5.1. Banco de Dados
Verifique se as tabelas foram criadas:  

    sql
    (
    \dt
    )

Saída esperada:  

          Lista de relações
| Esquema |   Nome    | Tipo   |  Dono|
|---------|-----------|--------|--------|
| public  | garcons   | tabela | postgres|
| public  | reservas  | tabela | postgres|


# 5.2. API
Teste os endpoints com **Postman** ou **curl**:  

CMD/Bash
(
curl http://localhost:3000/gerente/garcons
) 

Resposta esperada (JSON):  

(
[]
)

---

# 6. Solução de Problemas Comuns

| **Problema**                          | **Solução**                                                                 |
|---------------------------------------|-----------------------------------------------------------------------------|
| Erro de conexão com PostgreSQL        | Verifique se o serviço está rodando (`service postgresql status`).     |
| Porta 3000 em uso                     | Altere a `PORT` no `.env` ou execute `kill -9 $(lsof -t -i:3000)`.          |
| Dados não persistem                   | Confira se o `schema.sql` foi executado sem erros.                          |

---

# 7. Diagrama de Arquitetura


Cliente (Frontend) → API REST (Node.js/Express) → PostgreSQL
       (HTML/JS/CSS)   ↑↓ JSON                   ↑↓ SQL



**Próximos Passos:**  
 1. vídeo de apresentação do trabalho: 

**Equipe:**  
Roan Nascimento Lisboa, 
Alice, 
Catarina,
Eduardo,  
**Repositório GitHub:** https://github.com/RoanNL/Projeto-A3-UC-Sistemas-Distribuidos

--- 

Este documento garante que todos os requisitos da UC sejam atendidos, incluindo:  
✔ Comunicação via API REST  
✔ Banco de dados relacional (PostgreSQL)  
✔ Três tipos de clientes com interfaces específicas  
✔ Instruções claras para replicação do ambiente.
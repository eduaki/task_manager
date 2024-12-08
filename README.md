# Projeto de Gerenciamento de Tarefas e usuários

## Descrição

Este projeto Node.js/Express é um aplicativo simples para gerenciar tarefas. Ele
permite aos usuários:

- **Criar contas:** Cadastrar novos usuários com nome, e-mail e senha.
- **Fazer login:** Autenticar usuários e definir cookies para manter a sessão.
- **Criar tarefas:** Adicionar novas tarefas ao sistema.
- **Listar tarefas:** Visualizar todas as tarefas.
- **Excluir tarefas:** Remover tarefas específicas.
- **Editar tarefas:** Atualizar o nome de tarefas existentes.

Este projeto foi desenvolvido com o intuíto de participar do processo seletivo
da **Redizz Tecnologia**, todo o projeto foi desenvolvido em NodeJS e Express
por [@eduaki](https://github.com/eduaki).

## Pré-requisitos

- **Node.js e npm (ou yarn) instalados:** Certifique-se de ter o Node.js e o
  gerenciador de pacotes npm (ou yarn) instalados em seu sistema.
- **Um banco de dados:** Configure um banco de dados (MySQL, PostgreSQL, etc.) e
  crie as tabelas necessárias (users, tasks).
- **Um cliente HTTP:** Para testar as APIs, você pode usar ferramentas como
  Postman, curl ou um navegador com extensões para fazer requisições HTTP.

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/eduaki/task_manager.git
   ```

2. **Instale as dependências:**
   ```bash
   cd task_manager
   npm install
   ```

## Configuração

1. **Configuração do banco de dados:**

   - **Adapte o código:** Modifique o arquivo `db.js` para usar as configurações
     do seu arquivo de configuração.

2. **Variáveis de ambiente:**
   - Configure todas as credenciais no arquivo `.env` para conseguir acessar o
     seu servidor mySQL

## Como executar

1. **Iniciar o servidor:**
   ```bash
   npm start
   ```
   O servidor será iniciado na porta definida no arquivo `app.js` (por padrão, a
   porta 3000).

## Endpoints da API

- **POST /login:** Faz o login do usuário.
- **POST /tasks/newtask:** Cria uma nova tarefa.
- **GET /tasks:** Lista todas as tarefas.
- **DELETE /tasks:** Exclui uma tarefa (o ID da tarefa deve ser enviado no corpo
  da requisição).
- **PUT /tasks/update/:task_id:** Atualiza uma tarefa (o ID da tarefa é passado
  na URL).
- **POST /users:** Cria um novo usuário.
- **GET /users:** Lista todos os usuários (somente para administradores).
- **DELETE /users:** Exclui um usuário (somente para administradores).

## Como utilizar a API

### criação de usuários:

#### POST /users

**body da requisição:**

```JSON
  {
    "name": "nome do usuário",
    "mail": "e-mail do usuário",
    "password": "senha do usuário"
    "isAdmin": <true || false>  /*define se o usuário adicionado é um administrador*/
  }
```

- A senha deve conter no mínimo 8 caracteres, pelo menos um caracter minúsculo e
  maiúsculo e pelo menos um caracter especial.
- O E-mail é o campo mais importante, é o único que não pode ser alterado pois é
  usado para fazer o login do usuário.

### Listagem dos usuários (somente para administradores):

#### GET /users

- A listagem dos usuários é um recurso dos administradores.
- Para listar os usuários basta usar o metodo **_GET_** na rota `/users`

### Exclusão de usuários:

#### DELETE /users

**body da requisição:**

```JSON
  {
    "mail": "e-mail do usuário",
  }
```

- A Exclusão de um usuário é um recurso explusivo dos administradores.
- Para excluir o usuário só é necessário o **_e-mail_** do cadastro.

### Login:

#### GET /login

**body da requisição:**

```JSON
  {
    "mail": "e-mail cadastrado",
    "password": "senha de acesso"
  }
```

### Criação de tarefas:

#### POST /tasks/newtask

**body da requisição:**

```JSON
  {
    "taskname": "nome da tarefa a ser criada",
  }
```

### Edição de tarefas:

#### PUT /tasks/update/<_id da tarefa_>

**body da requisição:**

```JSON
  {
    "taskname": "novo nome da tarefa",
  }
```

- Para editar uma tarefa é preciso saber o id dela e estar logado com o usuário
  de criação.

### Exclusão de tarefas:

#### DELETE /tasks

**body da requisição:**

```JSON
  {
    "task_id": <id da task>,
  }
```

- Para apagar uma tarefa é preciso saber o id dela e estar logado com o usuário
  de criação.

#### Para utilizar o usário admin padrão use essas credenciais:

**E-mail**: `admin@access.com` **Senha**: `Admin1234*`

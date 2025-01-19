# REST API

Este é um projeto de API desenvolvido com NestJS para um processo seletivo de desenvolvedor fullstack. A API fornece funcionalidades para gerenciar usuários e clientes.

## Features

- Autenticação e autorização de usuários
- CRUD de usuários
- CRUD de clientes
- Documentação da API com Swagger
- Seed de dados iniciais

## Funcionalidades

### Usuários

- Registro de novos usuários (apenas para administradores)
- Login de usuários (qualquer usuário)
- Listagem de todos os usuários (apenas para administradores)
- Obtenção de detalhes de um usuário por ID (o próprio usuário autenticado ou administrador)
- Atualização de dados de um usuário (o próprio usuário autenticado ou administrador)
- Exclusão de um usuário (apenas para administrador)

### Clientes

- Registro de novos clientes (qualquer usuário, sem a necessidade de autenticação)
- Listagem de todos os clientes (apenas para administrador)
- Obtenção de detalhes de um cliente por ID (apenas para administrador)
- Atualização de dados de um cliente (apenas para administrador)
- Exclusão de um cliente (apenas para administrador)

## Rotas

A documentação completa das rotas pode ser acessada via Swagger em `http://localhost:3001/api`.

## Instalação

1. Clone o repositório:
   ```shell
   git clone <URL_DO_REPOSITORIO>
   cd <NOME_DO_REPOSITORIO>
   ```

2. Instale as dependências:
   ```shell
   yarn install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:
   ```env
   NODE_ENV=
   PORT=
   DOCKER_IMAGE_NAME=
   ADMIN_API_KEY=
   JWT_SECRET=
   COMPANY_NAME=
   DATABASE_TYPE=
   DATABASE_HOST=
   DATABASE_PORT=
   DATABASE_USER=
   DATABASE_PASSWORD=
   DATABASE_NAME=
   DATABASE_SCHEMA=
   DATABASE_LOGGING=
   DATABASE_SYNCHRONIZE=
   ```

4. Execute as migrações do banco de dados:
   ```shell
   yarn migration:run
   ```

5. Execute o seed de dados iniciais:
   ```shell
   yarn start:dev
   ```

## Uso

1. Inicie o servidor:
   ```shell
   yarn start:dev
   ```

2. Acesse a documentação da API no navegador:
   ```
   http://localhost:3001/api
   ```

3. Utilize as rotas da API conforme descrito na seção de Rotas.

## Testes

Para executar os testes, utilize o comando:
```shell
yarn test
```

## Docker

Para executar o projeto utilizando Docker, siga os passos abaixo:

1. Construa a imagem Docker:
   ```shell
   make build
   ```

2. Execute o container:
   ```shell
   make run
   ```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

```
MIT License

Copyright (c) 2023 <Seu Nome>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
# ETEG

Este é um projeto de API desenvolvido com React/NextJS que fornece funcionalidades para gerenciar usuários e clientes. Backend com NodeJS/NestJS

## Funcionalidades

- Autenticação e autorização de usuários
- CRUD de usuários
- CRUD de clientes
- Documentação da API com Swagger
- Seed de dados iniciais

## Funcionalidades

### Usuários

- Registrar novos usuários (somente admin)
- Login de usuário (qualquer usuário)
- Listar todos os usuários (somente admin)
- Obter detalhes do usuário por ID (usuário autenticado ou admin)
- Atualizar dados do usuário (usuário autenticado ou admin)
- Excluir um usuário (somente admin)

### Clientes

- Registrar novos clientes (qualquer usuário, sem necessidade de autenticação)
- Listar todos os clientes (somente admin)
- Obter detalhes do cliente por ID (somente admin)
- Atualizar dados do cliente (somente admin)
- Excluir um cliente (somente admin)

## Rotas

A documentação completa das rotas pode ser acessada via Swagger em `http://localhost:3001/api`.

## Instalação e uso

1. Clone o repositório:
   ```shell
   git clone git@github.com:rwmsousa/eteg.git
   cd eteg
   ```

2. Instale as dependências:
   ```shell
   cd back
   yarn install
   cd ../front
   yarn install
   ```

3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na pasta back e adicione as seguintes variáveis:
   ```env
      NODE_ENV=development
      PORT=3001
      DOCKER_IMAGE_NAME=backend_nest
      ADMIN_API_KEY=23d4f5g6h7j8k9l0
      JWT_SECRET=eteg

      COMPANY_NAME=Eteg
      FRONTEND_URL=http://localhost:3000

      DATABASE_TYPE=postgres
      DATABASE_HOST=localhost
      DATABASE_PORT=5432
      DATABASE_USER=postgres
      DATABASE_PASSWORD=postgres
      DATABASE_NAME=backend_nest_postgres
      DATABASE_SCHEMA=public
      DATABASE_LOGGING=true
      DATABASE_SYNCRONIZE=false
   ```

   Crie um arquivo `.env` na pasta front e adicione as seguintes variáveis:
   ```env
      NEXT_PUBLIC_COMPANY_NAME=eteg.
      NEXT_PUBLIC_API_URL=http://localhost:3001/api
   ```

4. Inicialize os serviços:
   ```shell
   cd back
   docker-compose build
   docker-compose up -d

   cd ../front
   docker-compose build
   docker-compose up -d
   ```

5. Acesse a aplicação no navegador:
   ```
   http://localhost:3000
   ```

## Testes

Para executar os testes, use o comando:

front:
```shell
yarn cy:open
```

back:
```shell
yarn test
```

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto é licenciado sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

```
Licença MIT

Copyright (c) 2023 <Seu Nome>

A permissão é concedida, gratuitamente, a qualquer pessoa que obtenha uma cópia
deste software e dos arquivos de documentação associados (o "Software"), para lidar
no Software sem restrição, incluindo, sem limitação, os direitos
de usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou vender
cópias do Software, e permitir que as pessoas a quem o Software é
fornecido para tal, sujeito às seguintes condições:

O aviso de copyright acima e este aviso de permissão devem ser incluídos em todos
cópias ou partes substanciais do Software.

O SOFTWARE É FORNECIDO "COMO ESTÁ", SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU
IMPLÍCITA, INCLUINDO, MAS NÃO SE LIMITANDO ÀS GARANTIAS DE COMERCIALIZAÇÃO,
ADEQUAÇÃO A UM DETERMINADO FIM E NÃO VIOLAÇÃO. EM NENHUM CASO OS
AUTORES OU TITULARES DOS DIREITOS AUTORAIS SERÃO RESPONSÁVEIS POR QUALQUER REIVINDICAÇÃO, DANOS OU OUTRA
RESPONSABILIDADE, SEJA EM UMA AÇÃO DE CONTRATO, ATO ILÍCITO OU DE OUTRA FORMA, DECORRENTE DE,
FORA DE OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS NEGOCIAÇÕES NO
SOFTWARE.
```

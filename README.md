### Introdução
Este projeto implementa uma API REST completa para cadastro de informções de contas da Cemig atraves do upload de arquivos pdf, utilizando Node.js, Fastify.

### A API oferece as seguintes funcionalidades:

#### Cadastro de contas:
- Atraves do upload do arquivo pdf para o endpoint especifíco, os dados do cliente são extraidos, salvos em banco de dados e
armazenados em um bucket S3 para consulta posterior

#### Download de contas:
- Apos ser feito o upload de uma conta, o download pode ser feito atraves de um endpoint específico para isso.

#### Busca de dados por numero de cliente:
- É possível buscar todos os dados cadastrados de um usuário atraves do numero do cliente.

#### Ferramentas de teste
- Jest

### Para Iniciar
Clone o repositório.
```bash
git clone git@github.com:enicio/bill-cad.git
```

Copie o arquivo .env.example  para .env
```bash
cp .env.example .env
```

A maneira mais rápida de executar esse projeto é atraves do docker.
```bash
docker compose up
```

#### Alternativa para execução do projeto

Instale as dependências
```bash
npm install
```
Realize o build do projeto
```bash
npm run build
```

Inicie o projeto
```bash
npm run start
```

Execução dos testes
```bash
npm run tests
```

Teste a API utilizando ferramentas como Postman ou Insomnia.

#### Exemplo de Uso

### Upload do arquivo pdf da conta
POST http://localhost:3333/register-bill

Body do tipo Multipart Form com o arquivo pdf.

Exemplo utilizando o Curl

```bash
curl --request POST \
  --url http://localhost:3333/register-bill \
  --header 'Content-Type: multipart/form-data' \
  --header 'User-Agent: insomnia/8.5.1' \
  --form '=@/absolute/path/to/file/3004298116-04-2023.pdf'
```

### Requisição dos dados cadastrados pot cliente

GET http://localhost:3333/billing/<numero do cliente>

```bash
curl --request GET \
  --url http://localhost:3333/billing/<numero do cliente> \
  --header 'User-Agent: insomnia/8.5.1'
```

### Download das contas
GET http://localhost:3333

```bash
curl --request GET \
  --url http://localhost:3333/assets/<nome do arquivo> \
  --header 'User-Agent: insomnia/8.5.1'
```

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# VANSync Backend

Sistema de gerenciamento de cartas VAN com geração de PDF e integração com Zapier.

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `env.example` para `.env` e configure as variáveis:

```bash
cp env.example .env
```

#### Configurações Obrigatórias:

**Database:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=sua_senha
DB_NAME=vansync
```

**Redis:**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

**JWT:**
```env
JWT_SECRET=sua-chave-secreta-jwt
```

#### Configurações Opcionais:

**Email (para envio de PDFs):**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-app
```

**Zapier:**
```env
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/seu-webhook
```

### 2. Instalação do Redis

#### Windows (Recomendado - Docker):
```bash
docker run -d -p 6379:6379 redis:alpine
```

#### Windows (WSL):
```bash
wsl --install
# Depois instalar Redis no WSL
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
```

#### Windows (Redis Desktop):
- Baixe o Redis Desktop Manager ou RedisInsight
- Configure para conectar em localhost:6379

### 3. Instalação das Dependências

```bash
npm install
```

### 4. Execução

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run build
npm run start:prod
```

## Funcionalidades

### Geração de PDF
- Templates Handlebars para cartas VAN
- Cache Redis para templates e PDFs
- Geração via Puppeteer
- Endpoints:
  - `GET /solicitacoes/:id/pdf` - Download do PDF
  - `GET /solicitacoes/:id/pdf/base64` - PDF em base64
  - `POST /solicitacoes/:id/send` - Enviar PDF por email

### Cache Redis
- Templates compilados (TTL: 2 horas)
- PDFs gerados (TTL: 1 hora)
- Rate limiting para geração de PDFs

### Integração Zapier
- Envio de PDFs em base64
- Criação de tickets automáticos
- Webhooks configuráveis

## Estrutura de Módulos

```
src/
├── modules/
│   ├── auth/           # Autenticação JWT
│   ├── banco/          # Gestão de bancos
│   ├── config/         # Configurações
│   ├── pdf/            # Geração de PDFs
│   ├── redis/          # Cache Redis
│   ├── solicitacoes/   # Gestão de solicitações
│   ├── templates/      # Templates Handlebars
│   ├── usuarios/       # Gestão de usuários
│   └── zapier/         # Integração Zapier
└── database/
    └── entities/       # Modelos do banco
```

## API Endpoints

### Autenticação
- `POST /auth/login` - Login
- `POST /auth/register` - Registro

### Solicitações
- `GET /solicitacoes` - Listar solicitações
- `POST /solicitacoes` - Criar solicitação
- `GET /solicitacoes/:id` - Buscar solicitação
- `GET /solicitacoes/:id/pdf` - Gerar PDF
- `POST /solicitacoes/:id/send` - Enviar PDF

### Bancos
- `GET /banco` - Listar bancos
- `POST /banco` - Criar banco

### Usuários
- `GET /usuarios` - Listar usuários
- `POST /usuarios` - Criar usuário

## Desenvolvimento

### Adicionar Novo Template
1. Crie o template Handlebars em `templates.service.ts`
2. Registre helpers customizados se necessário
3. Teste com dados reais

### Configurar Email
1. Configure as variáveis de email no `.env`
2. Implemente o serviço de email em `solicitacoes.service.ts`
3. Teste o envio de PDFs

### Monitoramento Redis
```bash
# Conectar ao Redis CLI
redis-cli

# Verificar chaves
KEYS *

# Verificar TTL
TTL template:nexxera

# Limpar cache
FLUSHDB
```

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

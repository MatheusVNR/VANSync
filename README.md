# VANSync

Sistema completo para geração e gerenciamento de cartas VAN (Value Added Network).

## 📋 Sobre o Projeto

O VANSync é uma solução completa que automatiza o processo de geração de cartas de abertura de relacionamento VAN para diferentes bancos e fornecedores (Nexxera, Finnet). O sistema facilita a integração EDI entre empresas e instituições bancárias, oferecendo uma interface web intuitiva e APIs robustas.

## 🏗️ Arquitetura

O projeto é estruturado em uma arquitetura monorepo com duas aplicações principais:

### Frontend (React + TypeScript)
- Interface web responsiva com Material-UI
- Wizard passo-a-passo para geração de cartas
- Sistema de autenticação JWT
- Gerenciamento de solicitações
- Geração e download de PDFs

### Backend (NestJS + TypeScript)
- API RESTful com NestJS
- Autenticação JWT
- Geração de PDFs com templates Handlebars
- Integração com Redis para cache
- Integração com Zapier para abertura de chamados
- Sistema de envio de emails

## 🚀 Tecnologias

### Frontend
- **React 18** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Material-UI (MUI)** - Biblioteca de componentes
- **React Router** - Roteamento
- **Axios** - Cliente HTTP
- **Vite** - Build tool

### Backend
- **NestJS** - Framework Node.js
- **TypeScript** - Tipagem estática
- **Sequelize** - ORM para banco de dados
- **Redis** - Cache e sessões
- **Handlebars** - Templates para PDFs
- **Puppeteer** - Geração de PDFs
- **JWT** - Autenticação


## 🎯 Funcionalidades Principais

- **Autenticação Segura**: Sistema de login com JWT
- **Wizard Intuitivo**: Assistente passo-a-passo para criação de cartas
- **Geração de PDFs**: Templates personalizados para Nexxera e Finnet
- **Gerenciamento de Solicitações**: Controle completo de status e aprovações
- **Integração Zapier**: Envio automático de dados para sistemas externos
- **Sistema de Emails**: Notificações automáticas
- **Cache Inteligente**: Otimização de performance com Redis
- **Interface Responsiva**: Funciona em desktop, tablet e mobile

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Redis (para cache)
- Banco de dados PostgreSQL

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/MatheusVNR/VANSync.git
cd VANSync

# Instalar dependências do projeto (apps/backend e apps/frontend)
npm install

# Configurar variáveis de ambiente
cp apps/backend/env.example apps/backend/.env
# Editar apps/backend/.env com suas configurações

# Executar backend
cd apps/backend
nest start

# Em outro terminal, executar frontend
cd apps/frontend
npm run dev
```

## 🔧 Configuração

### Backend
- Configure as variáveis de ambiente em `apps/backend/.env` e `apps/frontend/.env` conforme especificado mais abaixo
- Configure o banco de dados PostgreSQL
- Configure o Redis para cache
- Configure as integrações (Zapier, Email)

### Frontend
- Configure a URL da API no arquivo de configuração
- Certifique-se de que o backend esteja rodando

## 🔐 Variáveis de Ambiente

### Backend (`apps/backend/.env`)

```env
# Banco de dados PostgreSQL
DB_HOST=localhost          # Host do banco de dados
DB_PORT=5432              # Porta do PostgreSQL
DB_USERNAME=postgres      # Usuário do banco
DB_PASSWORD=sua_senha    # Senha do banco
DB_DATABASE=vansync      # Nome do banco de dados

# Redis para cache
REDIS_HOST=localhost      # Host do Redis
REDIS_PORT=6379          # Porta do Redis
REDIS_PASSWORD=          # Senha do Redis (se houver)

# Autenticação JWT
JWT_SECRET=seu_jwt_secret_aqui  # Chave secreta para tokens JWT
JWT_EXPIRES_IN=24h             # Tempo de expiração dos tokens

# Configuração de email
SMTP_HOST=smtp.gmail.com       # Servidor SMTP
SMTP_PORT=587                  # Porta SMTP
SMTP_USER=seu_email@gmail.com  # Email para envio
SMTP_PASS=sua_senha_app       # Senha do email

# Integração Zapier
ZAPIER_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/seu_webhook  # URL do webhook Zapier

# Configuração do servidor
PORT=3000                      # Porta da API
NODE_ENV=development          # Ambiente (development/production)
```

### Frontend (`apps/frontend/.env`)

O frontend utiliza a URL da API configurada em `apps/frontend/src/utils/axiosInstance.ts`. Certifique-se de que a URL aponte para o backend correto:

```typescript
// apps/frontend/src/utils/axiosInstance.ts
const API_BASE_URL = 'http://localhost:3000'; // URL da API backend
```

## 📱 Acesso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

## 🎨 Design System

O projeto utiliza Material-UI com tema customizado, mantendo consistência visual com a identidade da empresa parceira.

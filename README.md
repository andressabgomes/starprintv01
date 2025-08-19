# 🚀 StarPrint CRM - Sistema de Gestão de Relacionamento com Cliente

## 📋 Sobre o Projeto

O **StarPrint CRM** é um sistema completo de gestão de relacionamento com cliente desenvolvido para empresas de impressão. O sistema oferece funcionalidades avançadas de atendimento, gestão de equipe, monitoramento em tempo real e relatórios detalhados.

## ✨ Funcionalidades Principais

### 🎯 Dashboard Inteligente
- KPIs em tempo real
- Gráficos interativos
- Métricas de performance
- Status do sistema

### 💬 Atendimento ao Cliente
- **Chat em tempo real** com interface moderna
- **Fila de atendimento** inteligente
- **Base de conhecimento** com artigos organizados
- **Sistema de avaliação NPS**
- **Gestão de tickets** completa

### 👥 Gestão de Equipe
- Controle de escalas e presenças
- Monitoramento de performance
- Metas e indicadores
- Cobertura da equipe

### 📊 Monitoramento e Relatórios
- Monitoramento em tempo real
- Relatórios customizáveis
- Exportação de dados
- Análises avançadas

### ⚙️ Administração
- Configurações do sistema
- Gestão de usuários
- Controle de permissões

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipagem estática
- **Vite** - Bundler e dev server
- **Tailwind CSS** - Estilização
- **Shadcn/ui** - Componentes
- **React Router** - Navegação
- **React Query** - Gerenciamento de estado
- **Recharts** - Gráficos

### Backend
- **Supabase** - Backend as a Service
- **PostgreSQL** - Banco de dados
- **Row Level Security** - Segurança
- **Real-time** - Atualizações em tempo real

### Ferramentas
- **ESLint** - Linting
- **Prettier** - Formatação
- **Husky** - Git hooks
- **Vitest** - Testes

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Instalação

1. **Clone o repositório**
```bash
git clone <repository-url>
cd atendimento-turbo-agora
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp env.example .env.local
```

Edite o arquivo `.env.local` com suas configurações:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_APP_NAME=StarPrint CRM
VITE_DEBUG_MODE=true
```

4. **Execute o projeto**
```bash
npm run dev
```

O projeto estará disponível em: **http://localhost:8080**

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── ui/             # Componentes base (Shadcn/ui)
│   ├── atendimento/    # Módulo de atendimento
│   ├── dashboard/      # Componentes do dashboard
│   ├── layouts/        # Layouts da aplicação
│   └── shared/         # Componentes compartilhados
├── hooks/              # Custom hooks
├── contexts/           # Contextos React
├── utils/              # Utilitários
├── types/              # Definições de tipos
├── constants/          # Constantes da aplicação
├── integrations/       # Integrações externas
└── pages/              # Páginas da aplicação
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia o servidor de desenvolvimento
npm run build            # Build para produção
npm run build:dev        # Build para desenvolvimento
npm run build:prod       # Build otimizado para produção
npm run preview          # Preview do build

# Qualidade de Código
npm run lint             # Executa o ESLint
npm run lint:fix         # Corrige problemas do ESLint
npm run type-check       # Verifica tipos TypeScript
npm run format           # Formata o código com Prettier
npm run format:check     # Verifica formatação

# Testes
npm run test             # Executa testes
npm run test:ui          # Interface de testes
npm run test:coverage    # Cobertura de testes

# Análise
npm run build:analyze    # Analisa o bundle
```

## 🗄️ Banco de Dados

O projeto utiliza **Supabase** com as seguintes tabelas principais:

- `nps_responses` - Avaliações de satisfação
- `strategic_clients` - Clientes estratégicos
- `tickets` - Tickets de atendimento
- `monitoring_sessions` - Sessões de monitoramento
- `team_capacity` - Capacidade da equipe

### Migrations
As migrations estão localizadas em `supabase/migrations/` e podem ser executadas via Supabase CLI.

## 🔐 Autenticação

O sistema utiliza autenticação baseada em roles:
- **Admin** - Acesso completo
- **Manager** - Gestão de equipe
- **User** - Atendimento básico

## 📱 Responsividade

O projeto é totalmente responsivo e otimizado para:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🎨 Temas

O sistema suporta:
- 🌞 Tema claro
- 🌙 Tema escuro
- 🎨 Tema automático

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

### Netlify
1. Conecte o repositório
2. Configure build settings
3. Deploy

### Outros
O projeto pode ser deployado em qualquer plataforma que suporte aplicações React.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, entre em contato:
- 📧 Email: suporte@starprint.com
- 💬 Discord: [Link do servidor]
- 📖 Documentação: [Link da documentação]

## 🔄 Changelog

### v1.0.0 (2024-01-XX)
- ✨ Lançamento inicial
- 🎯 Dashboard completo
- 💬 Sistema de atendimento
- 👥 Gestão de equipe
- 📊 Relatórios avançados

---

**Desenvolvido com ❤️ pela equipe StarPrint**

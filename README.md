# 🚀 StarPrint CRM - Sistema de Atendimento

## 📋 Visão Geral

O **StarPrint CRM** é um sistema completo de gestão de relacionamento com clientes (CRM) desenvolvido para equipes comerciais e de atendimento. O sistema oferece um painel orientado a valor com foco em eficiência operacional, qualidade de decisão e adoção.

### 🎯 Objetivos do Sistema

- **Eficiência Operacional**: Automatização de processos e otimização de fluxos de trabalho
- **Qualidade de Decisão**: Insights baseados em dados para tomada de decisões estratégicas
- **Adoção**: Interface intuitiva e experiência do usuário otimizada
- **Valor Comercial**: Foco em receita, conversão e retenção de clientes

## 🏗️ Arquitetura do Sistema

### Stack Tecnológica

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Build Tool**: Vite
- **Roteamento**: React Router DOM
- **Estado**: React Hooks + Context API
- **Formulários**: React Hook Form + Zod
- **Notificações**: Sonner Toast

### Estrutura do Projeto

```
atendimento-turbo-agora-main/
├── src/
│   ├── components/
│   │   ├── clients/           # Módulo de Gestão de Clientes
│   │   ├── atendimento/       # Módulo de Atendimento
│   │   ├── dashboard/         # Dashboards e Analytics
│   │   ├── layouts/           # Componentes de Layout
│   │   └── ui/               # Componentes UI Reutilizáveis
│   ├── config/               # Configurações do Sistema
│   ├── contexts/             # Contextos React
│   ├── hooks/                # Hooks Customizados
│   ├── integrations/         # Integrações Externas
│   ├── lib/                  # Utilitários
│   ├── types/                # Definições de Tipos TypeScript
│   └── utils/                # Funções Utilitárias
├── supabase/                 # Configuração e Migrações do Banco
└── public/                   # Arquivos Estáticos
```

## 🚀 Funcionalidades Principais

### 1. 📊 Dashboard Executivo
- **Visão Geral**: Métricas de performance em tempo real
- **KPIs Estratégicos**: Receita, conversão, satisfação, crescimento
- **Alertas Inteligentes**: Notificações de oportunidades e riscos
- **Gráficos Interativos**: Visualizações de dados comerciais

### 2. 👥 Gestão de Clientes (Painel de Valor)
- **Cadastro Completo**: Formulário abrangente com validações
- **Métricas Rápidas**: Indicadores de performance por cliente
- **Insights Estratégicos**: Recomendações baseadas em dados
- **Filtros Avançados**: Busca e classificação inteligente
- **Histórico de Serviços**: Rastreamento completo de interações

#### Campos do Cadastro de Clientes:
- **Informações Básicas**: Código, razão social, documento, tipo, segmento
- **Endereços**: Múltiplos endereços (principal, cobrança, entrega)
- **Contatos**: Telefone, email, WhatsApp, fax
- **Pessoas de Contato**: Nome, cargo, departamento, tomador de decisão

### 3. 🎯 Analytics Avançado
- **Métricas Comerciais**: Receita, ticket médio, conversão
- **Análise de Segmentos**: Distribuição por tipo de cliente
- **Performance de Equipe**: Top performers e indicadores
- **Tendências**: Análise temporal de crescimento
- **Insights Automáticos**: Recomendações baseadas em dados

### 4. 📞 Atendimento ao Cliente
- **Central de Atendimento**: Interface unificada para suporte
- **Base de Conhecimento**: Artigos e soluções
- **Fila de Atendimento**: Gestão de tickets e prioridades
- **Avaliações**: Sistema de feedback e satisfação
- **Chat Integrado**: Comunicação em tempo real

### 5. 👨‍💼 Gestão de Equipe
- **Cadastro de Colaboradores**: Perfis e permissões
- **Escalas e Presenças**: Controle de horários
- **Metas e Desempenho**: Acompanhamento de objetivos
- **Monitoramento**: Atividades em tempo real

### 6. 📈 Relatórios e Exportações
- **Relatórios Personalizados**: Configuração de métricas
- **Exportação de Dados**: Múltiplos formatos
- **Dashboards Executivos**: Visão estratégica
- **Análises Comparativas**: Benchmarking interno

## 🛠️ Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### 1. Clone do Repositório

```bash
git clone <repository-url>
cd atendimento-turbo-agora-main
```

### 2. Instalação de Dependências

```bash
npm install
```

### 3. Configuração do Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Configure as variáveis de ambiente:

```bash
cp env.example .env.local
```

Edite o arquivo `.env.local`:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 4. Execução das Migrações

```bash
# Instale o CLI do Supabase
npm install -g supabase

# Execute as migrações
supabase db push
```

### 5. Inicialização dos Dados

```bash
# Execute os scripts de inserção de dados
node scripts/insert-main-clients.js
node scripts/insert-client-details.js
```

### 6. Execução do Projeto

```bash
# Modo de desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

## 📖 Guia de Uso

### Acessando o Sistema

1. **URL**: http://localhost:8080 (desenvolvimento)
2. **Login**: Use as credenciais configuradas no Supabase
3. **Navegação**: Menu lateral com todos os módulos

### Cadastrando um Cliente

1. **Acesse**: "Gestão de Clientes" no menu lateral
2. **Clique**: Botão "Novo Cliente" (azul destacado)
3. **Preencha**: Informações básicas obrigatórias
4. **Adicione**: Endereços, contatos e pessoas conforme necessário
5. **Salve**: Clique em "Cadastrar Cliente"

### Utilizando o Analytics

1. **Acesse**: Aba "Analytics Avançado"
2. **Configure**: Período de análise (7 dias, 30 dias, etc.)
3. **Visualize**: Métricas e insights automáticos
4. **Aja**: Siga as recomendações apresentadas

### Gerenciando Atendimentos

1. **Acesse**: "Atendimento ao Cliente"
2. **Visualize**: Fila de atendimentos
3. **Atenda**: Clique no ticket para iniciar
4. **Registre**: Soluções e feedback do cliente

## 🔧 Configurações Avançadas

### Personalização de Temas

Edite `src/styles/app.css` para customizar cores e estilos:

```css
:root {
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  /* Outras variáveis de cor */
}
```

### Configuração de Permissões

Configure roles no Supabase:

```sql
-- Exemplo de configuração de RLS
CREATE POLICY "Users can view own data" ON clients
FOR SELECT USING (auth.uid() = user_id);
```

### Integração com APIs Externas

Adicione integrações em `src/integrations/`:

```typescript
// Exemplo de integração
export const externalAPI = {
  baseURL: process.env.VITE_API_URL,
  headers: {
    'Authorization': `Bearer ${process.env.VITE_API_KEY}`
  }
};
```

## 📊 Métricas e KPIs

### Métricas Principais

- **Receita Total**: Valor total gerado
- **Taxa de Conversão**: % de prospects convertidos
- **Satisfação**: Score médio de satisfação
- **Tempo de Resposta**: Tempo médio de atendimento
- **Retenção**: % de clientes retidos
- **Churn Rate**: % de clientes perdidos

### Alertas Automáticos

- Clientes em risco (pagamento em atraso)
- Contatos em atraso (>30 dias)
- Metas não atingidas
- Oportunidades de crescimento

## 🔒 Segurança

### Autenticação

- **Supabase Auth**: Sistema robusto de autenticação
- **JWT Tokens**: Tokens seguros e renováveis
- **RLS (Row Level Security)**: Controle de acesso a dados

### Proteção de Dados

- **Validação**: Todos os inputs são validados
- **Sanitização**: Dados limpos antes do processamento
- **HTTPS**: Comunicação criptografada

## 🚀 Deploy

### Deploy no Vercel

1. **Conecte** o repositório ao Vercel
2. **Configure** as variáveis de ambiente
3. **Deploy** automático a cada push

### Deploy no Netlify

1. **Conecte** o repositório ao Netlify
2. **Configure** build command: `npm run build`
3. **Configure** publish directory: `dist`

### Deploy Manual

```bash
# Build de produção
npm run build

# Servir arquivos estáticos
npm run preview
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro de Conexão com Supabase
```bash
# Verifique as variáveis de ambiente
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
```

#### Erro de Build
```bash
# Limpe cache e reinstale dependências
rm -rf node_modules package-lock.json
npm install
```

#### Erro de Migração
```bash
# Reset do banco (cuidado!)
supabase db reset
```

## 📞 Suporte

### Documentação Adicional

- **API Docs**: `/docs/api`
- **Componentes**: `/docs/components`
- **Guia de Estilo**: `/docs/styleguide`

### Contato

- **Email**: suporte@starprint.com
- **Telefone**: (11) 9999-9999
- **Chat**: Disponível no sistema

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

---

**Desenvolvido com ❤️ pela equipe StarPrint**

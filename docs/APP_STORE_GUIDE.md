# 📱 Guia de Publicação nas App Stores - StarPrint CRM

## 🎯 Visão Geral

Este guia irá ajudá-lo a publicar o StarPrint CRM nas principais app stores: **Apple App Store** e **Google Play Store**.

## 🚀 Preparação Inicial

### 1. Contas Necessárias

#### Apple App Store
- **Apple Developer Account** ($99/ano)
- **App Store Connect** (incluído no Developer Account)
- **Xcode** (para desenvolvimento iOS)

#### Google Play Store
- **Google Play Console** ($25 taxa única)
- **Conta Google** (gratuita)

### 2. Configuração do Projeto

#### Estrutura de Pastas
```
mobile-app/
├── assets/
│   ├── icon.png (1024x1024)
│   ├── splash.png (1242x2688)
│   ├── adaptive-icon.png (1024x1024)
│   └── favicon.png (48x48)
├── src/
│   ├── components/
│   ├── screens/
│   ├── navigation/
│   └── services/
├── app.json
├── package.json
└── eas.json
```

## 📱 Apple App Store

### 1. Configuração do iOS

#### Certificados e Perfis
1. **Acesse** [Apple Developer Portal](https://developer.apple.com)
2. **Crie** certificado de distribuição
3. **Configure** perfil de provisionamento
4. **Adicione** dispositivos de teste

#### Configuração do App
```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.starprint.crm",
      "buildNumber": "1",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "Este app precisa acessar a câmera para escanear QR codes.",
        "NSPhotoLibraryUsageDescription": "Este app precisa acessar a galeria para documentos.",
        "NSLocationWhenInUseUsageDescription": "Este app precisa acessar a localização.",
        "NSMicrophoneUsageDescription": "Este app precisa acessar o microfone.",
        "NSFaceIDUsageDescription": "Este app usa Face ID para autenticação."
      }
    }
  }
}
```

### 2. Build e Teste

#### Comandos EAS
```bash
# Build de desenvolvimento
eas build --platform ios --profile development

# Build de preview
eas build --platform ios --profile preview

# Build de produção
eas build --platform ios --profile production
```

#### Teste Local
```bash
# Instalar dependências
npm install

# Executar no simulador
npx expo run:ios

# Executar no dispositivo
npx expo run:ios --device
```

### 3. Submissão para App Store

#### App Store Connect
1. **Acesse** [App Store Connect](https://appstoreconnect.apple.com)
2. **Crie** novo app
3. **Configure** informações básicas:
   - Nome: "StarPrint CRM"
   - Categoria: Business
   - Subcategoria: Productivity

#### Metadados Necessários
- **Nome do App**: StarPrint CRM
- **Subtítulo**: Gestão de Clientes Inteligente
- **Descrição**: 
```
StarPrint CRM é um sistema completo de gestão de relacionamento com clientes desenvolvido para equipes comerciais e de atendimento.

🎯 PRINCIPAIS FUNCIONALIDADES:
• Dashboard Executivo com KPIs em tempo real
• Gestão Completa de Clientes com cadastro avançado
• Analytics e Insights Estratégicos
• Sistema de Atendimento Integrado
• Relatórios e Exportações
• Funcionalidade Offline

📊 PAINEL DE VALOR:
Transformamos a gestão de clientes em um painel orientado a resultados, com foco em:
• Eficiência Operacional
• Qualidade de Decisão
• Adoção da Equipe
• Valor Comercial

🔒 SEGURANÇA:
• Autenticação segura
• Dados criptografados
• Backup automático
• Conformidade com LGPD

📱 EXPERIÊNCIA MOBILE:
• Interface otimizada para mobile
• Navegação intuitiva
• Notificações push
• Sincronização offline

Ideal para empresas que buscam:
• Aumentar a eficiência da equipe comercial
• Melhorar a qualidade das decisões
• Elevar a satisfação dos clientes
• Gerar mais receita através de insights

Baixe agora e transforme sua gestão de clientes!
```

#### Screenshots Obrigatórios
- **iPhone 6.7"**: 1290x2796 px
- **iPhone 6.5"**: 1242x2688 px
- **iPhone 5.5"**: 1242x2208 px
- **iPad Pro 12.9"**: 2048x2732 px
- **iPad Pro 11"**: 1668x2388 px

#### Keywords
```
CRM,gestão,clientes,atendimento,comercial,vendas,negócios,produtividade,análise,dashboard,relatórios,equipe,empresa,gestão empresarial
```

### 4. Processo de Revisão

#### Tempo Estimado
- **Primeira submissão**: 1-3 dias
- **Atualizações**: 24-48 horas

#### Critérios de Rejeição Comuns
- **Funcionalidade incompleta**
- **Crashs frequentes**
- **Descrição inadequada**
- **Screenshots de baixa qualidade**
- **Violação de diretrizes**

## 🤖 Google Play Store

### 1. Configuração do Android

#### Configuração do App
```json
{
  "expo": {
    "android": {
      "package": "com.starprint.crm",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#3b82f6"
      },
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.INTERNET"
      ]
    }
  }
}
```

### 2. Build e Teste

#### Comandos EAS
```bash
# Build de desenvolvimento
eas build --platform android --profile development

# Build de preview
eas build --platform android --profile preview

# Build de produção
eas build --platform android --profile production
```

#### Teste Local
```bash
# Executar no emulador
npx expo run:android

# Executar no dispositivo
npx expo run:android --device
```

### 3. Submissão para Play Store

#### Google Play Console
1. **Acesse** [Google Play Console](https://play.google.com/console)
2. **Crie** novo app
3. **Configure** informações básicas

#### Metadados Necessários
- **Nome do App**: StarPrint CRM
- **Descrição Curta**: Sistema completo de gestão de clientes para equipes comerciais
- **Descrição Completa**: (mesma da App Store)

#### Screenshots Obrigatórios
- **Phone**: 1080x1920 px (mínimo 2)
- **7-inch Tablet**: 1200x1920 px
- **10-inch Tablet**: 1920x1200 px

#### Ícones
- **App Icon**: 512x512 px
- **Feature Graphic**: 1024x500 px

### 4. Processo de Revisão

#### Tempo Estimado
- **Primeira submissão**: 1-7 dias
- **Atualizações**: 1-3 dias

## 📋 Checklist de Publicação

### ✅ Preparação
- [ ] Contas de desenvolvedor criadas
- [ ] Certificados e perfis configurados
- [ ] Assets (ícones, screenshots) preparados
- [ ] Metadados escritos e revisados
- [ ] App testado em dispositivos reais

### ✅ Build
- [ ] Build de produção gerado
- [ ] App testado em modo release
- [ ] Funcionalidades críticas validadas
- [ ] Performance otimizada

### ✅ Submissão
- [ ] App Store Connect configurado
- [ ] Google Play Console configurado
- [ ] Screenshots enviados
- [ ] Metadados preenchidos
- [ ] App submetido para revisão

### ✅ Pós-Publicação
- [ ] Monitoramento de reviews
- [ ] Análise de crashs
- [ ] Métricas de download
- [ ] Feedback dos usuários

## 🎨 Assets Necessários

### Ícones
```
icon.png (1024x1024)
adaptive-icon.png (1024x1024)
favicon.png (48x48)
```

### Screenshots
```
iPhone 6.7": 1290x2796
iPhone 6.5": 1242x2688
iPhone 5.5": 1242x2208
iPad Pro 12.9": 2048x2732
iPad Pro 11": 1668x2388
Android Phone: 1080x1920
Android 7": 1200x1920
Android 10": 1920x1200
```

### Feature Graphics
```
App Store: 1024x1024
Play Store: 1024x500
```

## 📊 Estratégia de Lançamento

### Fase 1: Soft Launch
- **Público**: Testadores internos
- **Duração**: 1-2 semanas
- **Objetivo**: Identificar bugs críticos

### Fase 2: Beta Testing
- **Público**: Usuários selecionados
- **Duração**: 2-4 semanas
- **Objetivo**: Feedback de usabilidade

### Fase 3: Launch
- **Público**: Todos os usuários
- **Duração**: Contínua
- **Objetivo**: Crescimento orgânico

## 📈 Monitoramento Pós-Lançamento

### Métricas Importantes
- **Downloads**: Número de instalações
- **Retenção**: Usuários que continuam usando
- **Reviews**: Avaliações e comentários
- **Crashs**: Estabilidade do app
- **Performance**: Tempo de carregamento

### Ferramentas de Monitoramento
- **App Store Connect Analytics**
- **Google Play Console Analytics**
- **Firebase Analytics**
- **Crashlytics**
- **Expo Analytics**

## 🔄 Atualizações

### Versionamento
- **iOS**: Build Number (1, 2, 3...)
- **Android**: Version Code (1, 2, 3...)
- **Ambos**: Version Name (2.0.0, 2.0.1...)

### Processo de Atualização
1. **Desenvolver** novas funcionalidades
2. **Testar** em dispositivos reais
3. **Gerar** novo build
4. **Submeter** para revisão
5. **Publicar** quando aprovado

## 🆘 Suporte

### Recursos Úteis
- **Apple Developer Documentation**: https://developer.apple.com
- **Google Play Console Help**: https://support.google.com/googleplay
- **Expo Documentation**: https://docs.expo.dev
- **EAS Documentation**: https://docs.expo.dev/eas

### Contato
- **Email**: suporte@starprint.com
- **Telefone**: (11) 9999-9999
- **Chat**: Disponível no sistema

---

**Este guia é atualizado regularmente conforme as políticas das app stores mudam.**

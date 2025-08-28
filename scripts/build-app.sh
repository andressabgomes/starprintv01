#!/bin/bash

# 🚀 Script de Build e Publicação - StarPrint CRM
# Este script automatiza o processo de build e publicação nas app stores

set -e  # Para o script se houver erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

info() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')] INFO: $1${NC}"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    error "Execute este script no diretório raiz do projeto"
fi

# Verificar se EAS CLI está instalado
if ! command -v eas &> /dev/null; then
    error "EAS CLI não está instalado. Instale com: npm install -g @expo/eas-cli"
fi

# Verificar se está logado no EAS
if ! eas whoami &> /dev/null; then
    error "Você não está logado no EAS. Execute: eas login"
fi

# Função para mostrar menu
show_menu() {
    echo ""
    echo "🚀 StarPrint CRM - Build e Publicação"
    echo "====================================="
    echo "1. Build para desenvolvimento (iOS)"
    echo "2. Build para desenvolvimento (Android)"
    echo "3. Build para preview (iOS)"
    echo "4. Build para preview (Android)"
    echo "5. Build para produção (iOS)"
    echo "6. Build para produção (Android)"
    echo "7. Build para ambas plataformas (produção)"
    echo "8. Submeter para App Store"
    echo "9. Submeter para Play Store"
    echo "10. Submeter para ambas stores"
    echo "11. Verificar status dos builds"
    echo "12. Limpar cache"
    echo "0. Sair"
    echo ""
    read -p "Escolha uma opção: " choice
}

# Função para build de desenvolvimento
build_dev() {
    local platform=$1
    log "Iniciando build de desenvolvimento para $platform..."
    
    cd mobile-app
    eas build --platform $platform --profile development
    
    if [ $? -eq 0 ]; then
        log "Build de desenvolvimento para $platform concluído com sucesso!"
    else
        error "Erro no build de desenvolvimento para $platform"
    fi
    cd ..
}

# Função para build de preview
build_preview() {
    local platform=$1
    log "Iniciando build de preview para $platform..."
    
    cd mobile-app
    eas build --platform $platform --profile preview
    
    if [ $? -eq 0 ]; then
        log "Build de preview para $platform concluído com sucesso!"
    else
        error "Erro no build de preview para $platform"
    fi
    cd ..
}

# Função para build de produção
build_production() {
    local platform=$1
    log "Iniciando build de produção para $platform..."
    
    # Verificar se há mudanças não commitadas
    if [ -n "$(git status --porcelain)" ]; then
        warn "Há mudanças não commitadas. Commitando automaticamente..."
        git add .
        git commit -m "Build automático $(date +'%Y-%m-%d %H:%M:%S')"
    fi
    
    cd mobile-app
    eas build --platform $platform --profile production --auto-submit
    
    if [ $? -eq 0 ]; then
        log "Build de produção para $platform concluído com sucesso!"
    else
        error "Erro no build de produção para $platform"
    fi
    cd ..
}

# Função para submeter para App Store
submit_ios() {
    log "Submetendo para App Store..."
    
    cd mobile-app
    eas submit --platform ios --latest
    
    if [ $? -eq 0 ]; then
        log "Submissão para App Store concluída com sucesso!"
    else
        error "Erro na submissão para App Store"
    fi
    cd ..
}

# Função para submeter para Play Store
submit_android() {
    log "Submetendo para Play Store..."
    
    cd mobile-app
    eas submit --platform android --latest
    
    if [ $? -eq 0 ]; then
        log "Submissão para Play Store concluída com sucesso!"
    else
        error "Erro na submissão para Play Store"
    fi
    cd ..
}

# Função para verificar status dos builds
check_builds() {
    log "Verificando status dos builds..."
    
    cd mobile-app
    eas build:list --limit 10
    
    cd ..
}

# Função para limpar cache
clean_cache() {
    log "Limpando cache..."
    
    # Limpar cache do npm
    npm cache clean --force
    
    # Limpar cache do expo
    npx expo install --fix
    
    # Limpar cache do eas
    eas build:clean
    
    log "Cache limpo com sucesso!"
}

# Função para atualizar versão
update_version() {
    local version_type=$1
    
    cd mobile-app
    
    # Atualizar versão no package.json
    if [ "$version_type" = "patch" ]; then
        npm version patch
    elif [ "$version_type" = "minor" ]; then
        npm version minor
    elif [ "$version_type" = "major" ]; then
        npm version major
    fi
    
    # Obter nova versão
    NEW_VERSION=$(node -p "require('./package.json').version")
    
    log "Versão atualizada para: $NEW_VERSION"
    
    cd ..
}

# Função para validar ambiente
validate_environment() {
    log "Validando ambiente..."
    
    # Verificar Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js não está instalado"
    fi
    
    # Verificar npm
    if ! command -v npm &> /dev/null; then
        error "npm não está instalado"
    fi
    
    # Verificar git
    if ! command -v git &> /dev/null; then
        error "git não está instalado"
    fi
    
    # Verificar se estamos em um repositório git
    if [ ! -d ".git" ]; then
        error "Este diretório não é um repositório git"
    fi
    
    log "Ambiente validado com sucesso!"
}

# Função principal
main() {
    log "Iniciando script de build e publicação..."
    
    # Validar ambiente
    validate_environment
    
    while true; do
        show_menu
        
        case $choice in
            1)
                build_dev "ios"
                ;;
            2)
                build_dev "android"
                ;;
            3)
                build_preview "ios"
                ;;
            4)
                build_preview "android"
                ;;
            5)
                read -p "Tipo de atualização (patch/minor/major): " version_type
                update_version $version_type
                build_production "ios"
                ;;
            6)
                read -p "Tipo de atualização (patch/minor/major): " version_type
                update_version $version_type
                build_production "android"
                ;;
            7)
                read -p "Tipo de atualização (patch/minor/major): " version_type
                update_version $version_type
                build_production "ios"
                build_production "android"
                ;;
            8)
                submit_ios
                ;;
            9)
                submit_android
                ;;
            10)
                submit_ios
                submit_android
                ;;
            11)
                check_builds
                ;;
            12)
                clean_cache
                ;;
            0)
                log "Saindo..."
                exit 0
                ;;
            *)
                error "Opção inválida"
                ;;
        esac
        
        echo ""
        read -p "Pressione Enter para continuar..."
    done
}

# Executar função principal
main "$@"

#!/bin/bash
echo "Iniciando deploy das alterações..."

# Adiciona todas as mudanças
git add .

# Realiza o commit
git commit -m "feat: adiciona Adicional de Copa e corrige formatação de percentuais"

# Envia para o repositório remoto
git push

echo "Deploy finalizado! Verifique o painel da Vercel."

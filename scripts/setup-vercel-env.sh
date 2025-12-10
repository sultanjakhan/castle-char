#!/bin/bash

# Скрипт для автоматической настройки переменных окружения в Vercel
# Требует: VERCEL_TOKEN, VERCEL_PROJECT_ID, VERCEL_ORG_ID

set -e

if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Ошибка: VERCEL_TOKEN не установлен"
    echo "Получи токен на https://vercel.com/account/tokens"
    exit 1
fi

if [ -z "$VERCEL_PROJECT_ID" ]; then
    echo "❌ Ошибка: VERCEL_PROJECT_ID не установлен"
    exit 1
fi

echo "🚀 Настройка переменных окружения в Vercel..."
echo ""

# Supabase переменные
SUPABASE_URL="https://vadanzerfgwdzktdytdr.supabase.co"
SUPABASE_KEY="sb_publishable_vItgB5KxmoefzNJ7Y2VIwA_EeIgmBtE"

# Добавляем переменные через Vercel API
echo "📝 Добавляю VITE_SUPABASE_URL..."
curl -X POST "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"key\": \"VITE_SUPABASE_URL\",
    \"value\": \"$SUPABASE_URL\",
    \"type\": \"encrypted\",
    \"target\": [\"production\", \"preview\", \"development\"]
  }" > /dev/null 2>&1

echo "📝 Добавляю VITE_SUPABASE_ANON_KEY..."
curl -X POST "https://api.vercel.com/v10/projects/$VERCEL_PROJECT_ID/env" \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"key\": \"VITE_SUPABASE_ANON_KEY\",
    \"value\": \"$SUPABASE_KEY\",
    \"type\": \"encrypted\",
    \"target\": [\"production\", \"preview\", \"development\"]
  }" > /dev/null 2>&1

echo ""
echo "✅ Переменные окружения добавлены!"
echo "🔄 Перезапусти деплой на Vercel, чтобы применить изменения"


#!/bin/bash
# Script para iniciar el servidor de desarrollo y capturar logs
# Uso: ./scripts/start-dev.sh

LOG_DIR="logs"
LOG_FILE="$LOG_DIR/dev-$(date +%Y%m%d-%H%M%S).log"
PORT="${1:-3001}"

# Crear directorio de logs si no existe
mkdir -p "$LOG_DIR"

echo "========================================" | tee "$LOG_FILE"
echo "DigitalCare GT - Servidor de Desarrollo" | tee -a "$LOG_FILE"
echo "Fecha: $(date)" | tee -a "$LOG_FILE"
echo "Puerto: $PORT" | tee -a "$LOG_FILE"
echo "Log: $LOG_FILE" | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Verificar Node.js
echo "[INFO] Node version: $(node -v)" | tee -a "$LOG_FILE"
echo "[INFO] NPM version: $(npm -v)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

# Verificar variables de entorno
echo "[INFO] Verificando variables de entorno..." | tee -a "$LOG_FILE"
if [ -f ".env.local" ]; then
  echo "[OK] .env.local encontrado" | tee -a "$LOG_FILE"
else
  echo "[WARN] .env.local NO encontrado" | tee -a "$LOG_FILE"
fi
echo "" | tee -a "$LOG_FILE"

# Verificar dependencias
echo "[INFO] Verificando node_modules..." | tee -a "$LOG_FILE"
if [ -d "node_modules" ]; then
  echo "[OK] node_modules existe" | tee -a "$LOG_FILE"
else
  echo "[WARN] node_modules NO existe - ejecutando npm install..." | tee -a "$LOG_FILE"
  npm install 2>&1 | tee -a "$LOG_FILE"
fi
echo "" | tee -a "$LOG_FILE"

# Iniciar servidor
echo "[INFO] Iniciando servidor en puerto $PORT..." | tee -a "$LOG_FILE"
echo "========================================" | tee -a "$LOG_FILE"

# Ejecutar con stdbuf para output sin buffer
exec stdbuf -oL -eL npm run dev -- -p "$PORT" 2>&1 | tee -a "$LOG_FILE"

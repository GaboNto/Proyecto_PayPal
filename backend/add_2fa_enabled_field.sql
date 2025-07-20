-- Script para agregar el campo 2fa_enabled a la tabla usuarios
-- Ejecutar en PostgreSQL

-- Agregar el campo si no existe
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS "2fa_enabled" BOOLEAN DEFAULT FALSE;

-- Actualizar registros existentes basándose en si tienen totp_secret
UPDATE usuarios SET "2fa_enabled" = TRUE WHERE totp_secret IS NOT NULL AND totp_secret != '';

-- Verificar la estructura actual
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'usuarios' 
AND column_name = '2fa_enabled'; 
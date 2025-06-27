# Guía de Configuración de Supabase - Problema de Validación de Email

## Problema Identificado
El error `Email address "franklin@gmail.com" is invalid` indica que Supabase está rechazando ciertos emails como inválidos.

## Posibles Causas y Soluciones

### 1. Verificar Configuración de Autenticación

**Pasos:**
1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **Authentication** > **Settings**
3. Verifica las siguientes configuraciones:

#### Configuración de Email
- **Enable email confirmations**: Asegúrate de que esté habilitado
- **Secure email change**: Puede estar causando problemas
- **Enable email confirmations for signup**: Debe estar habilitado

#### Dominios Permitidos
- Verifica si hay **Site URL** configurada correctamente
- Asegúrate de que `http://localhost:8080` esté en la lista de URLs permitidas

### 2. Verificar Configuración de SMTP (si está configurado)

**Pasos:**
1. Ve a **Authentication** > **SMTP Settings**
2. Si tienes SMTP configurado, verifica que esté funcionando correctamente
3. Si no necesitas SMTP personalizado, deshabilítalo temporalmente

### 3. Verificar Lista de Emails Bloqueados

**Pasos:**
1. Ve a **Authentication** > **Users**
2. Busca si hay alguna configuración de emails bloqueados
3. Verifica si hay políticas de email restrictivas

### 4. Configuración de Políticas de Email

**Pasos:**
1. Ve a **Authentication** > **Policies**
2. Verifica si hay políticas que bloqueen ciertos dominios de email
3. Asegúrate de que las políticas permitan el registro de candidatos

### 5. Verificar Configuración de RLS

**Pasos:**
1. Ve a **Table Editor** > **usuarios**
2. Verifica que las políticas RLS estén correctamente configuradas
3. Asegúrate de que la política de INSERT esté habilitada

## Solución Temporal

Si el problema persiste, puedes:

1. **Usar un email diferente** para pruebas (ej: `test@example.com`)
2. **Verificar la configuración de Supabase** siguiendo los pasos anteriores
3. **Contactar al soporte de Supabase** si el problema persiste

## Comandos para Aplicar Migraciones

```bash
# Aplicar migraciones manualmente en SQL Editor
# Copia y pega el contenido de:
# supabase/migrations/20250615040000-fix-auth-policies.sql
```

## Verificación de la Solución

1. Intenta registrar un usuario con email `test@example.com`
2. Si funciona, el problema está en la configuración de Supabase
3. Si no funciona, revisa los logs de error para más detalles

## Logs de Error Esperados

Si la solución funciona, deberías ver:
```
✅ Registro exitoso: { user: {...}, session: null }
```

Si hay problemas, verás:
```
❌ Error en signUp: { message: "..." }
``` 
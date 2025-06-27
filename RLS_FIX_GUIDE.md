# 🔧 Guía para Solucionar Error de RLS (Row Level Security)

## Problema Identificado
El registro de usuario funciona correctamente, pero falla al crear el perfil en la tabla `usuarios` debido a políticas RLS restrictivas.

**Error específico:**
```
new row violates row-level security policy for table "usuarios"
```

## Solución Paso a Paso

### 1. Acceder al SQL Editor de Supabase

1. Ve a tu proyecto en Supabase Dashboard
2. Navega a **SQL Editor**
3. Crea una nueva consulta

### 2. Ejecutar las Correcciones SQL

Copia y pega este código en el SQL Editor:

```sql
-- 1. Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Permitir inserción de perfiles de usuario" ON public.usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.usuarios;

-- 2. Crear política correcta para INSERT
CREATE POLICY "Permitir inserción de perfiles de usuario" ON public.usuarios
    FOR INSERT WITH CHECK (
        auth.uid() = usuario_id
    );

-- 3. Verificar políticas de SELECT y UPDATE
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.usuarios;
CREATE POLICY "Los usuarios pueden ver su propio perfil" ON public.usuarios
    FOR SELECT USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.usuarios;
CREATE POLICY "Los usuarios pueden actualizar su propio perfil" ON public.usuarios
    FOR UPDATE USING (auth.uid() = usuario_id);

-- 4. Política para empleadores/administradores
DROP POLICY IF EXISTS "Los empleadores pueden ver todos los perfiles de usuarios" ON public.usuarios;
CREATE POLICY "Los empleadores pueden ver todos los perfiles de usuarios" ON public.usuarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios 
            WHERE usuario_id = auth.uid() 
            AND rol IN ('empleador', 'administrador')
        )
    );

-- 5. Verificar que RLS esté habilitado
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
```

### 3. Verificar las Políticas

Ejecuta esta consulta para ver las políticas existentes:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'usuarios';
```

### 4. Probar la Solución

1. Regresa a tu aplicación
2. Intenta registrar un nuevo usuario
3. Verifica que no aparezca el error de RLS

## Solución Alternativa (Si la anterior no funciona)

Si el problema persiste, puedes usar esta política más permisiva:

```sql
-- Política más permisiva para desarrollo
DROP POLICY IF EXISTS "Permitir inserción de perfiles de usuario" ON public.usuarios;
CREATE POLICY "Permitir inserción de perfiles de usuario" ON public.usuarios
    FOR INSERT WITH CHECK (true);
```

## Verificación de la Solución

### Logs de Éxito Esperados:
```
✅ Registro exitoso: { user: {...}, session: null }
✅ Perfil creado manualmente exitosamente
```

### Si el Problema Persiste:
```
❌ Error creando perfil manualmente: { code: '42501', message: 'new row violates row-level security policy' }
```

## Notas Importantes

- **Ejecuta las consultas en orden**
- **Verifica que no haya errores** al ejecutar las consultas
- **Prueba inmediatamente** después de aplicar los cambios
- **Si usas la política permisiva**, recuerda cambiarla en producción

## Comandos de Verificación

```sql
-- Verificar que las políticas se crearon correctamente
SELECT * FROM pg_policies WHERE tablename = 'usuarios';

-- Verificar que RLS está habilitado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'usuarios';
```

## Si Nada Funciona

1. **Verifica el trigger** `on_auth_user_created`
2. **Revisa los logs** de Supabase
3. **Contacta soporte** de Supabase
4. **Considera deshabilitar RLS temporalmente** para desarrollo 
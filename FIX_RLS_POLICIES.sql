-- FIX_RLS_POLICIES.sql
-- Ejecutar este código en el SQL Editor de Supabase para corregir las políticas RLS

-- 1. Eliminar políticas existentes que puedan estar causando conflictos
DROP POLICY IF EXISTS "Permitir inserción de perfiles de usuario" ON public.usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden insertar su propio perfil" ON public.usuarios;

-- 2. Crear una política más permisiva para INSERT en usuarios
-- Esta política permite que cualquier usuario autenticado inserte su propio perfil
CREATE POLICY "Permitir inserción de perfiles de usuario" ON public.usuarios
    FOR INSERT WITH CHECK (
        auth.uid() = usuario_id
    );

-- 3. Verificar que las políticas de SELECT y UPDATE estén correctas
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

-- 6. Crear una función para verificar si el usuario existe en auth.users
CREATE OR REPLACE FUNCTION public.user_exists_in_auth(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Política alternativa más permisiva para desarrollo
-- Esta política permite inserción si el usuario existe en auth.users
CREATE POLICY "Permitir inserción si usuario existe en auth" ON public.usuarios
    FOR INSERT WITH CHECK (
        public.user_exists_in_auth(usuario_id)
    );

-- 8. Verificar las políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check 
FROM pg_policies 
WHERE tablename = 'usuarios'; 
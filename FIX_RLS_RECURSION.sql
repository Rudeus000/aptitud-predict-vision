-- FIX_RLS_RECURSION.sql
-- Ejecutar este código en el SQL Editor de Supabase para corregir la recursión infinita

-- 1. Eliminar todas las políticas problemáticas
DROP POLICY IF EXISTS "Permitir inserción de perfiles de usuario" ON public.usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden ver su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Los usuarios pueden actualizar su propio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Los empleadores pueden ver todos los perfiles de usuarios" ON public.usuarios;
DROP POLICY IF EXISTS "Permitir inserción si usuario existe en auth" ON public.usuarios;

-- 2. Crear políticas simples y sin recursión
-- Política para SELECT - usuarios pueden ver su propio perfil
CREATE POLICY "usuarios_select_own" ON public.usuarios
    FOR SELECT USING (auth.uid() = usuario_id);

-- Política para INSERT - permitir inserción de perfiles
CREATE POLICY "usuarios_insert" ON public.usuarios
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

-- Política para UPDATE - usuarios pueden actualizar su propio perfil
CREATE POLICY "usuarios_update_own" ON public.usuarios
    FOR UPDATE USING (auth.uid() = usuario_id);

-- Política para empleadores/administradores - pueden ver todos los perfiles
CREATE POLICY "usuarios_select_admin" ON public.usuarios
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.usuarios u
            WHERE u.usuario_id = auth.uid() 
            AND u.rol IN ('empleador', 'administrador')
        )
    );

-- 3. Verificar que RLS esté habilitado
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- 4. Verificar las políticas creadas
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check 
FROM pg_policies 
WHERE tablename = 'usuarios'
ORDER BY policyname; 
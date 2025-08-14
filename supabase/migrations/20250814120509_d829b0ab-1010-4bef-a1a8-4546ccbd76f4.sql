-- Crear perfil para el usuario existente si no existe
INSERT INTO profiles (user_id, email, nombre)
VALUES ('3ff5bfc0-6ac7-4580-b102-6046908dad4e', 'nazar@gruponazar.com', 'Nazar')
ON CONFLICT (user_id) DO NOTHING;

-- Eliminar rol existente si existe y crear nuevo rol SUPERADMIN
DELETE FROM user_roles WHERE user_id = '3ff5bfc0-6ac7-4580-b102-6046908dad4e';
INSERT INTO user_roles (user_id, role, agencia_id)
VALUES ('3ff5bfc0-6ac7-4580-b102-6046908dad4e', 'SUPERADMIN', null);
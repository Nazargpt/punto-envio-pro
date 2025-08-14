-- Asignar rol SUPERADMIN al usuario real
INSERT INTO user_roles (user_id, role, agencia_id)
VALUES ('3ff5bfc0-6ac7-4580-b102-6046908dad4e', 'SUPERADMIN', null)
ON CONFLICT (user_id, role) DO NOTHING;
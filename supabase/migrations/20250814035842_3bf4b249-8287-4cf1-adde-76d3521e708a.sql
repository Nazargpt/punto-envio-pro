-- First, let's check what roles exist and add missing ones
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'USER';
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'ADMIN';
# 🔐 Criar Usuário Admin no Banco de Dados

## 📋 Passo a Passo

### 1️⃣ **Acesse o Console do Neon**
- Vá para: https://console.neon.tech
- Faça login
- Selecione seu projeto SPEAKAI
- Clique em **SQL Editor** (no menu lateral)

### 2️⃣ **Execute o SQL abaixo**

Copie e cole este código no SQL Editor:

```sql
-- Criar usuário admin
INSERT INTO users (id, username, password, email, name, status, is_admin)
VALUES (
  gen_random_uuid(),
  'admin@speakai.com',
  '$2b$10$0SZbBkyq/Rog0IKHt/4zAOZ0UVNgOjkPtH/nhiFauYCh8U87D4CYC',
  'admin@speakai.com',
  'Administrador',
  'active',
  true
)
ON CONFLICT (username) DO NOTHING;

-- Adicionar créditos ilimitados
INSERT INTO user_credits (id, user_id, credits, total_purchased, total_used)
SELECT 
  gen_random_uuid(),
  u.id,
  999999,
  999999,
  0
FROM users u
WHERE u.username = 'admin@speakai.com'
ON CONFLICT DO NOTHING;

-- Verificar se foi criado
SELECT id, username, email, name, is_admin, status FROM users WHERE username = 'admin@speakai.com';
```

### 3️⃣ **Clique em "Run"**

Você deve ver uma mensagem de sucesso e o usuário criado.

---

## ✅ **Credenciais de Login**

Depois de executar o SQL, use estas credenciais no app:

```
Email: admin@speakai.com
Senha: admin123
```

---

## 🔄 **Alternativa: Criar via Signup**

Se preferir, você pode criar uma conta normal pelo app:

1. Acesse: `https://seu-app.onrender.com/signup`
2. Preencha:
   - **Email**: seu-email@exemplo.com
   - **Senha**: sua-senha-segura (mínimo 6 caracteres)
   - **Nome**: Seu Nome
3. Clique em "Criar conta"
4. Faça login com essas credenciais

---

## 🛠️ **Mudar a Senha do Admin**

Se quiser mudar a senha `admin123` para outra:

1. Execute no terminal:
```bash
node create-admin-user.cjs
```

2. Mude a linha `const password = 'admin123';` para sua senha
3. Execute novamente
4. Copie o novo hash e atualize no SQL

---

## ❓ **Problemas?**

### "Usuário já existe"
Se o usuário já foi criado, você pode atualizar a senha:

```sql
UPDATE users 
SET password = '$2b$10$0SZbBkyq/Rog0IKHt/4zAOZ0UVNgOjkPtH/nhiFauYCh8U87D4CYC'
WHERE username = 'admin@speakai.com';
```

### "Tabela não existe"
As tabelas são criadas automaticamente quando o app inicia. Certifique-se de que:
1. O app foi deployado no Render
2. O app iniciou sem erros
3. A variável `DATABASE_URL` está configurada

---

## 📊 **Verificar Créditos**

Para ver os créditos do usuário:

```sql
SELECT 
  u.username,
  u.email,
  uc.credits,
  uc.total_purchased,
  uc.total_used
FROM users u
LEFT JOIN user_credits uc ON u.id = uc.user_id
WHERE u.username = 'admin@speakai.com';
```

---

**Pronto! Agora você pode fazer login no app! 🎉**

# 🔑 Configuração de Múltiplas API Keys do Gemini

## 📋 Visão Geral

O sistema agora suporta **rotação automática de API keys** do Gemini para:
- ✅ Distribuir requisições entre múltiplas chaves (round-robin)
- ✅ Evitar limites de rate limit
- ✅ Fallback automático se uma chave falhar
- ✅ Reset automático de chaves falhadas a cada hora

---

## 🔧 Configuração no Render

### **1️⃣ Adicione a variável GEMINI_API_KEYS**

No painel do Render:
1. Vá em **Settings → Environment**
2. Adicione uma nova variável:
   - **Key:** `GEMINI_API_KEYS`
   - **Value:** Suas chaves separadas por vírgula

### **2️⃣ Formato da variável**

```
GEMINI_API_KEYS=AIzaSyAZRAUkjqZT-QqZ0Tmb7XsVIBH4tOzxzEw,AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX,AIzaSyCYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY
```

**Importante:**
- Separe as chaves com **vírgula** (`,`)
- Sem espaços entre as chaves
- Pode adicionar quantas chaves quiser (recomendado: 5-20)

### **3️⃣ Exemplo com 20 chaves**

```
GEMINI_API_KEYS=key1,key2,key3,key4,key5,key6,key7,key8,key9,key10,key11,key12,key13,key14,key15,key16,key17,key18,key19,key20
```

---

## 🎯 Como Funciona

### **Rotação Round-Robin**
```
Requisição 1 → API Key 1
Requisição 2 → API Key 2
Requisição 3 → API Key 3
...
Requisição 21 → API Key 1 (volta ao início)
```

### **Fallback Automático**
```
1. Tenta com API Key 1
2. Se falhar (401, 403, 429) → marca como falhada
3. Tenta com API Key 2
4. Se falhar → tenta API Key 3
5. Continua até encontrar uma chave que funcione
```

### **Reset Automático**
- Chaves marcadas como falhadas são resetadas a cada **1 hora**
- Isso permite que chaves temporariamente bloqueadas voltem a funcionar

---

## 📊 Monitoramento

O sistema loga automaticamente:

```
✅ API Key Rotator initialized with 20 keys
⚠️ API key failed (attempt 1/20): quota exceeded
❌ API key marked as failed (1/20 failed)
🔄 Resetting failed API keys
```

---

## 🧪 Testando

### **1. Com uma chave (modo atual)**
```env
GEMINI_API_KEYS=AIzaSyAZRAUkjqZT-QqZ0Tmb7XsVIBH4tOzxzEw
```

### **2. Com múltiplas chaves**
```env
GEMINI_API_KEYS=key1,key2,key3,key4,key5
```

### **3. Verificar logs**
No Render, vá em **Logs** e procure por:
- `API Key Rotator initialized`
- `API key failed`
- `Resetting failed API keys`

---

## ⚙️ Configurações Avançadas

### **Alterar intervalo de reset**
Edite `server/utils/apiKeyRotator.ts`:
```typescript
private readonly RESET_INTERVAL = 60 * 60 * 1000; // 1 hora
```

### **Alterar número de tentativas**
Por padrão, tenta todas as chaves disponíveis. Para limitar:
```typescript
await rotator.executeWithRotation(async (apiKey) => {
  // sua lógica
}, 5); // máximo 5 tentativas
```

---

## 🚨 Troubleshooting

### **Erro: "No valid API keys found"**
- Verifique se `GEMINI_API_KEYS` está configurada
- Certifique-se de que as chaves estão separadas por vírgula
- Não deixe espaços extras

### **Erro: "All API keys failed"**
- Todas as chaves atingiram o limite
- Aguarde 1 hora para reset automático
- Ou adicione mais chaves

### **Chaves não estão alternando**
- Verifique os logs do Render
- Certifique-se de que o deploy foi feito após adicionar `GEMINI_API_KEYS`

---

## 📝 Checklist de Deploy

- [ ] Adicionar variável `GEMINI_API_KEYS` no Render
- [ ] Colocar pelo menos 5 chaves (recomendado: 10-20)
- [ ] Fazer deploy manual ou aguardar deploy automático
- [ ] Verificar logs: "API Key Rotator initialized with X keys"
- [ ] Testar geradores (prompt, imagem, vídeo, chat)
- [ ] Monitorar logs para ver rotação funcionando

---

## 🎉 Benefícios

✅ **Maior capacidade:** 20 chaves = 20x mais requisições
✅ **Sem downtime:** Se uma chave falhar, usa outra automaticamente
✅ **Distribuição de carga:** Requisições distribuídas igualmente
✅ **Auto-recuperação:** Chaves falhadas voltam após 1 hora

---

**Última atualização:** 02 de Dezembro de 2024

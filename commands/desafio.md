---
description: Consulta o endpoint /desafio da API DIO Explorer e gera um desafio de código
argument-hint: <tecnologia> <nivel>
---
Execute o seguinte comando e aguarde a resposta:

```
curl -s http://localhost:3000/desafio/$1/$2
```

Se o comando retornar um JSON com campo `erro`, informe o usuário que o nível "$2" é inválido e liste os valores aceitos do campo `niveis_validos` (basico, intermediario, avancado).

Se retornar com sucesso, formate o JSON como um desafio de código em markdown:

# {titulo}

**Tecnologia:** {tecnologia}
**Nível:** {nivel}
**⚡ XP de Recompensa:** {xp_recompensa} XP
**⏱️ Tempo Estimado:** {tempo_estimado}

---

## 📋 Descrição

{descricao}

## 🎯 Objetivo

{liste cada item de `objetivo` como bullet point}

## 📥 Entrada

{entrada}

## 📤 Saída Esperada

{para cada item de `saida_esperada`, formate como:}

**Exemplo {n}:**
- Entrada: `{entrada}`
- Saída: `{saida}`

## 💡 Dicas

{liste cada item de `dicas`}

## 🏆 Critérios de Avaliação

{liste cada item de `criterios_de_avaliacao` como bullet point}

---

*Desafio gerado pela DIO • Tecnologia: {tecnologia} • Nível: {nivel}*

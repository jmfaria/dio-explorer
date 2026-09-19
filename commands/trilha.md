---
description: Consulta o endpoint /trilha da API DIO Explorer e formata o plano de estudos
argument-hint: <tecnologia>
---
Execute o seguinte comando e aguarde a resposta:

```
curl -s http://localhost:3000/trilha/$1
```

Se o comando retornar um JSON com campo `erro`, informe o usuário de forma amigável que a trilha "$1" não foi encontrada e liste as tecnologias do campo `tecnologias_disponiveis`.

Se retornar com sucesso, formate o JSON como um plano de estudos completo em markdown:

# 🎯 Trilha: {trilha}

**Tecnologia:** {tecnologia}
**Nível:** {nivel}
**XP Total:** {xp_total} XP
**Total de Módulos:** {numero_de_modulos}

---

## 📚 Plano de Estudos Semanal

### Fase 1 — Fundamentos

Para cada módulo em `plano_de_estudos.fase_1_fundamentos`, liste:
- **Módulo {numero}:** {titulo} — _{objetivo}_ ({tempo_estimado})

### Fase 2 — Prática

Para cada módulo em `plano_de_estudos.fase_2_pratica`, liste:
- **Módulo {numero}:** {titulo} — _{objetivo}_ ({tempo_estimado})

### Fase 3 — Avançado

Para cada módulo em `plano_de_estudos.fase_3_avancado`, liste:
- **Módulo {numero}:** {titulo} — _{objetivo}_ ({tempo_estimado})

## 🏅 Badges Disponíveis

{liste cada badge de `badges_disponiveis` com emoji 🏅}

## 🎥 Lives ao Vivo

{liste cada item de `lives_ao_vivo` com título, data e instrutor}

## 💡 Dicas de Estudo

{liste cada item de `dicas_de_estudo`}

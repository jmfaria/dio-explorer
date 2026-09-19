---
description: Consulta o endpoint /certificado da API DIO Explorer e gera o certificado
argument-hint: <nome-do-usuario> <trilha>
---
Execute o seguinte comando e aguarde a resposta:

```
curl -s -X POST http://localhost:3000/certificado \
  -H "Content-Type: application/json" \
  -d '{"nome": "$1", "trilha": "$2"}'
```

Se o comando retornar um campo `aviso`, exiba-o ao usuário antes do certificado.

Formate o campo `certificado` do JSON retornado como um certificado fictício em markdown:

---

<div align="center">

# 🎓 CERTIFICADO DE CONCLUSÃO

## Digital Innovation One — DIO

---

*Certificamos que*

# {certificado.nome_usuario}

*concluiu com êxito a trilha de formação*

## {certificado.trilha}

---

| 📅 Data de Conclusão | 🏆 Nível | ⚡ XP Conquistado | 📦 Módulos |
|:---:|:---:|:---:|:---:|
| {certificado.data_conclusao} | {certificado.nivel} | {certificado.xp_conquistado} XP | {certificado.numero_de_modulos} módulos |

---

### 🏅 Badges Conquistadas

{liste cada badge de `certificado.badges_conquistadas` com emoji 🏅}

---

### 🎯 Competências Desenvolvidas

{liste cada item de `certificado.competencias_desenvolvidas`}

---

*Certificado fictício gerado pelo DIO Explorer*
**ID do Certificado:** `{certificado.id_certificado}`

</div>

---

*Digital Innovation One • Transformando talentos em profissionais de tecnologia*

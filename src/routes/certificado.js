const express = require('express');
const path = require('path');
const { trilhas } = require(path.join(__dirname, '../../data/trilhas-dio.json'));

const router = express.Router();

// POST /certificado
// Body JSON: { "nome": "<nome-do-usuario>", "trilha": "<tecnologia>" }
// Gera um certificado fictício para o usuário com os dados reais da trilha.
// Equivalente ao slash command /certificado <nome-do-usuario> <trilha>
router.post('/', (req, res) => {
  const { nome, trilha: trilhaQuery } = req.body;

  if (!nome || !trilhaQuery) {
    return res.status(400).json({
      erro: 'Os campos "nome" e "trilha" são obrigatórios no body da requisição.',
    });
  }

  const query = trilhaQuery.toLowerCase();
  const trilha = trilhas.find(
    t =>
      t.nome.toLowerCase().includes(query) ||
      t.tecnologia.toLowerCase().includes(query),
  );

  const hoje = new Date();
  const dataConclusao = [
    String(hoje.getDate()).padStart(2, '0'),
    String(hoje.getMonth() + 1).padStart(2, '0'),
    hoje.getFullYear(),
  ].join('/');

  const ano = hoje.getFullYear();
  const sufixoAleatorio = gerarSufixo(4);

  if (!trilha) {
    // Certificado genérico com aviso, mantendo parity com o comando original
    return res.status(200).json({
      aviso: `Trilha "${trilhaQuery}" não localizada no catálogo. Certificado gerado com valores genéricos.`,
      certificado: {
        titulo: 'CERTIFICADO DE CONCLUSÃO',
        emissor: 'Digital Innovation One — DIO',
        nome_usuario: nome,
        trilha: trilhaQuery,
        data_conclusao: dataConclusao,
        nivel: 'N/A',
        xp_conquistado: 0,
        numero_de_modulos: 0,
        badges_conquistadas: [],
        competencias_desenvolvidas: competenciasGenericas(),
        id_certificado: `DIO-${ano}000-${sufixoAleatorio}`,
      },
    });
  }

  const idPadded = String(trilha.id).padStart(3, '0');

  res.json({
    certificado: {
      titulo: 'CERTIFICADO DE CONCLUSÃO',
      emissor: 'Digital Innovation One — DIO',
      nome_usuario: nome,
      trilha: trilha.nome,
      data_conclusao: dataConclusao,
      nivel: trilha.nivel,
      xp_conquistado: trilha.xp_total,
      numero_de_modulos: trilha.numero_de_modulos,
      badges_conquistadas: trilha.badges_disponiveis,
      competencias_desenvolvidas: gerarCompetencias(trilha.tecnologia, trilha.nivel),
      id_certificado: `DIO-${ano}${idPadded}-${sufixoAleatorio}`,
    },
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function gerarSufixo(n) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function gerarCompetencias(tecnologia, nivel) {
  const base = [
    `Desenvolvimento de soluções utilizando ${tecnologia}`,
    `Aplicação de boas práticas e padrões de projeto com ${tecnologia}`,
    `Criação e consumo de APIs integradas com ${tecnologia}`,
    `Versionamento de código e colaboração em equipe`,
  ];
  if (nivel === 'Intermediário' || nivel === 'Avançado') {
    base.push(`Testes automatizados e qualidade de código em projetos ${tecnologia}`);
  }
  if (nivel === 'Avançado') {
    base.push(`Arquitetura de sistemas escaláveis com ${tecnologia}`);
  }
  return base;
}

function competenciasGenericas() {
  return [
    'Lógica de programação e resolução de problemas',
    'Versionamento de código com Git',
    'Trabalho em equipe e metodologias ágeis',
    'Boas práticas de desenvolvimento de software',
  ];
}

module.exports = router;

const express = require('express');
const path = require('path');
const { trilhas } = require(path.join(__dirname, '../../data/trilhas-dio.json'));

const router = express.Router();

// GET /trilha/:tecnologia
// Retorna um plano de estudos da trilha correspondente à tecnologia informada.
// Equivalente ao slash command /trilha <tecnologia>
router.get('/:tecnologia', (req, res) => {
  const query = req.params.tecnologia.toLowerCase();
  const trilha = trilhas.find(t => t.tecnologia.toLowerCase().includes(query));

  if (!trilha) {
    const disponiveis = trilhas.map(t => t.tecnologia);
    return res.status(404).json({
      erro: `Nenhuma trilha encontrada para "${req.params.tecnologia}".`,
      tecnologias_disponiveis: disponiveis,
    });
  }

  // Gera os módulos divididos em 3 fases
  const total = trilha.numero_de_modulos;
  const fase1End = Math.ceil(total * 0.3);
  const fase2End = Math.ceil(total * 0.65);
  const modulos = gerarModulos(trilha.tecnologia, trilha.nivel, total);

  const plano = {
    trilha: trilha.nome,
    tecnologia: trilha.tecnologia,
    nivel: trilha.nivel,
    xp_total: trilha.xp_total,
    numero_de_modulos: total,
    plano_de_estudos: {
      fase_1_fundamentos: modulos.slice(0, fase1End),
      fase_2_pratica: modulos.slice(fase1End, fase2End),
      fase_3_avancado: modulos.slice(fase2End),
    },
    badges_disponiveis: trilha.badges_disponiveis,
    lives_ao_vivo: trilha.lives_ao_vivo.map(l => ({
      titulo: l.titulo,
      data: formatarData(l.data),
      instrutor: l.instrutor,
    })),
    dicas_de_estudo: gerarDicas(trilha.tecnologia),
  };

  res.json(plano);
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatarData(iso) {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

const TEMAS_POR_NIVEL = {
  Básico: [
    'Introdução e Configuração do Ambiente',
    'Conceitos Fundamentais',
    'Sintaxe e Estruturas Básicas',
    'Trabalhando com Dados',
    'Funções e Modularização',
    'Estruturas de Controle',
    'Primeiro Projeto Prático',
    'Boas Práticas Iniciais',
  ],
  Intermediário: [
    'Revisão e Setup do Projeto',
    'Orientação a Objetos',
    'Manipulação de Dados Avançada',
    'Integração com APIs',
    'Testes e Qualidade de Código',
    'Padrões de Projeto Essenciais',
    'Projeto Intermediário Completo',
    'Boas Práticas e Code Review',
    'Performance e Otimização',
    'Deploy e Ambientes',
  ],
  Avançado: [
    'Fundamentos Revisitados com Profundidade',
    'Arquitetura e Design de Sistemas',
    'Algoritmos e Estruturas de Dados Avançados',
    'Concorrência e Paralelismo',
    'Segurança e Autenticação',
    'Observabilidade e Monitoramento',
    'Microsserviços e Distribuição',
    'Padrões de Projeto Avançados',
    'Projeto Completo de Alto Impacto',
    'Otimização e Escalabilidade',
    'CI/CD e DevOps Integration',
    'Revisão Final e Portfólio',
  ],
};

const TEMPO_POR_NIVEL = { Básico: '4–6h', Intermediário: '6–8h', Avançado: '8–12h' };

function gerarModulos(tecnologia, nivel, total) {
  const base = TEMAS_POR_NIVEL[nivel] || TEMAS_POR_NIVEL['Intermediário'];
  const tempo = TEMPO_POR_NIVEL[nivel] || '6–8h';
  const modulos = [];
  for (let i = 0; i < total; i++) {
    const tema = base[i % base.length];
    modulos.push({
      numero: i + 1,
      titulo: `${tecnologia} — ${tema}`,
      objetivo: `Dominar ${tema.toLowerCase()} utilizando ${tecnologia}.`,
      tempo_estimado: tempo,
    });
  }
  return modulos;
}

function gerarDicas(tecnologia) {
  return [
    `Pratique diariamente com pequenos projetos usando ${tecnologia} para fixar os conceitos.`,
    `Leia a documentação oficial de ${tecnologia} — ela é a fonte mais confiável e atualizada.`,
    `Participe de comunidades e fóruns sobre ${tecnologia} para tirar dúvidas e aprender com outros devs.`,
  ];
}

module.exports = router;

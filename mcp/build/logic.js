/**
 * logic.ts — Lógica de negócio do DIO Explorer, independente de transporte.
 * Usada tanto pelo MCP server quanto pode ser reaproveitada em outros contextos.
 */
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
// ─── Dados ───────────────────────────────────────────────────────────────────
const { trilhas } = require(join(__dirname, '../../data/trilhas-dio.json'));
// ─── Helpers compartilhados ───────────────────────────────────────────────────
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
const TEMPO_POR_NIVEL = {
    Básico: '4–6h',
    Intermediário: '6–8h',
    Avançado: '8–12h',
};
function gerarModulos(tecnologia, nivel, total) {
    const base = TEMAS_POR_NIVEL[nivel] ?? TEMAS_POR_NIVEL['Intermediário'];
    const tempo = TEMPO_POR_NIVEL[nivel] ?? '6–8h';
    return Array.from({ length: total }, (_, i) => {
        const tema = base[i % base.length];
        return {
            numero: i + 1,
            titulo: `${tecnologia} — ${tema}`,
            objetivo: `Dominar ${tema.toLowerCase()} utilizando ${tecnologia}.`,
            tempo_estimado: tempo,
        };
    });
}
function gerarDicas(tecnologia) {
    return [
        `Pratique diariamente com pequenos projetos usando ${tecnologia} para fixar os conceitos.`,
        `Leia a documentação oficial de ${tecnologia} — ela é a fonte mais confiável e atualizada.`,
        `Participe de comunidades e fóruns sobre ${tecnologia} para tirar dúvidas e aprender com outros devs.`,
    ];
}
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
// ─── Lógica de negócio exportada ─────────────────────────────────────────────
export function buscarTrilha(tecnologia) {
    const query = tecnologia.toLowerCase();
    const trilha = trilhas.find(t => t.tecnologia.toLowerCase().includes(query));
    if (!trilha)
        return null;
    const total = trilha.numero_de_modulos;
    const fase1End = Math.ceil(total * 0.3);
    const fase2End = Math.ceil(total * 0.65);
    const modulos = gerarModulos(trilha.tecnologia, trilha.nivel, total);
    return {
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
}
export function listarTecnologias() {
    return trilhas.map(t => t.tecnologia);
}
export function gerarCertificado(nome, trilhaQuery) {
    const query = trilhaQuery.toLowerCase();
    const trilha = trilhas.find(t => t.nome.toLowerCase().includes(query) || t.tecnologia.toLowerCase().includes(query));
    const hoje = new Date();
    const dataConclusao = [
        String(hoje.getDate()).padStart(2, '0'),
        String(hoje.getMonth() + 1).padStart(2, '0'),
        hoje.getFullYear(),
    ].join('/');
    const ano = hoje.getFullYear();
    const sufixo = gerarSufixo(4);
    if (!trilha) {
        return {
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
                competencias_desenvolvidas: [
                    'Lógica de programação e resolução de problemas',
                    'Versionamento de código com Git',
                    'Trabalho em equipe e metodologias ágeis',
                    'Boas práticas de desenvolvimento de software',
                ],
                id_certificado: `DIO-${ano}000-${sufixo}`,
            },
        };
    }
    const idPadded = String(trilha.id).padStart(3, '0');
    return {
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
            id_certificado: `DIO-${ano}${idPadded}-${sufixo}`,
        },
    };
}
const NIVEL_MAP = {
    basico: 'Básico',
    básico: 'Básico',
    intermediario: 'Intermediário',
    intermediário: 'Intermediário',
    avancado: 'Avançado',
    avançado: 'Avançado',
};
export function normalizarNivel(raw) {
    return NIVEL_MAP[raw.toLowerCase()] ?? null;
}
const XP_POR_NIVEL = {
    Básico: [200, 700],
    Intermediário: [700, 1400],
    Avançado: [1400, 2000],
};
const TEMPO_DESAFIO = {
    Básico: '30–60 minutos',
    Intermediário: '1–3 horas',
    Avançado: '3–6 horas',
};
const BANCOS_DE_DESAFIOS = {
    Básico: [
        {
            titulo: 'Calculadora de Média',
            descricao: 'Você foi contratado para ajudar uma escola a calcular a média de notas dos alunos. Crie um programa que receba uma lista de notas e retorne a média aritmética. O sistema deve também indicar se o aluno foi aprovado (média ≥ 7) ou reprovado.',
            objetivo: ['Receber uma lista de números como entrada', 'Calcular e retornar a média aritmética', 'Retornar "Aprovado" ou "Reprovado" conforme a média'],
            entrada: 'Uma lista de números decimais representando as notas.',
            exemplos: [
                { entrada: '[8.0, 7.5, 9.0]', saida: '{ media: 8.17, status: "Aprovado" }' },
                { entrada: '[4.0, 5.0, 6.0]', saida: '{ media: 5.0, status: "Reprovado" }' },
            ],
            dicas: ['Use a soma dos elementos dividida pelo total para calcular a média.', 'Arredonde a média para 2 casas decimais antes de retornar.'],
            criterios: ['Cálculo correto da média aritmética', 'Lógica de aprovação/reprovação funcionando', 'Código legível e com nomes descritivos de variáveis'],
        },
        {
            titulo: 'Verificador de Palíndromo',
            descricao: 'Uma empresa de jogos educativos precisa de uma função para verificar se uma palavra é um palíndromo. Palíndromo é uma palavra que se lê igualmente de trás para frente (ex: "arara"). Desconsidere maiúsculas e minúsculas na comparação.',
            objetivo: ['Receber uma string como entrada', 'Verificar se é palíndromo ignorando case', 'Retornar true ou false'],
            entrada: 'Uma string contendo apenas letras.',
            exemplos: [{ entrada: '"Arara"', saida: 'true' }, { entrada: '"casa"', saida: 'false' }],
            dicas: ['Converta a string para minúsculas antes de comparar.', 'Reverta a string e compare com o original.'],
            criterios: ['Resultado correto para palavras palíndromas e não palíndromas', 'Tratamento case-insensitive', 'Solução clara e concisa'],
        },
        {
            titulo: 'Contador de Vogais',
            descricao: 'Um sistema de análise de texto precisa contar quantas vogais existem em uma frase. Implemente uma função que receba uma string e retorne o número total de vogais (a, e, i, o, u). O sistema deve ser case-insensitive.',
            objetivo: ['Receber uma string', 'Contar as ocorrências de a, e, i, o, u', 'Retornar o total como número inteiro'],
            entrada: 'Uma string de texto qualquer.',
            exemplos: [{ entrada: '"Hello World"', saida: '3' }, { entrada: '"DIO Explorer"', saida: '5' }],
            dicas: ['Converta a string para minúsculas e itere caractere por caractere.', 'Use um conjunto (Set ou array) com as vogais para verificar pertencimento.'],
            criterios: ['Contagem correta das vogais', 'Funcionamento case-insensitive', 'Eficiência da solução'],
        },
    ],
    Intermediário: [
        {
            titulo: 'Anagrama Detector',
            descricao: 'Uma plataforma de jogos de palavras precisa de uma função que determine se duas strings são anagramas. Duas palavras são anagramas se contêm exatamente os mesmos caracteres com as mesmas frequências.',
            objetivo: ['Receber duas strings', 'Verificar se são anagramas uma da outra', 'Retornar true ou false'],
            entrada: 'Duas strings.',
            exemplos: [{ entrada: '"listen", "silent"', saida: 'true' }, { entrada: '"hello", "world"', saida: 'false' }],
            dicas: ['Ordene os caracteres de cada string e compare.', 'Use um mapa de frequências para cada string.'],
            criterios: ['Algoritmo correto e eficiente', 'Tratamento adequado de maiúsculas/minúsculas', 'Complexidade de tempo razoável (O(n log n) ou melhor)'],
        },
        {
            titulo: 'Sistema de Carrinho de Compras',
            descricao: 'Uma loja virtual precisa de uma classe para gerenciar um carrinho de compras. Implemente a classe com métodos para adicionar itens, remover itens, calcular o total e aplicar um cupom de desconto.',
            objetivo: ['Classe Carrinho com métodos add(item, qty, price), remove(item), total(), e applyCoupon(percent)', 'Total calculado com base em quantidade × preço', 'Desconto aplicado como percentual sobre o total'],
            entrada: 'Operações sequenciais sobre a instância da classe.',
            exemplos: [{ entrada: 'add("Notebook", 1, 3500); add("Mouse", 2, 80); total()', saida: '3660' }, { entrada: 'applyCoupon(10); total()', saida: '3294' }],
            dicas: ['Use um objeto/mapa internamente para armazenar itens por nome.', 'Mantenha o desconto como estado interno da classe.'],
            criterios: ['Todos os métodos funcionando corretamente', 'Encapsulamento adequado', 'Remoção automática de itens com qty 0'],
        },
    ],
    Avançado: [
        {
            titulo: 'Cache LRU',
            descricao: 'Sistemas de alto desempenho frequentemente implementam cache para reduzir latência. Implemente uma estrutura de dados LRU (Least Recently Used) com capacidade fixa. Quando a capacidade é atingida, o item menos recentemente acessado deve ser removido.',
            objetivo: ['Classe LRUCache com construtor recebendo capacidade', 'Método get(key): retorna o valor ou -1 se não existir', 'Método put(key, value): insere/atualiza; remove o LRU se necessário', 'Ambas as operações em O(1)'],
            entrada: 'Sequência de operações get/put sobre a cache.',
            exemplos: [{ entrada: 'new LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2)', saida: '-1 (chave 2 foi evicted)' }, { entrada: 'new LRUCache(1); put(2,1); get(2); put(3,2); get(2); get(3)', saida: '-1, 2' }],
            dicas: ['Combine um HashMap com uma lista duplamente encadeada.', 'Na linguagem que suporta LinkedHashMap/OrderedDict, use-o diretamente.'],
            criterios: ['Ambas as operações em O(1)', 'Política LRU implementada corretamente', 'Testes cobrindo eviction e atualização de itens existentes'],
        },
        {
            titulo: 'Worker Pool com Promises',
            descricao: 'Um serviço de processamento de tarefas precisa executar múltiplas tarefas assíncronas em paralelo, mas limitando o número de tarefas simultâneas para evitar sobrecarga. Implemente uma função que receba um array de tasks e um limite de concorrência.',
            objetivo: ['Função asyncPool(limit, tasks): executa as tasks com no máximo `limit` em paralelo', 'Retorna uma Promise que resolve com todos os resultados na ordem original', 'Novas tasks são iniciadas assim que uma slot fica livre'],
            entrada: 'Array de funções async e número inteiro como limite.',
            exemplos: [{ entrada: 'asyncPool(2, [t1, t2, t3, t4])', saida: 'Array com resultados de t1..t4 em ordem, máx 2 em paralelo' }, { entrada: 'asyncPool(1, tasks)', saida: 'Execução sequencial de todas as tasks' }],
            dicas: ['Mantenha um "slot pool" usando Promise.race para liberar slots.', 'Use um índice global e vá consumindo o array de tasks à medida que slots abrem.'],
            criterios: ['Concorrência respeitada em todos os cenários', 'Resultados retornados na ordem original das tasks', 'Código testável e sem memory leaks'],
        },
    ],
};
export function gerarDesafio(tecnologia, nivel) {
    const banco = BANCOS_DE_DESAFIOS[nivel];
    const template = banco[Math.floor(Math.random() * banco.length)];
    const [min, max] = XP_POR_NIVEL[nivel];
    const xp = Math.floor(Math.random() * ((max - min) / 50 + 1)) * 50 + min;
    return {
        titulo: `⚔️ Desafio DIO: ${template.titulo}`,
        tecnologia,
        nivel,
        xp_recompensa: xp,
        tempo_estimado: TEMPO_DESAFIO[nivel],
        descricao: template.descricao,
        objetivo: template.objetivo,
        entrada: template.entrada,
        saida_esperada: template.exemplos,
        dicas: template.dicas,
        criterios_de_avaliacao: template.criterios,
    };
}

const request = require('supertest');
const app = require('../../src/server');

describe('GET /desafio/:tecnologia/:nivel', () => {
  // ── Casos de sucesso ───────────────────────────────────────────────────────

  it('retorna 200 para nível "basico"', async () => {
    const res = await request(app).get('/desafio/JavaScript/basico');

    expect(res.status).toBe(200);
  });

  it('retorna 200 para nível "intermediario"', async () => {
    const res = await request(app).get('/desafio/Python/intermediario');

    expect(res.status).toBe(200);
  });

  it('retorna 200 para nível "avancado"', async () => {
    const res = await request(app).get('/desafio/Java/avancado');

    expect(res.status).toBe(200);
  });

  it('aceita nível com acento (avançado)', async () => {
    const res = await request(app).get('/desafio/JavaScript/avan%C3%A7ado');

    expect(res.status).toBe(200);
    expect(res.body.nivel).toBe('Avançado');
  });

  it('aceita nível com acento (básico)', async () => {
    const res = await request(app).get('/desafio/JavaScript/b%C3%A1sico');

    expect(res.status).toBe(200);
    expect(res.body.nivel).toBe('Básico');
  });

  it('aceita nível em maiúsculas (case-insensitive)', async () => {
    const res = await request(app).get('/desafio/JavaScript/BASICO');

    expect(res.status).toBe(200);
    expect(res.body.nivel).toBe('Básico');
  });

  it('retorna desafio com todos os campos obrigatórios', async () => {
    const res = await request(app).get('/desafio/JavaScript/basico');

    expect(res.body).toMatchObject({
      titulo: expect.stringContaining('Desafio DIO'),
      tecnologia: 'JavaScript',
      nivel: 'Básico',
      xp_recompensa: expect.any(Number),
      tempo_estimado: expect.any(String),
      descricao: expect.any(String),
      objetivo: expect.any(Array),
      entrada: expect.any(String),
      saida_esperada: expect.any(Array),
      dicas: expect.any(Array),
      criterios_de_avaliacao: expect.any(Array),
    });
  });

  it('campo tecnologia no response reflete o parâmetro da URL', async () => {
    const res = await request(app).get('/desafio/TypeScript/intermediario');

    expect(res.body.tecnologia).toBe('TypeScript');
  });

  it('xp_recompensa está dentro do intervalo básico (200–700, múltiplo de 50)', async () => {
    // Roda 10x para cobrir aleatoriedade
    for (let i = 0; i < 10; i++) {
      const res = await request(app).get('/desafio/JavaScript/basico');
      const xp = res.body.xp_recompensa;
      expect(xp).toBeGreaterThanOrEqual(200);
      expect(xp).toBeLessThanOrEqual(700);
      expect(xp % 50).toBe(0);
    }
  });

  it('xp_recompensa está dentro do intervalo avançado (1400–2000)', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await request(app).get('/desafio/JavaScript/avancado');
      const xp = res.body.xp_recompensa;
      expect(xp).toBeGreaterThanOrEqual(1400);
      expect(xp).toBeLessThanOrEqual(2000);
      expect(xp % 50).toBe(0);
    }
  });

  it('objetivo é um array não-vazio', async () => {
    const res = await request(app).get('/desafio/JavaScript/basico');

    expect(res.body.objetivo).toBeInstanceOf(Array);
    expect(res.body.objetivo.length).toBeGreaterThan(0);
  });

  it('saida_esperada contém pelo menos 2 exemplos', async () => {
    const res = await request(app).get('/desafio/JavaScript/basico');

    expect(res.body.saida_esperada.length).toBeGreaterThanOrEqual(2);
  });

  it('cada exemplo de saida_esperada tem campos entrada e saida', async () => {
    const res = await request(app).get('/desafio/JavaScript/basico');
    const exemplo = res.body.saida_esperada[0];

    expect(exemplo).toHaveProperty('entrada');
    expect(exemplo).toHaveProperty('saida');
  });

  it('dicas tem pelo menos 2 itens', async () => {
    const res = await request(app).get('/desafio/JavaScript/intermediario');

    expect(res.body.dicas.length).toBeGreaterThanOrEqual(2);
  });

  it('criterios_de_avaliacao tem pelo menos 3 itens', async () => {
    const res = await request(app).get('/desafio/JavaScript/avancado');

    expect(res.body.criterios_de_avaliacao.length).toBeGreaterThanOrEqual(3);
  });

  // ── Aleatoriedade — dois desafios seguidos podem diferir ──────────────────

  it('pode gerar desafios distintos entre chamadas (aleatoriedade)', async () => {
    // Com múltiplos templates no banco, em 20 tentativas é estatisticamente garantido
    // que pelo menos dois títulos serão diferentes (exceto se o banco tiver 1 template)
    const titulos = new Set();
    for (let i = 0; i < 20; i++) {
      const res = await request(app).get('/desafio/JavaScript/basico');
      titulos.add(res.body.titulo);
    }
    // Banco Básico tem 3 templates
    expect(titulos.size).toBeGreaterThan(1);
  });

  // ── Caso de erro ───────────────────────────────────────────────────────────

  it('retorna 400 para nível inválido', async () => {
    const res = await request(app).get('/desafio/JavaScript/expert');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
    expect(res.body).toHaveProperty('niveis_validos');
    expect(res.body.niveis_validos).toEqual(['basico', 'intermediario', 'avancado']);
  });

  it('mensagem de erro menciona o nível inválido fornecido', async () => {
    const res = await request(app).get('/desafio/JavaScript/senior');

    expect(res.body.erro).toMatch(/senior/i);
  });
});

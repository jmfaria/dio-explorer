const request = require('supertest');
const app = require('../../src/server');

describe('GET /trilha/:tecnologia', () => {
  // ── Caso de sucesso ────────────────────────────────────────────────────────

  it('retorna 200 e os campos esperados para uma tecnologia existente (match exato)', async () => {
    const res = await request(app).get('/trilha/JavaScript');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      trilha: 'Formação JavaScript Developer',
      tecnologia: 'JavaScript',
      nivel: 'Básico',
      xp_total: expect.any(Number),
      numero_de_modulos: expect.any(Number),
    });
  });

  it('retorna 200 com busca parcial e case-insensitive (react → React)', async () => {
    const res = await request(app).get('/trilha/react');

    expect(res.status).toBe(200);
    expect(res.body.tecnologia).toBe('React');
  });

  it('retorna plano_de_estudos com as três fases', async () => {
    const res = await request(app).get('/trilha/JavaScript');

    expect(res.body.plano_de_estudos).toBeDefined();
    expect(res.body.plano_de_estudos.fase_1_fundamentos).toBeInstanceOf(Array);
    expect(res.body.plano_de_estudos.fase_2_pratica).toBeInstanceOf(Array);
    expect(res.body.plano_de_estudos.fase_3_avancado).toBeInstanceOf(Array);
  });

  it('total de módulos nas 3 fases é igual a numero_de_modulos', async () => {
    const res = await request(app).get('/trilha/JavaScript');
    const { fase_1_fundamentos, fase_2_pratica, fase_3_avancado } = res.body.plano_de_estudos;
    const totalFases = fase_1_fundamentos.length + fase_2_pratica.length + fase_3_avancado.length;

    expect(totalFases).toBe(res.body.numero_de_modulos);
  });

  it('cada módulo contém numero, titulo, objetivo e tempo_estimado', async () => {
    const res = await request(app).get('/trilha/JavaScript');
    const modulo = res.body.plano_de_estudos.fase_1_fundamentos[0];

    expect(modulo).toMatchObject({
      numero: expect.any(Number),
      titulo: expect.any(String),
      objetivo: expect.any(String),
      tempo_estimado: expect.any(String),
    });
  });

  it('retorna badges_disponiveis como array não-vazio', async () => {
    const res = await request(app).get('/trilha/JavaScript');

    expect(res.body.badges_disponiveis).toBeInstanceOf(Array);
    expect(res.body.badges_disponiveis.length).toBeGreaterThan(0);
  });

  it('retorna lives_ao_vivo com titulo, data e instrutor formatados', async () => {
    const res = await request(app).get('/trilha/JavaScript');
    const live = res.body.lives_ao_vivo[0];

    expect(live).toMatchObject({
      titulo: expect.any(String),
      data: expect.stringMatching(/^\d{2}\/\d{2}\/\d{4}$/),
      instrutor: expect.any(String),
    });
  });

  it('retorna dicas_de_estudo como array com 3 itens', async () => {
    const res = await request(app).get('/trilha/JavaScript');

    expect(res.body.dicas_de_estudo).toBeInstanceOf(Array);
    expect(res.body.dicas_de_estudo).toHaveLength(3);
  });

  // ── Caso de erro ───────────────────────────────────────────────────────────

  it('retorna 404 para tecnologia inexistente', async () => {
    const res = await request(app).get('/trilha/cobol');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('erro');
    expect(res.body).toHaveProperty('tecnologias_disponiveis');
    expect(res.body.tecnologias_disponiveis).toBeInstanceOf(Array);
  });

  it('mensagem de erro menciona a tecnologia buscada', async () => {
    const res = await request(app).get('/trilha/cobol');

    expect(res.body.erro).toMatch(/cobol/i);
  });
});

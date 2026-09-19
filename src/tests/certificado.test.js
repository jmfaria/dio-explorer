const request = require('supertest');
const app = require('../../src/server');

describe('POST /certificado', () => {
  // ── Caso de sucesso com trilha encontrada ──────────────────────────────────

  it('retorna 200 e certificado válido para nome e trilha existentes', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'João Silva', trilha: 'JavaScript' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('certificado');
  });

  it('certificado contém todos os campos obrigatórios', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'João Silva', trilha: 'JavaScript' });

    expect(res.body.certificado).toMatchObject({
      titulo: 'CERTIFICADO DE CONCLUSÃO',
      emissor: 'Digital Innovation One — DIO',
      nome_usuario: 'João Silva',
      trilha: expect.any(String),
      data_conclusao: expect.stringMatching(/^\d{2}\/\d{2}\/\d{4}$/),
      nivel: expect.any(String),
      xp_conquistado: expect.any(Number),
      numero_de_modulos: expect.any(Number),
      badges_conquistadas: expect.any(Array),
      competencias_desenvolvidas: expect.any(Array),
      id_certificado: expect.stringMatching(/^DIO-\d{7}-[A-Z]{4}$/),
    });
  });

  it('usa dados reais da trilha quando encontrada', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'Maria', trilha: 'React' });

    expect(res.body.certificado.trilha).toBe('Formação React Developer');
    expect(res.body.certificado.nivel).toBe('Intermediário');
  });

  it('busca por nome parcial e case-insensitive (react → Formação React Developer)', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'Teste', trilha: 'react' });

    expect(res.status).toBe(200);
    expect(res.body.certificado.trilha).toBe('Formação React Developer');
  });

  it('id_certificado segue o padrão DIO-{ano}{id:3d}-{4letras}', async () => {
    const ano = new Date().getFullYear();
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'Dev', trilha: 'JavaScript' });

    const { id_certificado } = res.body.certificado;
    expect(id_certificado).toMatch(new RegExp(`^DIO-${ano}\\d{3}-[A-Z]{4}$`));
  });

  it('competencias_desenvolvidas tem pelo menos 4 itens', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'Dev', trilha: 'JavaScript' });

    expect(res.body.certificado.competencias_desenvolvidas.length).toBeGreaterThanOrEqual(4);
  });

  it('dois certificados gerados sequencialmente têm id_certificado diferentes', async () => {
    const payload = { nome: 'Dev', trilha: 'JavaScript' };
    const r1 = await request(app).post('/certificado').send(payload);
    const r2 = await request(app).post('/certificado').send(payload);

    // sufixo aleatório de 4 letras — pode ocasionalmente colidir, mas a chance é 1/456976
    expect(r1.body.certificado.id_certificado).not.toBe(r2.body.certificado.id_certificado);
  });

  // ── Trilha não encontrada — certificado genérico ───────────────────────────

  it('retorna 200 com aviso quando a trilha não existe', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'Dev', trilha: 'cobol' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('aviso');
    expect(res.body).toHaveProperty('certificado');
  });

  it('certificado genérico tem nivel N/A e xp_conquistado 0', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'Dev', trilha: 'cobol' });

    expect(res.body.certificado.nivel).toBe('N/A');
    expect(res.body.certificado.xp_conquistado).toBe(0);
    expect(res.body.certificado.badges_conquistadas).toEqual([]);
  });

  // ── Validação de campos obrigatórios ─────────────────────────────────────

  it('retorna 400 quando "nome" está ausente', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ trilha: 'JavaScript' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 400 quando "trilha" está ausente', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({ nome: 'Dev' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });

  it('retorna 400 quando o body está vazio', async () => {
    const res = await request(app)
      .post('/certificado')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('erro');
  });
});

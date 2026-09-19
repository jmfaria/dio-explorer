#!/usr/bin/env node
/**
 * DIO Explorer MCP Server
 *
 * Expõe três ferramentas ao Bob (e a qualquer cliente MCP):
 *   • buscar_trilha      — plano de estudos de uma trilha DIO
 *   • gerar_certificado  — certificado fictício de conclusão
 *   • gerar_desafio      — desafio de código por tecnologia e nível
 *
 * Transporte: stdio (padrão para uso local com Bob)
 * Para acesso remoto via HTTPS/SSO, troque StdioServerTransport por
 * StreamableHTTPServerTransport e registre o server com `url` no mcp.json.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import {
  buscarTrilha,
  listarTecnologias,
  gerarCertificado,
  gerarDesafio,
  normalizarNivel,
} from './logic.js';

const server = new McpServer({
  name: 'dio-explorer',
  version: '1.0.0',
});

// ─── Tool: buscar_trilha ─────────────────────────────────────────────────────

server.registerTool(
  'buscar_trilha',
  {
    description:
      'Retorna o plano de estudos completo de uma trilha DIO com base na tecnologia. ' +
      'A busca é parcial e case-insensitive (ex: "python" encontra "Python / Scikit-Learn"). ' +
      'Inclui módulos divididos em 3 fases, badges, lives ao vivo e dicas de estudo.',
    inputSchema: z.object({
      tecnologia: z
        .string()
        .describe('Nome (parcial) da tecnologia da trilha — ex: "javascript", "react", "java"'),
    }),
  },
  async ({ tecnologia }) => {
    const plano = buscarTrilha(tecnologia);

    if (!plano) {
      const disponiveis = listarTecnologias().join(', ');
      return {
        content: [
          {
            type: 'text',
            text: `Nenhuma trilha encontrada para "${tecnologia}".\n\nTecnologias disponíveis: ${disponiveis}`,
          },
        ],
        isError: true,
      };
    }

    return {
      content: [{ type: 'text', text: JSON.stringify(plano, null, 2) }],
    };
  },
);

// ─── Tool: gerar_certificado ─────────────────────────────────────────────────

server.registerTool(
  'gerar_certificado',
  {
    description:
      'Gera um certificado fictício de conclusão de trilha DIO para um usuário. ' +
      'Se a trilha for encontrada, usa dados reais (XP, badges, competências). ' +
      'Caso contrário, emite um certificado genérico com aviso.',
    inputSchema: z.object({
      nome: z.string().describe('Nome completo do usuário a ser certificado'),
      trilha: z
        .string()
        .describe('Nome (parcial) da trilha ou tecnologia — ex: "react", "Formação Java Developer"'),
    }),
  },
  async ({ nome, trilha }) => {
    const resultado = gerarCertificado(nome, trilha);
    return {
      content: [{ type: 'text', text: JSON.stringify(resultado, null, 2) }],
    };
  },
);

// ─── Tool: gerar_desafio ─────────────────────────────────────────────────────

server.registerTool(
  'gerar_desafio',
  {
    description:
      'Gera um desafio de código aleatório para uma tecnologia e nível informados. ' +
      'Inclui descrição, objetivos, exemplos de entrada/saída, dicas e critérios de avaliação. ' +
      'Níveis aceitos: basico, intermediario, avancado (com ou sem acento, case-insensitive).',
    inputSchema: z.object({
      tecnologia: z.string().describe('Linguagem ou tecnologia do desafio — ex: "Python", "TypeScript"'),
      nivel: z
        .string()
        .describe('Nível de dificuldade: "basico", "intermediario" ou "avancado"'),
    }),
  },
  async ({ tecnologia, nivel }) => {
    const nivelNormalizado = normalizarNivel(nivel);

    if (!nivelNormalizado) {
      return {
        content: [
          {
            type: 'text',
            text: `Nível "${nivel}" inválido. Use: basico, intermediario ou avancado.`,
          },
        ],
        isError: true,
      };
    }

    const desafio = gerarDesafio(tecnologia, nivelNormalizado);
    return {
      content: [{ type: 'text', text: JSON.stringify(desafio, null, 2) }],
    };
  },
);

// ─── Bootstrap ───────────────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('DIO Explorer MCP Server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

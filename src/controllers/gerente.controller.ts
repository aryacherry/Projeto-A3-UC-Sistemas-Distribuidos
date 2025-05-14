import { Request, Response } from 'express';
import { pool } from '../database/db';

// 1. Reservas atendidas ou não em um período
export const relatorioPorPeriodo = async (req: Request, res: Response) => {
  const { inicio, fim, status } = req.query;

  // Validação das datas
  const dataInicio = new Date(inicio as string);
  const dataFim = new Date(fim as string);

  // Verifica se a data inicial é maior que a final
  if (dataInicio > dataFim) {
    return res.status(400).json({
      erro: 'A data inicial não pode ser maior que a data final'
    });
  }

  try {
    // Consulta atualizada para incluir status cancelada
    const query = `
      SELECT id, data, hora, numero_mesa, qtd_pessoas, 
             nome_responsavel, status, garcom_responsavel
      FROM reservas 
      WHERE data BETWEEN $1 AND $2
      ${status ? 'AND status = $3' : ''}
      ORDER BY data, hora
    `;

    const params = status ? [inicio, fim, status] : [inicio, fim];
    
    const resultado = await pool.query(query, params);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ 
        mensagem: 'Nenhuma reserva encontrada para o critério selecionado.' 
      });
    }

    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro no relatório:', error);
    res.status(500).json({ erro: 'Erro ao gerar relatório.' });
  }
};

// 2. Reservas feitas para uma determinada mesa
export const relatorioPorMesa = async (req: Request, res: Response) => {
  const { numero } = req.params;

  try {
    const resultado = await pool.query(
      `SELECT * FROM reservas WHERE numero_mesa = $1`,
      [numero]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma reserva encontrada para essa mesa.' });
    }

    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao gerar relatório da mesa.' });
  }
};

// 3. Mesas confirmadas por garçom
export const relatorioPorGarcom = async (req: Request, res: Response) => {
  const { nome } = req.params;

  try {
    // Verifica se o garçom existe
    const garcomExiste = await pool.query(
      `SELECT * FROM garcons WHERE nome = $1`,
      [nome]
    );

    if (garcomExiste.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Garçom não encontrado.' });
    }

    // Busca reservas confirmadas pelo garçom
    const resultado = await pool.query(
      `SELECT r.* 
       FROM reservas r
       JOIN garcons g ON r.garcom_responsavel = g.nome
       WHERE g.nome = $1 AND r.status = 'confirmada'
       ORDER BY r.data DESC, r.hora DESC`,
      [nome]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Nenhuma mesa confirmada por esse garçom.' });
    }

    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro no relatório por garçom:', error);
    res.status(500).json({ erro: 'Erro ao gerar relatório do garçom.' });
  }
};

export const cadastrarGarcom = async (req: Request, res: Response) => {
  const { nome } = req.body;

  if (!nome || typeof nome !== 'string') {
    return res.status(400).json({ erro: 'Nome do garçom é obrigatório' });
  }

  try {
    // Verifica se já existe (case insensitive)
    const existe = await pool.query(
      'SELECT id FROM garcons WHERE LOWER(nome) = LOWER($1)', 
      [nome.trim()]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ erro: 'Garçom já cadastrado' });
    }

    // Cadastra novo garçom com ativo=true
    await pool.query(
      'INSERT INTO garcons (nome, ativo) VALUES ($1, true)',
      [nome.trim()]
    );

    res.status(201).json({ mensagem: 'Garçom cadastrado com sucesso' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ erro: 'Erro interno no servidor' });
  }
};

export const excluirGarcom = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Validação básica
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ erro: 'ID do garçom inválido' });
  }

  try {
    // Verifica se o garçom existe
    const garcom = await pool.query(
      'SELECT id FROM garcons WHERE id = $1',
      [id]
    );

    if (garcom.rows.length === 0) {
      return res.status(404).json({ erro: 'Garçom não encontrado' });
    }

    // Marca como inativo (exclusão lógica)
    await pool.query(
      'UPDATE garcons SET ativo = false WHERE id = $1',
      [id]
    );

    res.json({ mensagem: 'Garçom removido com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir garçom:', error);
    res.status(500).json({ 
      erro: 'Erro ao excluir garçom'
    });
  }
};

export const listarGarcons = async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, nome FROM garcons WHERE ativo = true ORDER BY nome'
    );

    console.log('Garçons encontrados:', result.rows);
    res.json(result.rows);

  } catch (error) {
    console.error('Erro ao listar:', error);
    res.status(500).json({ erro: 'Erro ao listar garçons' });
  }
};
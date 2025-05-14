import { Request, Response } from 'express';
import { pool } from '../database/db';

export const confirmarReserva = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome_garcom } = req.body;

  try {
    const resultado = await pool.query(
      `SELECT * FROM reservas WHERE id = $1 AND status = 'reservada'`,
      [id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ erro: 'Reserva não encontrada ou já confirmada/cancelada.' });
    }

    await pool.query(
      `UPDATE reservas 
       SET status = 'confirmada', garcom_responsavel = $1, mesa_ocupada = TRUE
       WHERE id = $2`,
      [nome_garcom, id]
    );

    res.json({ mensagem: 'Reserva confirmada com sucesso.' });
  } catch (error) {
    console.error('Erro ao confirmar reserva:', error);
    res.status(500).json({ erro: 'Erro ao confirmar reserva.' });
  }
};

export const liberarMesa = async (req: Request, res: Response) => {
  const { numero_mesa } = req.params;

  try {
    await pool.query(
      `UPDATE reservas 
       SET mesa_ocupada = FALSE
       WHERE numero_mesa = $1 AND mesa_ocupada = TRUE`,
      [numero_mesa]
    );

    res.json({ mensagem: 'Mesa liberada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao liberar mesa.' });
  }
};

export const getMesas = async (req: Request, res: Response) => {
  try {
    const resultado = await pool.query(
      `SELECT numero_mesa, mesa_ocupada 
       FROM reservas 
       WHERE numero_mesa BETWEEN 1 AND 20
       ORDER BY numero_mesa`
    );

    // Criar array com todas as mesas (1-20)
    const todasMesas = Array.from({ length: 20 }, (_, i) => i + 1).map(numero => {
      const mesa = resultado.rows.find(r => r.numero_mesa === numero);
      return {
        numero_mesa: numero,
        ocupada: mesa ? mesa.mesa_ocupada : false
      };
    });

    res.json(todasMesas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao obter status das mesas.' });
  }


};

export const cadastrarGarcom = async (req: Request, res: Response) => {
  const { nome } = req.body;

  try {
    // Verifica se o garçom já existe
    const existe = await pool.query(
      `SELECT * FROM garcons WHERE nome = $1`,
      [nome]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({ erro: 'Garçom já cadastrado.' });
    }

    // Cadastra novo garçom
    await pool.query(
      `INSERT INTO garcons (nome) VALUES ($1)`,
      [nome]
    );

    res.status(201).json({ mensagem: 'Garçom cadastrado com sucesso.' });
  } catch (error) {
    console.error('Erro ao cadastrar garçom:', error);
    res.status(500).json({ erro: 'Erro ao cadastrar garçom.' });
  }
};

export const listarGarcons = async (req: Request, res: Response) => {
  try {
    const resultado = await pool.query(
      `SELECT * FROM garcons WHERE ativo = TRUE ORDER BY nome`
    );
    res.json(resultado.rows);
  } catch (error) {
    console.error('Erro ao listar garçons:', error);
    res.status(500).json({ erro: 'Erro ao listar garçons.' });
  }
};
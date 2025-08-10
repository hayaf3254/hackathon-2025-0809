import 'dotenv/config';
import { Router, Request, Response } from 'express';
import { pool } from '../db';

const router = Router();

router.post('/save', async (req: Request, res: Response) =>  {
    try{
        const {user_id,sleeping_score,con_score,sleeping_time} = req.body;
            // 簡易チェック
    if (
      typeof user_id !== 'number' ||
      typeof sleeping_score !== 'number' ||
      typeof con_score !== 'number' ||
      typeof sleeping_time !== 'number'
    ) {
      return res.status(400).json({ error: 'invalid_payload' });
    }
    
    const query = `
      INSERT INTO records (user_id, sleeping_score, con_score, sleeping_time)
      VALUES ($1, $2, $3, $4)
      ;
    `;
    const values = [user_id, sleeping_score, con_score, sleeping_time];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Record inserted successfully',
    });



    }

    catch(e){
    console.error(e);
    res.status(500).json({ error: '保存できません' });
    }
});


router.post('/seven', async (req: Request, res: Response) => {
  try {
    const {user_id} = req.body;

    if (isNaN(user_id)) {
      return res.status(400).json({ error: 'invalid_user_id' });
    }

    const query = `
      SELECT *
      FROM records
      WHERE user_id = $1
      ORDER BY score_id DESC
      LIMIT 7;
    `;
    const result = await pool.query(query, [user_id]);

    res.json(result.rows);
  }
    catch(e){
    console.error(e);
    res.status(500).json({ error: 'getできません' });
    }
})

router.put('/edit', async (req: Request, res: Response) => {
    try{
    const score_id   = Number(req.body.score_id);
    const sleeping_score = Number(req.body.sleeping_score);
    const con_score   = Number(req.body.con_score);
    const sleeping_time  = Number(req.body.sleeping_time);

    // バリデーション
    if (!Number.isInteger(score_id)) {
      return res.status(400).json({ error: 'invalid_score_id' });
    }
    if (![sleeping_score, con_score, sleeping_time].every(v => Number.isFinite(v))) {
      return res.status(400).json({ error: 'invalid_payload' });
    }

    if (
      typeof score_id !== 'number' ||
      typeof sleeping_score !== 'number' ||
      typeof con_score !== 'number' ||
      typeof sleeping_time !== 'number'
    ) {
      return res.status(400).json({ error: 'invalid_payload' });
    }
    
    const query = `
    UPDATE records
    SET sleeping_score = $2,
    con_score = $3,
    sleeping_time = $4
    WHERE score_id = $1
    RETURNING *;
    `;
    const values = [score_id, sleeping_score, con_score, sleeping_time];
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'record_not_found' });
    }

    res.json({
      message: 'Record updated successfully',
      data: result.rows[0]
    });

    }
    catch(e){
    console.error(e);
    res.status(500).json({ error: '編集APIエラー' });
    }
})

export default router;
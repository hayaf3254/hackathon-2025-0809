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

export default router;
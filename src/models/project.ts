import { OkPacket, RowDataPacket } from "mysql2";
import { getDBConnection } from "../config/database";
import { Project } from '../interface/Interface';

export const getAllProject = async (): Promise<Project[]> => {
    const connection = await getDBConnection();
    const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM project');
    connection.release();
  
    if (result) {
      return result.map((row: RowDataPacket) => {
        return {
            id_project: row.id_project,
            name: row.name,
            label: row.label,
            type: row.type,
            journey: row.journey,
            s3_image_key: row.s3_image_key,
            s3_video_key: row.s3_video_key,
            date: row.s3_date_key,
            place: row.s3_place_key,
            credit: row.s3_credit_key,
            is_highlight: row.s3_is_highlight_key,
        } as Project;
      });
    } else {
      return [];
    }
};

export const getProjectHighlighted = async (): Promise<Project[]> => {
    const connection = await getDBConnection();
    const [result] = await connection.query<RowDataPacket[]>('SELECT * FROM project WHERE is_highlight = 1');
    connection.release();
    if (result) {
        return result.map((row: RowDataPacket) => {
          return {
              id_project: row.id_project,
              name: row.name,
              label: row.label,
              type: row.type,
              journey: row.journey,
              s3_image_key: row.s3_image_key,
              s3_video_key: row.s3_video_key,
              date: row.s3_date_key,
              place: row.s3_place_key,
              credit: row.s3_credit_key,
              is_highlight: row.s3_is_highlight_key,
          } as Project;
        });
      } else {
        return [];
    }
};

export const getProjectByLabel = async (label: string): Promise<Project[]> => {
    const connection = await getDBConnection();
    const sql = 'SELECT * FROM project WHERE label = ?';
    const [result] = await connection.query<RowDataPacket[]>(sql, [label]);
    connection.release();

    if (result) {
        return result.map((row: RowDataPacket) => {
          return {
              id_project: row.id_project,
              name: row.name,
              label: row.label,
              type: row.type,
              journey: row.journey,
              s3_image_key: row.s3_image_key,
              s3_video_key: row.s3_video_key,
              date: row.s3_date_key,
              place: row.s3_place_key,
              credit: row.s3_credit_key,
              is_highlight: row.s3_is_highlight_key,
          } as Project;
        });
      } else {
        return [];
    }
};

export const createProject = async (project: Project): Promise<Project | undefined> => {
    const {name, label, type, journey, s3_image_key, s3_video_key, date, place, credit, is_highlight} = project;
    const sql = 'INSERT INTO project (name, label, type, journey, s3_image_key, s3_video_key, date, place, credit, is_highlight) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const connection = await getDBConnection();
    const [result] = await connection.query<OkPacket>(sql, [name, label, type, journey, s3_image_key, s3_video_key, date, place, credit, is_highlight]);
    connection.release();

    if(result.affectedRows === 1) {
        return {
            id_project: result.insertId,
            name: name,
            label: label,
            type: type,
            journey: journey,
            s3_image_key: s3_image_key,
            s3_video_key: s3_video_key,
            date: date,
            place: place,
            credit: credit,
            is_highlight: is_highlight,
        } as Project;
    } else {
        return undefined
    }
};

export const getProjectPageByType = async (page: number, type: string): Promise<Project[]> => {
    const limit = 6;
    const offset = (page - 1) * limit;
    const sql = `SELECT * FROM project WHERE type_projet = ? LIMIT ?, ?`;
    const values = [type, offset, limit];
  
    const connection = await getDBConnection();
    const [result] = await connection.query<RowDataPacket[]>(sql, values);
    connection.release();

    if (result) {
        return result.map((row: RowDataPacket) => {
          return {
              id_project: row.id_project,
              name: row.name,
              label: row.label,
              type: row.type,
              journey: row.journey,
              s3_image_key: row.s3_image_key,
              s3_video_key: row.s3_video_key,
              date: row.s3_date_key,
              place: row.s3_place_key,
              credit: row.s3_credit_key,
              is_highlight: row.s3_is_highlight_key,
          } as Project;
        });
      } else {
        return [];
    }
};

export const updateProjectById = async (id: number, newAttributes: Project) => {
    const { name, label, type, journey, s3_image_key, s3_video_key, date, place, credit, is_highlight } = newAttributes;
    
    const connection = await getDBConnection();
    const sql = `UPDATE project SET name=?, label=?, type=?, journey=?, s3_image_key=?, s3_video_key=?, date=?, place=?, credit=?, is_highlight=? WHERE id_project = ?`;
    await connection.query(sql, [name, label, type, journey, s3_image_key, s3_video_key, date, place, credit, is_highlight, id]);
    connection.release();

};

export const getProjectById = async (id: number): Promise<Project[]> => {
    const sql = 'SELECT * FROM project WHERE id_project = ?';
    const connection = await getDBConnection();
    const [result] = await connection.query<RowDataPacket[]>(sql, [id]);
    connection.release();

    if (result) {
        return result[0] as Project[];
    } else {
        return [];
    }
};

export const deleteProjectById = async (id: number): Promise<boolean> => {
    try {
      const connection = await getDBConnection();
      const [result] = await connection.query<OkPacket>('DELETE FROM project WHERE id_project = ?', [id]);
      connection.release();
      return result.affectedRows !== 0;
    } catch (error) {
      console.error('Erreur lors de la requête: ', error);
      throw error;
    }
};

import { Pool } from "pg";

export class PlaylistSongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsFromPlaylist(credentialId,playlistId) {
    const query = {
      text: `
      SELECT
        p.id AS playlist_id,
        p.name,
        s.id AS song_id,
        s.title,
        s.performer
      FROM playlists p
      JOIN users u ON p.owner = u.id
      LEFT JOIN playlist_songs ps ON p.id = ps.playlist_id
      LEFT JOIN songs s ON ps.song_id = s.id
      WHERE
        p.id = $1
        AND (
          p.owner = $2
          OR EXISTS (
            SELECT 1
            FROM collaborations c
            WHERE c.playlist_id = p.id AND c.user_id = $2
          )
        )
    `,
      values: [playlistId, credentialId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal diambil dari playlist");
    }

    const playlistDetails = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].name,
      username: result.rows[0].username,
    };

    const songs = result.rows
      .filter((row) => row.song_id !== null)
      .map((row) => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      }));

    const finalResult = {
      ...playlistDetails,
      songs,
    };
    return finalResult;
  }
}

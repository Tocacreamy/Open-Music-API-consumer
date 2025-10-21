export class Listener {
  constructor(playlistSongsService, mailSender) {
    this._playlistSongsService = playlistSongsService;
    this._mailSender = mailSender;
  }

  listen = async (message) => {
    try {
      const { credentialId, playlistId, targetEmail } = JSON.parse(
        message.content.toString()
      );
      const songs = await this._playlistSongsService.getSongsFromPlaylist(
        credentialId,
        playlistId
      );
      const result = await this._mailSender.sendMail(
        targetEmail,
        JSON.stringify(songs)
      );
      console.log("Mail sent:", result);
    } catch (error) {
      console.error("Listener error:", error);
    }
  };
}

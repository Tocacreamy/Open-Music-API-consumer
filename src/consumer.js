import "dotenv/config";
import amqplib from "amqplib";
import { MailSender } from "./MailSender.js";
import { PlaylistSongsService } from "./PlaylistSongsService.js";
import { Listener } from "./listener.js";

const init = async () => {
  const playlistSongsService = new PlaylistSongsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistSongsService, mailSender);

  const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  await channel.assertQueue('export:playlist:songs', { durable: true });
  channel.consume('export:playlist:songs', listener.listen, { noAck: true });
};

init();


import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

const apiId = 39457043;
const apiHash = "b9e31903abb22fd13abb1f74a61454";

const stringSession = new StringSession(process.env.SESSION || "");

const sourceGroup = -1002343623424;
const targetGroup = -1003797671450;

const client = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

(async () => {
  console.log("Starting Userbot...");

  await client.start({
    phoneNumber: async () => process.env.PHONE,
    password: async () => process.env.PASSWORD || "",
    phoneCode: async () => process.env.OTP,
    onError: (err) => console.log(err),
  });

  console.log("Userbot connected!");
  console.log("Session String:");
  console.log(client.session.save());

  client.addEventHandler(async (event) => {
    if (event.chatId?.toString() === sourceGroup.toString()) {
      try {
        await client.forwardMessages(targetGroup, {
          messages: event.message.id,
          fromPeer: sourceGroup,
        });
        console.log("Message forwarded!");
      } catch (err) {
        console.log("Forward Error:", err);
      }
    }
  });
})();

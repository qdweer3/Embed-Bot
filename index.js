const express = require("express");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Oh hey, what are you doing here? "));

app.listen(port, () =>
  console.log(`Embed Bot listening at http://localhost:${port}`)
);

// ================= START BOT CODE =================== //

const Discord = require("discord.js");
const client = new Discord.Client();
const DBL = require("dblapi.js");
const dbl = new DBL(process.env.DBL_TOKEN, client);

const emitError = (error) => client.emit("error", error);

client.on("error", async (error) => {
  (await client.channels.fetch(process.env.ERROR_CHANNEL)).send(
    `\`\`\`js\n${error}\`\`\``
  );
  console.error(error);
});

client.once("ready", () => {
  console.log("Embed Bot is online!");
  client.user.setActivity("@Mention for cmds!", { type: "WATCHING" });

  setInterval(() => {
    const fetch = require("node-fetch");
    fetch(`https://discord.bots.gg/api/v1/bots/${client.user.id}/stats`, {
      method: "POST",
      headers: {
        Authorization: process.env.DISCORD_BOTS_GG_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ guildCount: client.guilds.cache.size }),
    });
  }, 60000);
});

client.on("message", (message) => {
  if (
    message.content == `<@${client.user.id}>` ||
    message.content == `<@!${client.user.id}>`
  ) {
    const Embed = new Discord.MessageEmbed()
      .setTitle("Commands")
      .setDescription(
        "`/embed` - Allows you to create an embed!\n`/invite` - Invite Embed Bot to your own server!\n`/vote` - Vote for Embed Bot on top.gg!\n`/support` - Get an invite to the support server."
      )
      .setFooter(
        "Made with discord.js and ❤️ by Liam The Protogen#2501",
        "https://avatars0.githubusercontent.com/u/26492485"
      )
      .setColor(Discord.Constants.Colors.BLURPLE);
    message.channel.send(Embed);
  }
});

const registerCommand = (data) => {
  client.api
    .applications(process.env.CLIENT_ID || client.user.id)
    .commands.post({ data });
};

registerCommand({
  name: "embed",
  description: "Allows you to create an embed!",
  options: [
    {
      name: "title",
      description: "The title of your embed.",
      type: 3,
    },
    {
      name: "description",
      description: "The description of your embed.",
      type: 3,
    },
    {
      name: "url",
      description: "The url of your embed.",
      type: 3,
    },
    {
      name: "color",
      description: "The color of your embed.",
      type: 3,
    },
    {
      name: "footer",
      description: "The footer of your embed.",
      type: 3,
    },
    {
      name: "image",
      description: "The image of your embed.",
      type: 3,
    },
    {
      name: "thumbnail",
      description: "The thumbnail of your embed.",
      type: 3,
    },
  ],
});
registerCommand({
  name: "invite",
  description: "Invite Embed Bot to your own server!",
});
registerCommand({
  name: "vote",
  description: "Vote for Embed Bot on top.gg!",
});
registerCommand({
  name: "support",
  description: "Get an invite to the support server.",
});

client.ws.on("INTERACTION_CREATE", async (interaction) => {
  const interact = (data) =>
    client.api.interactions(interaction.id, interaction.token).callback.post({
      data,
    });

  process.on("unhandledRejection", async (error) => {
    console.error(error);
    if (error.name == "DiscordAPIError") {
      try {
        (await client.channels.fetch(interaction.channel_id)).send(
          new Discord.MessageEmbed({
            title: "An error has occured!",
            description:
              "Hmm... It seems there was a problem with the parameters you gave.\n\nIf this message was *not* the result of invalid parameters, don't worry, the error has been automatically logged. We'll work on fixing this as soon as we see it.",
            thumbnail: {
              url: "https://i.imgur.com/J4jZEVD.png",
            },
            color: Discord.Constants.Colors.RED,
          })
        );
      } catch {}
    }
  });

  (await client.channels.fetch(process.env.LOG_CHANNEL)).send(
    `${(await client.users.fetch(interaction.member.user.id)).tag} (${
      interaction.member.user.id
    }) triggered the "${interaction.data.name}" (${
      interaction.data.id
    }) command.`
  );

  try {
    switch (interaction.data.name) {
      case "embed":
        if (!interaction.data.options)
          return interact({
            type: 4,
            data: {
              content: "Please specify at least one argument!",
            },
          });
        interact({
          type: 3,
          data: {
            content: "",
            embeds: [
              {
                author: {
                  name: `${interaction.member.user.username}#${interaction.member.user.discriminator}`,
                  icon_url: (
                    await client.users.fetch(interaction.member.user.id)
                  ).avatarURL(),
                },
                title:
                  interaction.data.options.find(
                    (option) => option.name == "title"
                  ) &&
                  interaction.data.options.find(
                    (option) => option.name == "title"
                  ).value,
                description:
                  interaction.data.options.find(
                    (option) => option.name == "description"
                  ) &&
                  interaction.data.options.find(
                    (option) => option.name == "description"
                  ).value,
                url: interaction.data.options.find(
                  (option) => option.name == "url"
                )
                  ? interaction.data.options
                      .find((option) => option.name == "url")
                      .value.startsWith("https") ||
                    interaction.data.options
                      .find((option) => option.name == "url")
                      .value.startsWith("http")
                    ? interaction.data.options.find(
                        (option) => option.name == "url"
                      ).value
                    : "https://top.gg/bot/790256560898048011"
                  : undefined,
                color:
                  interaction.data.options.find(
                    (option) => option.name == "color"
                  ) &&
                  (Discord.Constants.Colors[
                    (
                      await interaction.data.options.find(
                        (option) => option.name == "color"
                      ).value
                    )
                      .toUpperCase()
                      .replace(/ /g, "_")
                  ] ||
                    parseInt(
                      (
                        await interaction.data.options.find(
                          (option) => option.name == "color"
                        ).value
                      ).replace("#", ""),
                      16
                    )),
                footer: {
                  text:
                    interaction.data.options.find(
                      (option) => option.name == "footer"
                    ) &&
                    interaction.data.options.find(
                      (option) => option.name == "footer"
                    ).value,
                },
                image: {
                  url: interaction.data.options.find(
                    (option) => option.name == "image"
                  )
                    ? interaction.data.options
                        .find((option) => option.name == "image")
                        .value.startsWith("https") ||
                      interaction.data.options
                        .find((option) => option.name == "image")
                        .value.startsWith("http")
                      ? interaction.data.options.find(
                          (option) => option.name == "image"
                        ).value
                      : "https://i.imgur.com/gE5phvW.png"
                    : undefined,
                },
                thumbnail: {
                  url: interaction.data.options.find(
                    (option) => option.name == "thumbnail"
                  )
                    ? interaction.data.options
                        .find((option) => option.name == "thumbnail")
                        .value.startsWith("https") ||
                      interaction.data.options
                        .find((option) => option.name == "thumbnail")
                        .value.startsWith("http")
                      ? interaction.data.options.find(
                          (option) => option.name == "thumbnail"
                        ).value
                      : "https://i.imgur.com/gE5phvW.png"
                    : undefined,
                },
              },
            ],
          },
        });
        break;
      case "invite":
        interact({
          type: 4,
          data: {
            content: "",
            embeds: [
              {
                title: "Invite Embed Bot",
                description:
                  "[Click here](https://top.gg/bot/790256560898048011/invite) to invite Embed Bot to your own server!",
                thumbnail: { url: client.user.avatarURL() },
                color: Discord.Constants.Colors.BLURPLE,
              },
            ],
          },
        });
        break;
      case "vote":
        interact({
          type: 4,
          data: {
            content: "",
            embeds: [
              {
                title: "Vote for Embed Bot",
                description:
                  "[Click here](https://top.gg/bot/790256560898048011/vote) to vote for Embed Bot on top.gg!",
                image: { url: "https://i.imgur.com/oqfQ7p9.png" },
                color: Discord.Constants.Colors.BLURPLE,
              },
            ],
          },
        });
        break;
      case "support":
        interact({
          type: 4,
          data: {
            content: "",
            embeds: [
              {
                title: "Join the Support Server",
                description:
                  "[Click here](https://discord.gg/fssWDHY5Kb) to join the support server!",
                color: Discord.Constants.Colors.BLURPLE,
              },
            ],
          },
        });
        break;
    }

    (await client.channels.fetch(process.env.LOG_CHANNEL)).send(
      `"${interaction.data.name}" (${interaction.data.id}) command ran succesfully.`
    );
  } catch (error) {
    emitError(error);

    (await client.channels.fetch(process.env.LOG_CHANNEL)).send(
      `"${interaction.data.name}" (${interaction.data.id}) command ran unsuccesfully. Check <#${process.env.ERROR_CHANNEL}> for more info.`
    );

    interact({
      type: 4,
      data: {
        content: "",
        embeds: [
          {
            title: "An error has occured!",
            description:
              "We're so sorry for the inconvenience!\n\nThe error has been automatically logged, so we'll start working on fixing this as soon as we see the message.",
            thumbnail: {
              url: "https://i.imgur.com/J4jZEVD.png",
            },
            color: Discord.Constants.Colors.RED,
          },
        ],
      },
    });
  }
});

client.login(process.env.DISCORD_TOKEN);

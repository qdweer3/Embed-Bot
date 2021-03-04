# Embed-Bot
A bot to create embeds for you using Discord's new slash commands

## How can I run this myself?
Firstly, create a file in the root directory of the project titled `.env`.

Subsequently, you must fill in the file with the necessary environmental variables:

`DISCORD_TOKEN` - The token of your Discord bot, found at [discord.com/developers](https://discord.com/developers).

`CLIENT_ID` - The ID of the application, also found at [discord.com/developers](https://discord.com/developers).

`ERROR_CHANNEL` (Optional) - The ID of the channel you want Embed Bot to report to when encountering an error.

`LOG_CHANNEL` (Optional) - The ID of the channel you want Embed Bot to report to when a user interacts with it.

The end result should look similair to this:

```
DISCORD_TOKEN=AbcdEfG1HIJk2Lm3NOP4QRSt.A123bc.abcdeFg1HIjK2LMnO3PqrstUVwx
CLIENT_ID=123456789012345678
ERROR_CHANNEL=123456789012345678
LOG_CHANNEL=123456789012345678
```
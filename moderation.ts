import { Client, GuildTextBasedChannel, Message } from 'npm:discord.js'
import { getTrust, TrustLevel } from './trust.ts'
import { GUILD_ID, MOD_CHANNEL_ID } from './env.ts'

export async function getModChannel(client: Client): Promise<GuildTextBasedChannel> {
	const guild = await client.guilds.fetch(GUILD_ID)
	const channel = (await guild.channels.fetch(MOD_CHANNEL_ID)) as GuildTextBasedChannel

	if (!channel) throw new Error('Could not get mod guild channel!')

	return channel
}

export async function moderateMessage(client: Client, message: Message): Promise<boolean> {
	const userTrust = getTrust(message.author)

	const containsLink = message.content.includes('http://') || message.content.includes('https://')

	if (containsLink && userTrust === TrustLevel.None) {
		await message.delete()

		try {
			await message.author.send(
				"Hello, I'm from the bridge. discord server and my job is to help protect you from bots and scams. It looks like you tried sending a message with a link, however you have not been active enough in the server yet to gain enough trust. I have removed your message and notified the moderation team. If this was an accident, do not worry. Our team will decide if any action is necessary."
			)
		} catch {
			await message.reply(
				'Hello, It looks like you tried sending a message with a link, however you have not been active enough in the server yet to gain enough trust. I have removed your message and notified the moderation team. If this was an accident, do not worry. Our team will decide if any action is necessary.'
			)
		}

		const modChannel = await getModChannel(client)
		await modChannel.send(`User <@${message.author.id}> attempted to send a message containing a link.\n\n${message.content.slice(0, 400)}`)

		return true
	}

	return false
}

import { Client, GatewayIntentBits } from 'npm:discord.js'
import { TOKEN } from './env.ts'
import { updateTrust } from './trust.ts'
import { moderateMessage } from './moderation.ts'

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.DirectMessages],
})

client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`)

	// portTrust(client)
})

client.on('messageCreate', async message => {
	try {
		if (!message.inGuild) return

		if (await moderateMessage(client, message)) return

		updateTrust(message.author, 1)
	} catch (error) {
		console.warn(`Error on message create!`)
		console.error(error)
	}
})

client.login(TOKEN)

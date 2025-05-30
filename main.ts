import { Client, GatewayIntentBits } from 'npm:discord.js'
import { CLIENT_ID, TOKEN } from './env.ts'
import { getTrust, portTrust, updateTrust } from './trust.ts'
import { moderateMessage } from './moderation.ts'

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
    ],
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.tag}!`)

    // portTrust(client)
})

client.on('messageCreate', async message => {
    if (!message.inGuild) return

    if (await moderateMessage(client, message)) return

    updateTrust(message.author, 1)
})

client.login(TOKEN)

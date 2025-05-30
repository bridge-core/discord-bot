export const TOKEN: string = Deno.env.get('TOKEN')!
export const CLIENT_ID: string = Deno.env.get('CLIENT_ID')!
export const GUILD_ID: string = Deno.env.get('GUILD_ID')!
export const MOD_CHANNEL_ID: string = Deno.env.get('MOD_CHANNEL_ID')!

if (!TOKEN) throw new Error('TOKEN is not provided in the .env file!')
if (!CLIENT_ID) throw new Error('CLIENT_ID is not provided in the .env file!')
if (!GUILD_ID) throw new Error('GUILD_ID is not provided in the .env file!')
if (!MOD_CHANNEL_ID) throw new Error('MOD_CHANNEL_ID is not provided in the .env file!')

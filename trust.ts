import { existsSync } from 'jsr:@std/fs/exists'
import { Client, User } from 'npm:discord.js'
import { GUILD_ID } from './env.ts'

const lowTrustThreshold = 5
const mediumTrustThreshold = 20
const highTrustThreshold = 100

export enum TrustLevel {
    None = 'none',
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

type UserData = {
    trust: TrustLevel
    trustProgress: number
}

const trustDbPath = 'trust.db.json'

if (!existsSync(trustDbPath)) Deno.writeTextFileSync(trustDbPath, '{}')
const data: Record<string, UserData> = JSON.parse(Deno.readTextFileSync(trustDbPath))
let dataUpdateRequested: boolean = false

export function getTrust(user: User): TrustLevel {
    const userData: undefined | UserData = data[user.id]

    if (!userData) return TrustLevel.None

    return data[user.id].trust
}

export function updateTrust(user: User, amount: number) {
    if (!data[user.id]) {
        data[user.id] = {
            trust: TrustLevel.None,
            trustProgress: amount,
        }
    } else {
        data[user.id].trustProgress += amount
    }

    if (data[user.id].trustProgress >= lowTrustThreshold && data[user.id].trust === TrustLevel.None) {
        data[user.id].trust = TrustLevel.Low

        user.send('Thank you for being active in the bridge. server! Your trust level has been increased.')
    }

    if (data[user.id].trustProgress >= mediumTrustThreshold && data[user.id].trust === TrustLevel.Low) {
        data[user.id].trust = TrustLevel.Medium
        user.send('Thank you for being active in the bridge. server! Your trust level has been increased. You may now send links.')
    }

    if (data[user.id].trustProgress >= highTrustThreshold && data[user.id].trust === TrustLevel.Medium) {
        data[user.id].trust = TrustLevel.High
        user.send('Thank you for being active in the bridge. server! Your trust level has been increased.')
    }

    requestDataUpdate()
}

export async function portTrust(client: Client) {
    console.log('Porting trust!')

    const guild = await client.guilds.fetch(GUILD_ID)
    for (const [id, member] of guild.members.cache) {
        data[id] = {
            trust: TrustLevel.Medium,
            trustProgress: mediumTrustThreshold,
        }

        if (
            member.roles.cache.has('668543369110224904') ||
            member.roles.cache.has('602097954282668032') ||
            member.roles.cache.has('670384124615196674') ||
            member.roles.cache.has('602098047769378846')
        ) {
            data[id] = {
                trust: TrustLevel.High,
                trustProgress: highTrustThreshold,
            }

            console.log(`High trust member ${member.displayName}`)
        }
    }

    requestDataUpdate()
}

function requestDataUpdate() {
    dataUpdateRequested = true
}

async function updateLoop() {
    while (true) {
        await new Promise(res => setTimeout(res, 1000))

        if (dataUpdateRequested) {
            console.log('Updated data!')

            await Deno.writeTextFile(trustDbPath, JSON.stringify(data))

            dataUpdateRequested = false
        }
    }
}

updateLoop()

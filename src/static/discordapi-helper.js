export function parsePermissionsInGuild(guild) {
    const administrator = guild.owner || (guild.permissions_new & (1 << 3)) != 0

    return {
        ADMINISTRATOR: administrator,
        MANAGE_GUILD: (guild.permissions_new & (1 << 5)) != 0 || administrator,
        MANAGE_MESSAGES: (guild.permissions_new & (1 << 13)) != 0 || administrator,

        MODERATE_MEMBERS: (guild.permissions_new & (1 << 40)) != 0 || administrator,
        KICK_MEMBERS: (guild.permissions_new & (1 << 1)) != 0 || administrator,
        BAN_MEMBERS: (guild.permissions_new & (1 << 2)) != 0 || administrator,
    }
}

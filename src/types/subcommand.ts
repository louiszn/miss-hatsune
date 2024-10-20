import type { PermissionResolvable } from "discord.js";

export interface SubcommandData {
    name: string;
    target: string;
    permissions?: PermissionResolvable;
}

export interface SubcommandGroupData {
    name: string;
    subcommands: SubcommandData[];
}

export type Subcommand = SubcommandData | SubcommandGroupData;

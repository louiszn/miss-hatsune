export interface SubcommandData {
    name: string;
    target: string;
}

export interface SubcommandGroupData {
    name: string;
    subcommands: SubcommandData[];
}

export type Subcommand = SubcommandData | SubcommandGroupData;

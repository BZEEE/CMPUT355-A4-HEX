

export interface ICommand {
    execute(): void;
    unexecute(): void;
    isReversible(): boolean;
}
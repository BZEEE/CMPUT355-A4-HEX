import { ICommand } from './ICommand';


export class MoveManager {
    // class is a singleton that also helps facilitate the command pattern
    // used undo/redo actions and behaviour,
    // we will use the Move Manager to help undo/redo moves the game board (hex board)
    private static singleton: MoveManager = null;
    private historyList: ICommand[];
    private redoList: ICommand[];

    private constructor() {
        // private constructor for singleton
        this.historyList = []
        this. redoList = []
    }

    public static getInstance() {
        if (this.singleton == null) {
            this.singleton = new MoveManager();
        }
        return this.singleton
    }

    // invoke a command and add it to history list
    public invokeCommand(command: ICommand ): void {
        command.execute();
        if (command.isReversible()) {
            this.historyList.push( command );
        } else {
            this.historyList = []
        }
        if (this.redoList.length > 0) {
            this.redoList = []
        }
    }
   

    public undo(): void {
        if (this.historyList.length > 0) {
            let command: ICommand = this.historyList.pop()
            command.unexecute();
            this.redoList.push( command );
        }
    }
    public redo(): void {
        if (this.redoList.length > 0) {
            let command: ICommand = this.redoList.pop();
            command.execute();
            this.historyList.push( command );
        }
    }
}
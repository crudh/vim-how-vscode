import { commands, window, ExtensionContext, QuickPickItem } from "vscode";
import { categories } from "./categories";
import { Command } from "./commands";
import { searchCommands } from "./search";

type CommandItem = QuickPickItem & Pick<Command, "id">;

const itemFromCommand = (command: Command): CommandItem => ({
  label: command.title,
  description: `${command.usesMeta ? "CTRL + " : ""}${command.keys}`,
  detail: `[${categories[command.categoryId].name}] ${
    command.description ?? ""
  }`,
  id: command.id,
});

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand("vim-how.search", () => {
      const quickPick = window.createQuickPick<CommandItem>();
      quickPick.placeholder = "Search for a command";
      quickPick.title = "Vim command search";
      quickPick.matchOnDescription = true;
      quickPick.matchOnDetail = true;

      quickPick.onDidChangeValue((value) => {
        quickPick.items = searchCommands(value).map(itemFromCommand);
      });

      quickPick.onDidChangeSelection((selection) => {
        const selected = selection[0];
        if (!selected) {
          return;
        }

        window.showInformationMessage(
          `${selected.label}: ${selected.description}`
        );
        quickPick.hide();
      });

      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    })
  );
}

export function deactivate() {}

import * as vscode from "vscode";
import { ClipboardManager } from "./clipboardManager";

let clipboardManager: ClipboardManager;

export async function activate(context: vscode.ExtensionContext) {
  console.log("MultiClipboard activated");

  clipboardManager = new ClipboardManager(context);

  const showHistoryCommand = vscode.commands.registerCommand(
    "multiclipboard.showHistory",
    async () => {
      const items = clipboardManager.getHistory();
      if (items.length === 0) {
        vscode.window.showInformationMessage("Clipboard history is empty");
        return;
      }

      const now = new Date();

      const selected = await vscode.window.showQuickPick(
        items.map((item, index) => {
          const date = new Date(item.timestamp);

          const isToday =
            date.getFullYear() === now.getFullYear() &&
            date.getMonth() === now.getMonth() &&
            date.getDate() === now.getDate();

          const timePart = date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          });

          const fullDateTime = date.toLocaleString("ru-RU", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          });

          const description = isToday ? timePart : fullDateTime;

          return {
            label: "",
            description,
            detail: item.text,
            index,
          };
        }),
        {
          placeHolder: "Select an item to paste",
          matchOnDetail: true,
        }
      );

      if (selected) {
        await clipboardManager.paste(selected.index);
      }
    }
  );

  context.subscriptions.push(showHistoryCommand);

  await clipboardManager.startMonitoring();
}

export function deactivate() {
  clipboardManager?.stopMonitoring();
}

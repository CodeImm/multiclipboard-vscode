import * as vscode from "vscode";

export interface ClipboardItem {
  text: string;
  timestamp: string;
}

export class ClipboardManager {
  private history: ClipboardItem[] = [];
  private readonly maxHistorySize = 100;
  private monitoringTimer?: NodeJS.Timeout;
  private lastClipboardText = "";
  private isChecking = false;

  constructor(private readonly context: vscode.ExtensionContext) {
    this.loadHistory();
  }

  private async initClipboard(): Promise<void> {
    try {
      this.lastClipboardText = await vscode.env.clipboard.readText();
    } catch (e) {
      console.error("Clipboard init error:", e);
    }
  }

  public async startMonitoring(): Promise<void> {
    if (this.monitoringTimer) return;

    await this.initClipboard();

    this.monitoringTimer = setInterval(async () => {
      if (this.isChecking) return;
      this.isChecking = true;

      try {
        const current = await vscode.env.clipboard.readText();

        if (current && current !== this.lastClipboardText && current.trim()) {
          this.addToHistory(current);
          this.lastClipboardText = current;
        }
      } catch (e) {
        console.error("Clipboard monitoring error:", e);
      } finally {
        this.isChecking = false;
      }
    }, 300);

    this.context.subscriptions.push({
      dispose: () => this.stopMonitoring(),
    });
  }

  public stopMonitoring(): void {
    if (this.monitoringTimer) {
      clearInterval(this.monitoringTimer);
      this.monitoringTimer = undefined;
    }
  }

  private addToHistory(text: string): void {
    if (this.history.length && this.history[0].text === text) return;

    this.history.unshift({
      text,
      timestamp: new Date().toISOString(),
    });

    if (this.history.length > this.maxHistorySize) {
      this.history.length = this.maxHistorySize;
    }

    this.saveHistory();
  }

  public getHistory(): readonly ClipboardItem[] {
    return this.history;
  }

  public async paste(index: number): Promise<void> {
    if (index < 0 || index >= this.history.length) {
      return;
    }

    const item = this.history[index];

    await vscode.env.clipboard.writeText(item.text);

    await vscode.commands.executeCommand("editor.action.clipboardPasteAction");

    const [removed] = this.history.splice(index, 1);
    this.history.unshift(removed);
    this.saveHistory();
  }

  private saveHistory(): void {
    this.context.globalState.update("clipboardHistory", this.history);
  }

  private loadHistory(): void {
    const saved =
      this.context.globalState.get<ClipboardItem[]>("clipboardHistory");
    if (saved) {
      this.history = saved;
    }
  }
}

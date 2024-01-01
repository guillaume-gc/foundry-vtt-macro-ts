declare class TextEditor {
  static enrichHTML(content: string, options: { async: false }): string
  static enrichHTML(content: string, options?: { async: true }): Promise<string>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare class TextEditor {
  static enrichHTML(content: string, options: { async: false }): string
  static enrichHTML(content: string, options?: { async: true }): Promise<string>
}

import { FoundryVTT } from '../type/foundryVtt.type'

declare global {
  const canvas: FoundryVTT.Canvas
  const ui: FoundryVTT.UserInterface
  const game: FoundryVTT.Game

  class Dialog {
    constructor(options: FoundryVTT.DialogOptions)
    render(flag: boolean): void
  }

  class ChatMessage {
    static applyRollMode(
      options: FoundryVTT.RollModeOptions,
      gameString: string,
    ): Foundry.RollMode
    static getSpeaker(
      options: FoundryVTT.GetSpeakerOptions,
    ): FoundryVTT.ChatSpeaker
    static create(rollMode: RollMode)
  }
}

export {}

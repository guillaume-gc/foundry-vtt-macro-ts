import {
  Canvas,
  ChatSpeaker,
  DialogOptions,
  Game,
  GetSpeakerOptions,
  RollMode,
  RollModeOptions,
  UserInterface,
} from '../../type/foundryVTT/core/core.type'

declare global {
  const canvas: Canvas<'PF1'>
  const ui: UserInterface
  const game: Game

  class Dialog {
    constructor(options: DialogOptions)
    render(flag: boolean): void
  }

  class ChatMessage {
    static applyRollMode(options: RollModeOptions, gameString: string): RollMode
    static getSpeaker(options: GetSpeakerOptions): ChatSpeaker
    static create(rollMode: RollMode)
  }
}

export {}

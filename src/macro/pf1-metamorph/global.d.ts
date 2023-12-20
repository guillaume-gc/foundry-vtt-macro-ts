import {
  Canvas,
  ChatSpeaker,
  DialogOptions,
  Game,
  GetSpeakerOptions,
  RollMode,
  RollModeOptions,
  UserInterface,
} from '../../type/foundry/foundry'

declare global {
  const canvas: Canvas<'PF1'>
  const ui: UserInterface
  const game: Game<'PF1'>

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

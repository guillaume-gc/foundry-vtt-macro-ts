import {
  Canvas,
  ChatSpeaker,
  DialogOptions,
  Game,
  GetSpeakerOptions,
  RollMode,
  RollModeOptions,
  UserInterface,
} from './type/foundry/foundry'
import { PF1Utils } from './type/foundry/system/pf1/utils'

declare global {
  const canvas: Canvas<'PF1'>
  const ui: UserInterface
  const game: Game<'PF1'>
  const pf1: {
    utils: PF1Utils
  }

  class Dialog {
    constructor(options: DialogOptions)
    render(
      force?: boolean,
      options?: {
        left: number
        top: number
        width: number
        height: number
        scale: number
        focus: boolean
        renderContext: string
        renderData: any
      },
    ): void
  }

  class ChatMessage {
    static applyRollMode(options: RollModeOptions, gameString: string): RollMode
    static getSpeaker(options: GetSpeakerOptions): ChatSpeaker
    static create(rollMode: RollMode): void
  }
}

export {}

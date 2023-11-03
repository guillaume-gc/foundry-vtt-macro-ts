import { FoundryVTT } from '../../../type/foundryVtt.type'
import { getCombatDefensesTable, getSocialDefensesTable } from './html'

import ActorPF = FoundryVTT.ActorPF

const renderChatMessage = (chatMessage: string): void => {
  const chatMessageData = ChatMessage.applyRollMode(
    {
      content: chatMessage,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ user: game.user }),
      type: FoundryVTT.ChatMessageType.OTHER,
    },
    game.settings.get('core', 'rollMode'),
  )
  ChatMessage.create(chatMessageData)
}

export const renderSocialDefenses = (actors: ActorPF[]) => {
  const chatMessage = getSocialDefensesTable(actors)

  renderChatMessage(chatMessage)
}

export const renderCombatDefenses = (actors: ActorPF[]) => {
  const chatMessage = getCombatDefensesTable(actors)

  renderChatMessage(chatMessage)
}

export const renderAll = (actors: ActorPF[]) => {
  const socialDefenses = getSocialDefensesTable(actors)
  const combatDefenses = getCombatDefensesTable(actors)

  const chatMessage = socialDefenses + combatDefenses

  renderChatMessage(chatMessage)
}

import { ChatMessageType } from '../../type/foundryVTT/core/core.type'
import { ActorPF } from '../../type/foundryVTT/system/pf1e.type'
import { getCombatDefensesTable, getSocialDefensesTable } from './html'

const renderChatMessage = (chatMessage: string): void => {
  const chatMessageData = ChatMessage.applyRollMode(
    {
      content: chatMessage,
      user: game.user._id,
      speaker: ChatMessage.getSpeaker({ user: game.user }),
      type: ChatMessageType.OTHER,
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

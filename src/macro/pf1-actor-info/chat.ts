import { ChatMessageType } from '../../type/foundry/foundry'
import { ActorPF } from '../../type/foundry/system/pf1/documents/actor/actor-pf'
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

import { translatePf1 } from '../../common/lang/pf1/fr'
import { ActorPF } from '../../type/foundry/system/pf1e'
import { cellStyle } from './config'

export interface RowData {
  label: string
  value: number | string
}

const getTable = (header: string, rows: string[]) =>
  `
    <table>
      <thead>
        ${header}
      </thead>
      <tbody>
        ${rows.join('')}
      </tbody>
    </table>
  `

const getTableSubRows = (rowsData: RowData[]) => {
  const dipRows = rowsData.map(({ label, value }) => {
    return `
        <tr>
          <td style='${cellStyle}'>
            ${label}
          </td>
          <td style='${cellStyle}'>
            ${value}
          </td>
        </tr>
      `
  })

  return dipRows.join('')
}

export const getInitialMsg = (actors: ActorPF[]) => {
  if (actors.length === 1) {
    return `<a>Acteur selectionné : <strong>${actors[0].name}</strong>`
  }

  return `<a>Acteurs selectionnés : <strong>${actors
    .map((o) => o.name)
    .join('</strong>, <strong>')}</strong></a>`
}

export const getDemoralizeTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="2">Démoraliser (Intimidation)</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>DD</td>
  `
  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const dc = 10 + rollData.attributes.hd.total + rollData.abilities.wis.mod

    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${dc}</td>
      </tr>`
  })

  return getTable(header, rows)
}

const getDiplomacyTable = (actors: ActorPF[]): string => {
  const header = `
    <tr>
      <td colSpan='3'>Diplomacie</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Attitude initial</td>
    <td style='${cellStyle}'>DD</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const rowsData = [
      { label: 'Hostile', value: 25 + rollData.abilities.cha.mod },
      { label: 'Inamical', value: 20 + rollData.abilities.cha.mod },
      { label: 'Indifférent', value: 15 + rollData.abilities.cha.mod },
      { label: 'Amical', value: 10 + rollData.abilities.cha.mod },
      { label: 'Serviable', value: rollData.abilities.cha.mod },
    ]

    const actorRow = `<td rowspan='8'>${actor.name}</td>`

    const dipRows = getTableSubRows(rowsData)

    return `
      <tr>${actorRow}</tr>
      <tr>${dipRows}</tr>
    `
  })

  return getTable(header, rows)
}

export const getSocialDefensesTable = (actors: ActorPF[]) => {
  const demoralizeTable = getDemoralizeTable(actors)
  const diplomacyTable = getDiplomacyTable(actors)

  return demoralizeTable + diplomacyTable
}

const getAcTable = (actors: ActorPF[]): string => {
  const header = `
    <tr>
      <td colSpan="3">Classe d'Armure</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Situation</td>
    <td style='${cellStyle}'>CA</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const rowsData = [
      { label: 'Base', value: rollData.attributes.ac.normal.total },
      {
        label: 'Attaque de Contact',
        value: rollData.attributes.ac.touch.total,
      },
      {
        label: 'Pris au dépourvu',
        value: rollData.attributes.ac.flatFooted.total,
      },
    ]

    const actorRow = `<td rowspan='5'>${actor.name}</td>`

    const acRows = getTableSubRows(rowsData)

    return `
      <tr>${actorRow}</tr>
      <tr>${acRows}</tr>
    `
  })

  return getTable(header, rows)
}

const getCmdTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="3">Degré de Manœuvre Défensive</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Situation</td>
    <td style='${cellStyle}'>CMD</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const rowsData = [
      { label: 'Base', value: rollData.attributes.cmd.total },
      {
        label: 'Pris au dépourvu',
        value: rollData.attributes.cmd.flatFootedTotal,
      },
    ]

    const actorRow = `<td rowspan='5'>${actor.name}</td>`

    const dmdRows = getTableSubRows(rowsData)

    return `
      <tr>${actorRow}</tr>
      <tr>${dmdRows}</tr>
    `
  })

  return getTable(header, rows)
}

const getFeintTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="2">Feinter en combat (Bluff)</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>DD</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const babDc =
      10 + rollData.attributes.bab.total + rollData.abilities.wis.mod
    const senseMotiveDc = 10 + rollData.skills.sen.mod
    const senseMotiveTrained = rollData.skills.sen.rank > 0

    const dc =
      senseMotiveDc > babDc && senseMotiveTrained ? senseMotiveDc : babDc

    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${dc}</td>
      </tr>`
  })

  return getTable(header, rows)
}

const getSrTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="2">Resistance à la Magie</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>RM</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const sr = rollData.attributes.sr.total
    const hasSr = sr > 0

    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${hasSr ? sr : 'Aucune'}</td>
      </tr>
    `
  })

  return getTable(header, rows)
}

const getEnergyResistanceTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="2">Resistance aux énérgies</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Resistances</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const resistances = rollData.traits.eres

    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${resistances}</td>
      </tr>`
  })

  return getTable(header, rows)
}

const getResistanceTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="2">Resistances</td>
    <tr>
    <td style='${cellStyle}'>Acteur</td>
    <td style='${cellStyle}'>Resistances</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const resistances = rollData.traits.cres

    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${resistances}</td>
      </tr>`
  })

  return getTable(header, rows)
}

const getDamageImmunitiesTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="2">Immunités aux dommages</td>
    <tr>
    <td style='min-width: 100px'>Acteur</td>
    <td style='${cellStyle}'>Resistances</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const damageImmunity = rollData.traits.di.value.map(translatePf1)
    const damageImmunityCustom = rollData.traits.di.custom
    if (damageImmunityCustom) {
      damageImmunity.push(damageImmunityCustom)
    }

    const hasDamageImmunity = damageImmunity.length > 0

    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${
          hasDamageImmunity ? damageImmunity.join(', ') : 'Aucun'
        }</td>
      </tr>`
  })

  return getTable(header, rows)
}

const getImmunitiesTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="2">Immunités</td>
    <tr>
    <td style='min-width: 100px'>Acteur</td>
    <td style='${cellStyle}'>Resistances</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const immunity = rollData.traits.ci.value.map(translatePf1)
    const immunityCustom = rollData.traits.ci.custom
    if (immunityCustom) {
      immunity.push(immunityCustom)
    }

    const hasImmunity = immunity.length > 0

    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${
          hasImmunity ? immunity.join(', ') : 'Aucun'
        }</td>
      </tr>`
  })

  return getTable(header, rows)
}

const getDamageVulnerabilitiesTable = (actors: ActorPF[]) => {
  const header = `
    <tr>
      <td colSpan="2">Vulnérabilités aux dommages</td>
    <tr>
    <td style='min-width: 100px'>Acteur</td>
    <td style='${cellStyle}'>Vulnérabilités</td>
  `

  const rows = actors.map((actor) => {
    const rollData = actor.getRollData({ forceRefresh: false })
    const damageVulnerabilities = rollData.traits.dv.value.map(translatePf1)
    const damageVulnerabilitiesCustom = rollData.traits.dv.custom
    if (damageVulnerabilitiesCustom) {
      damageVulnerabilities.push(damageVulnerabilitiesCustom)
    }

    const hasDamageVulnerabilities = damageVulnerabilities.length > 0

    return `
      <tr>
        <td style='${cellStyle}'>${actor.name}</td>
        <td style='${cellStyle}'>${
          hasDamageVulnerabilities ? damageVulnerabilities.join(', ') : 'Aucune'
        }</td>
      </tr>`
  })

  return getTable(header, rows)
}

export const getCombatDefensesTable = (actors: ActorPF[]) => {
  const acTable = getAcTable(actors)
  const dmdTable = getCmdTable(actors)
  const feintTable = getFeintTable(actors)
  const srTable = getSrTable(actors)
  const energyResistanceTable = getEnergyResistanceTable(actors)
  const resistanceTable = getResistanceTable(actors)
  const damageImmunities = getDamageImmunitiesTable(actors)
  const immunities = getImmunitiesTable(actors)
  const damageVulnerabilities = getDamageVulnerabilitiesTable(actors)

  return (
    acTable +
    dmdTable +
    feintTable +
    srTable +
    energyResistanceTable +
    resistanceTable +
    damageImmunities +
    immunities +
    damageVulnerabilities
  )
}

import {
  ActorPFDamageReduction,
  ActorPFEnergyResistance,
  ActorPFSenses,
  ActorPFSize,
  ActorPFSpeed,
  ActorPFStature,
} from '../../type/foundry/system/pf1/documents/actor/actor-pf'
import { ItemPFType } from '../../type/foundry/system/pf1/documents/item/item-pf'
import { RecursivePartial } from '../../type/foundry/utils/partial'
import { MetamorphFilter } from './filter'
import { MetamorphOwnershipChanges } from './ownership'

export type MetamorphElementsRecord = Record<string, MetamorphElement>

export type MetamorphTransformationCompendiumItem =
  | MetamorphTransformationCompendiumBuff
  | MetamorphTransformationCompendiumAttack
  | MetamorphTransformationCompendiumFeat

type MetamorphTransformationCompendiumBuff = {
  name: string
  compendiumName: string
  type: 'buff'
  disable?: boolean
}

type MetamorphTransformationCompendiumAttack = {
  name: string
  compendiumName: string
  type: 'attack'
}

type MetamorphTransformationCompendiumFeat = {
  name: string
  compendiumName: string
  type: 'feat'
  disable?: boolean
}

export type MetamorphItemTransformationAction = 'disable'

export interface MetamorphTransformationActorItem {
  name: string
  type: ItemPFType
  action: MetamorphItemTransformationAction
}

interface BaseMetamorphElement {
  label: string
  description?: string
}

export type MetamorphElement =
  | MetamorphElementGroup
  | MetamorphElementTransformation

export interface MetamorphElementGroup extends BaseMetamorphElement {
  type: 'group'
  elementChildren: MetamorphElementsRecord
}

export interface MetamorphElementTransformation extends BaseMetamorphElement {
  type: 'transformation'
  name?: string
  requirement?: MetamorphFilter
  items?: {
    toAdd?: MetamorphTransformationCompendiumItem[]
    toModify?: MetamorphTransformationActorItem[]
  }
  token?: {
    textureSrc?: string
    name?: string
    scale?: number
  }
  size?: ActorPFSize
  stature?: ActorPFStature
  speed?: RecursivePartial<ActorPFSpeed>
  actorImg?: string
  senses?: Partial<ActorPFSenses>
  damageReduction?: ActorPFDamageReduction
  energyResistance?: ActorPFEnergyResistance
  ownershipChanges?: MetamorphOwnershipChanges
  biography?: string
}

export interface MetamorphConfig {
  style: {
    descriptionIcon: string
    description: string
  }
  rootElements: MetamorphElementsRecord
}

export const config: MetamorphConfig = {
  style: {
    descriptionIcon: 'padding-right: 5px;',
    description: '',
  },
  rootElements: {
    beastShapeIV: {
      label: 'Forme Bestiale IV',
      type: 'group',
      elementChildren: {
        magicalBeastLarge: {
          label: 'Créature magique de taille G',
          type: 'group',
          elementChildren: {
            chimera: {
              label: 'Chimère',
              description:
                'Ce monstre ailé a le corps d’un lion et trois têtes : dragon, lion et chèvre. Pour connaitre la couleur de la tête de dragon, lancez [[/r 1d10 #Couleur de la tête de chimère]]. Si 1 ou 2 alors tête blanche, si 3 ou 4 alors tête bleue, si 5 ou 6 alors tête noire, si 7 ou 8 alors tête rouge, sinon si 9 ou 10 alors tête verte.',
              type: 'transformation',
              items: {
                toAdd: [
                  {
                    name: 'Forme bestiale IV (créature magique G - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'buff',
                  },
                  {
                    name: 'Morsure (dragon) (chimère - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'attack',
                  },
                  {
                    name: 'Morsure (lion) (chimère - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'attack',
                  },
                  {
                    name: 'Corne (chèvre) (chimère - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'attack',
                  },
                  {
                    name: 'Corne (chèvre) (chimère - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'attack',
                  },
                  {
                    name: 'Souffle de Chimère (chimère - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'feat',
                  },
                ],
              },
              size: 'lg',
              stature: 'long',
              token: {
                textureSrc: '/tokens/monsters/magicalBeasts/chimera.webp',
              },
              actorImg: '/characters/monsters/magicalBeasts/chimera.webp',
              speed: {
                burrow: {
                  base: 0,
                },
                climb: {
                  base: 0,
                },
                fly: {
                  base: 50,
                  maneuverability: 'poor',
                },
                land: {
                  base: 30,
                },
                swim: {
                  base: 0,
                },
              },
              senses: {
                dv: 60,
                ll: {
                  enabled: true,
                  multiplier: {
                    bright: 2,
                    dim: 2,
                  },
                },
                sc: 30,
              },
            },
            gorgon: {
              label: 'Gorgone',
              description: 'Taureau de pierre qui peut pétrifier ses victimes',
              type: 'transformation',
              items: {
                toAdd: [
                  {
                    name: 'Forme bestiale IV (créature magique G - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'buff',
                  },
                  {
                    name: 'Corne (gorgone - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'attack',
                  },
                  {
                    name: '2 sabots (gorgone - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'attack',
                  },
                  {
                    name: 'Piétinement',
                    compendiumName: 'world.aptitudes-de-classe-personnalisees',
                    type: 'feat',
                  },
                  {
                    name: 'Souffle de Gorgone (gorgone - metamorph)',
                    compendiumName: 'world.effets-metamorph',
                    type: 'feat',
                  },
                ],
              },
              size: 'lg',
              stature: 'long',
              token: {
                textureSrc:
                  '/tokens/monsters/magicalBeasts/Gorgon_Bull2_Steel.webp',
              },
              actorImg: '/characters/monsters/magicalBeasts/gorgone.webp',
              speed: {
                burrow: {
                  base: 0,
                },
                climb: {
                  base: 0,
                },
                fly: {
                  base: 0,
                },
                land: {
                  base: 30,
                },
                swim: {
                  base: 0,
                },
              },
              senses: {
                dv: 60,
                ll: {
                  enabled: true,
                  multiplier: {
                    bright: 2,
                    dim: 2,
                  },
                },
                sc: 30,
              },
            },
          },
        },
      },
    },
    transference: {
      label: 'La Transférence du Premier Monde',
      type: 'group',
      elementChildren: {
        incomplete: {
          label: 'Incomplete',
          type: 'group',
          elementChildren: {
            origin: {
              label: 'Origine',
              type: 'transformation',
              token: {
                textureSrc:
                  '/tokens/monsters/aberrations/not-so-severed-tentacle3.webp',
              },
              actorImg:
                '/characters/monsters/aberrations/purpletentacules.webp',
            },
            destination: {
              label: 'Destination',
              type: 'transformation',
              token: {
                textureSrc:
                  '/tokens/monsters/aberrations/severed-tentacle.webp',
              },
              actorImg: '/characters/monsters/aberrations/bluetentacules.webp',
            },
          },
        },
      },
    },
    gimil: {
      label: 'Gimil',
      type: 'group',
      elementChildren: {
        humanForm: {
          label: 'Forme humaine de Gimil',
          type: 'transformation',
          token: {
            textureSrc: '/tokens/NPC/gimilHumanForm.webp',
            scale: 1,
          },
          actorImg: '/characters/NPC/gimilYoungHumanForm.webp',
          items: {
            toAdd: [
              {
                name: 'Coup (humain - metamorph)',
                compendiumName: 'world.effets-metamorph',
                type: 'attack',
              },
            ],
          },
          requirement: {
            type: 'equality',
            path: 'id',
            // Gimil ID
            value: 's4Ea9b7sZAZeCn6z',
          },
          size: 'med',
          biography:
            "<p>Rares sont ceux qui savent vraiment d'où vient Gimil. Son comportement suggère qu'il n'a pas reçu une éducation traditionnelle ; le jeune homme arbore une allure sauvage, avec des vêtements usés et des yeux perçants qui semblent toujours en alerte.</p>",
        },
      },
    },
    magnus: {
      label: 'Magnus',
      type: 'group',
      elementChildren: {
        fox: {
          label: 'Forme animale de Magnus',
          type: 'transformation',
          token: {
            textureSrc: '/tokens/monsters/animals/fox1.webp',
          },
          actorImg: '/characters/monsters/animals/fox1.webp',
          requirement: {
            type: 'equality',
            path: 'id',
            // Dov Magnus ID
            value: 'DiXoCwjCCADoVMk3',
          },
        },
        human: {
          label: 'Forme humaine de Magnus',
          type: 'transformation',
          token: {
            textureSrc: '/tokens/PC/magnus.webp',
          },
          actorImg: '/characters/PC/magnusHuman.webp',
          requirement: {
            type: 'equality',
            path: 'id',
            // Dov Magnus ID
            value: 'DiXoCwjCCADoVMk3',
          },
        },
      },
    },
    template: {
      label: 'Archétypes',
      type: 'group',
      elementChildren: {
        celestial: {
          label: 'Céleste',
          type: 'transformation',
          items: {
            toAdd: [
              {
                name: 'Céleste',
                compendiumName: 'world.archetypes-personnalises',
                type: 'feat',
              },
              {
                name: 'Châtiment du mal',
                compendiumName: 'world.aptitudes-de-classe-personnalisees',
                type: 'feat',
              },
              {
                name: 'Châtiment du mal',
                compendiumName: 'world.effets-de-classes',
                type: 'buff',
                disable: true,
              },
            ],
          },
        },
        fiendish: {
          label: 'Céleste',
          type: 'transformation',
          items: {
            toAdd: [
              {
                name: 'Fiélon',
                compendiumName: 'world.archetypes-personnalises',
                type: 'feat',
              },
              {
                name: 'Châtiment du bien',
                compendiumName: 'world.aptitudes-de-classe-personnalisees',
                type: 'feat',
              },
              {
                name: 'Châtiment du bien',
                compendiumName: 'world.effets-de-classes',
                type: 'buff',
                disable: true,
              },
            ],
          },
        },
      },
    },
    mythicLycanthropy: {
      label: 'Lycanthropie Mythique',
      type: 'group',
      elementChildren: {
        canine: {
          label: 'Canine',
          type: 'transformation',
          requirement: {
            type: 'hasItem',
            item: {
              name: 'Lycanthrope mythique - Canine',
              type: 'feat',
            },
          },
          items: {
            toAdd: [
              {
                name: 'Lycanthrope mythique - Canine - Forme Hybride (metamorph)',
                compendiumName: 'world.effets-metamorph',
                type: 'feat',
              },
              {
                name: 'Morsure (lycanthropie mythique - canine - metamorph)',
                compendiumName: 'world.effets-metamorph',
                type: 'attack',
              },
              {
                name: '2 Griffes (lycanthropie mythique - canine - metamorph)',
                compendiumName: 'world.effets-metamorph',
                type: 'attack',
              },
            ],
            toModify: [
              {
                name: 'Lycanthrope mythique - Canine - Forme Humanoïde',
                type: 'feat',
                action: 'disable',
              },
            ],
          },
          size: 'lg',
          stature: 'tall',
          token: {
            textureSrc: '/tokens/monsters/monstrousHumanoids/Werewolf.webp',
          },
          actorImg: '/characters/PC/Seioden%20Loup%20Garou.jpg',
          speed: {
            burrow: {
              base: 0,
            },
            climb: {
              base: 0,
            },
            fly: {
              base: 0,
            },
            land: {
              base: 45,
            },
            swim: {
              base: 0,
            },
          },
          senses: {
            dv: 60,
            ll: {
              enabled: true,
              multiplier: {
                bright: 2,
                dim: 2,
              },
            },
            sc: 30,
          },
          ownershipChanges: 'clampAccessToLimited',
        },
      },
    },
    hag: {
      label: 'Guenaude',
      type: 'group',
      elementChildren: {
        loganNice: {
          label: 'Forme amicale de Logan',
          name: 'Veille Dame Logan',
          type: 'transformation',
          size: 'med',
          token: {
            textureSrc: '/tokens/NPC/117805-npc_f_elderlypoor.webp',
            name: 'Veille Dame Logan',
          },
          actorImg: '/characters/NPC/loganhagnice.webp',
        },
        meganNice: {
          label: 'Forme amicale de Megan',
          name: "Megan l'heureuse",
          type: 'transformation',
          size: 'med',
          token: {
            textureSrc: '/tokens/NPC/117823-npc_f_poor_carrier_redhead.webp',
            name: "Megan l'heureuse",
          },
          actorImg: '/characters/NPC/nicemegan.webp',
        },
        siou: {
          label: 'Forme de Siou',
          name: 'Siou',
          type: 'transformation',
          size: 'med',
          token: {
            textureSrc: '/tokens/NPC/kid-m.webp',
            name: 'Siou',
          },
          actorImg: '/characters/NPC/elfkid2.webp',
        },
        blugna: {
          label: 'Forme de Blugna',
          name: 'Blugna',
          type: 'transformation',
          size: 'med',
          token: {
            textureSrc: '/tokens/NPC/lyra.webp',
            name: 'Siou',
          },
          actorImg: '/characters/NPC/lyra.webp',
        },
        higanNice: {
          label: "Forme amicale d'Higan",
          name: 'Higan la botaniste',
          type: 'transformation',
          size: 'med',
          token: {
            textureSrc: '/tokens/NPC/generics/nobles1/117991-npc_f_noble.webp',
            name: 'Higan la botaniste',
          },
          actorImg:
            '/characters/NPC/elven-women-a896-4b18-979f-8995a89baa1d.webp',
        },
      },
    },
    reducePerson: {
      label: 'Rapetissement',
      description: 'Effectif uniquement sur les humanoids',
      type: 'transformation',
      requirement: {
        type: 'equality',
        path: 'system.traits.humanoid',
        value: true,
      },
      items: {
        toAdd: [
          {
            name: 'Rapetissement (metamorph)',
            compendiumName: 'world.effets-metamorph',
            type: 'buff',
          },
        ],
      },
      size: 'sm',
    },
    frightfulAspect: {
      label: 'Aspect terrifiant',
      type: 'transformation',
      items: {
        toAdd: [
          {
            name: 'Aspect terrifiant (metamorph)',
            compendiumName: 'world.effets-metamorph',
            type: 'buff',
          },
        ],
      },
      size: 'lg',
    },
  },
}

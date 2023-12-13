# foundry-vtt-macro-ts

A project to build random macros for [Foundry VTT](https://foundryvtt.com/) in TypeScript to make my life easier when I play as a Game Master, feel free to use them.

Currently, only French is supported. Typing is also very incomplete.

# A hopefully updated list of scripts

## Mass flip

Flip all owned instance of a specific actor token texture, can also play sounds.

Token file names can include wildcard characters, which work the same way as Foundry VTT Randomize Wildcard Images.

> [!IMPORTANT]  
> You must modify the `knownActorGroups` variable defined in `macro/mass-flip/config.ts` before using this macro, as it's currently using my own ressources.

## PF1e actor info

Get information on all selected tokens in a Pathfinder 1e game.

# How to use

To use these macros in Foundry VTT, follow these steps:

1. Navigate to the `dist` folder within the project root files.
2. Navigate into the sub-folders named after the macro you want to use.
3. You can directly copy the `index.js` file content to a FoundryVTT macro.

# Thanks

Type definition is based on League of Foundry Developers [foundry-vtt-types](https://github.com/League-of-Foundry-Developers/foundry-vtt-types).

Some macros are based on websterguy's work [foundry-pf1e-macros](https://github.com/websterguy/foundry-pf1e-macros).

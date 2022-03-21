import { merge } from "theme-ui"
import { BaseTheme } from "gatsby-theme-catalyst-core"
import { tailwind, baseColors } from "@theme-ui/preset-tailwind"

const pyohioColors = {
  primary: "#3A3A3A",
  highlight: "#D2D2D2",
  secondary: "#8D8D8D",
  darkSecondary: "#6D6D6D",
  mutedPrimary: "#3C3C3C",
  darkPrimary: "#161616",
}

const theme = merge(BaseTheme, {
  // Modifications to the base theme go here. This is an example changing colors and using variants to change your navigation links. Uncomment the code below to see what happens.
  config: {
    useColorSchemeMediaQuery: false,
    initialColorModeName: "light",
    printColorModeName: "light,",
  },
  buttons: {
    primary: {
      color: "primary",
      bg: "highlight",
    },
  },
  colors: {
    ...tailwind.colors,
    background: baseColors.gray[1], //Try "#954264",
    text: baseColors.gray[8],
    textGray: "#6e6e6e",
    primary: pyohioColors.darkSecondary,
    secondary: baseColors.orange[7],
    accent: baseColors.orange[2],
    highlight: pyohioColors.primary,
    muted: baseColors.gray[2],
    header: {
      background: baseColors.gray[2],
      backgroundOpen: baseColors.blue[2],
      text: pyohioColors.primary,
      textOpen: baseColors.gray[8],
      icons: pyohioColors.mutedPrimary,
      iconsOpen: pyohioColors.primary,
    },
    footer: {
      background: baseColors.gray[2],
      text: baseColors.gray[8],
      links: baseColors.gray[8],
      icons: pyohioColors.primary,
    },
    // You can delete dark mode by removing the "modes" object and setting useColorMode to false in gatsby-theme-catalyst-core
    modes: {
      dark: {
        background: pyohioColors.darkPrimary,
        text: baseColors.gray[1],
        textGray: "#9f9f9f",
        primary: pyohioColors.highlight,
        secondary: baseColors.orange[7],
        accent: baseColors.gray[8],
        highlight: pyohioColors.secondary,
        muted: pyohioColors.mutedPrimary,
        header: {
          text: baseColors.gray[1],
          textOpen: baseColors.gray[1],
          background: pyohioColors.primary,
          backgroundOpen: baseColors.gray[8],
          icons: pyohioColors.secondary,
          iconsOpen: baseColors.gray[1],
        },
        footer: {
          background: pyohioColors.primary,
          text: baseColors.gray[1],
          links: pyohioColors.highlight,
          icons: pyohioColors.secondary,
        },
      },
    },
  },
})

export default theme

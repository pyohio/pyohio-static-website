import { merge } from "theme-ui"
import { BaseTheme } from "gatsby-theme-catalyst-core"
import { tailwind, baseColors } from "@theme-ui/preset-tailwind"

const pyohioColors = {
  purple: "#502962",
  yellow: "#fcdc30",
  cyan: "#15bcdd",
  darkCyan: "#1091aa",
  mutedPurple: "#46354e",
  darkPurple: "#1f1025",
}

const theme = merge(BaseTheme, {
  // Modifications to the base theme go here. This is an example changing colors and using variants to change your navigation links. Uncomment the code below to see what happens.
  config: {
    useColorSchemeMediaQuery: false,
    initialColorModeName: "dark",
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
    primary: pyohioColors.darkCyan,
    secondary: baseColors.orange[7],
    accent: baseColors.orange[2],
    highlight: pyohioColors.purple,
    muted: baseColors.gray[2],
    header: {
      background: baseColors.gray[2],
      backgroundOpen: baseColors.blue[2],
      text: pyohioColors.purple,
      textOpen: baseColors.gray[8],
      icons: pyohioColors.mutedPurple,
      iconsOpen: pyohioColors.purple,
    },
    footer: {
      background: baseColors.gray[2],
      text: baseColors.gray[8],
      links: baseColors.gray[8],
      icons: pyohioColors.purple,
    },
    // You can delete dark mode by removing the "modes" object and setting useColorMode to false in gatsby-theme-catalyst-core
    modes: {
      dark: {
        background: pyohioColors.darkPurple,
        text: baseColors.gray[1],
        textGray: "#9f9f9f",
        primary: pyohioColors.yellow,
        secondary: baseColors.orange[7],
        accent: baseColors.gray[8],
        highlight: pyohioColors.cyan,
        muted: pyohioColors.mutedPurple,
        header: {
          text: baseColors.gray[1],
          textOpen: baseColors.gray[1],
          background: pyohioColors.purple,
          backgroundOpen: baseColors.gray[8],
          icons: pyohioColors.cyan,
          iconsOpen: baseColors.gray[1],
        },
        footer: {
          background: pyohioColors.purple,
          text: baseColors.gray[1],
          links: pyohioColors.yellow,
          icons: pyohioColors.cyan,
        },
      },
    },
  },
})

export default theme

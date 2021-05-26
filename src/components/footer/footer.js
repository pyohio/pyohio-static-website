/** @jsx jsx */
import { jsx, useThemeUI, Themed } from "theme-ui"
import { useSiteMetadata, SocialFooter } from "gatsby-theme-catalyst-core"
import { IconContext } from "react-icons"
import { useFooterConfig } from "gatsby-theme-catalyst-footer/src/utils/use-footer-config"
import { StaticImage } from "gatsby-plugin-image"
import { Helmet } from "react-helmet"

const SiteFooter = () => {
  const { title } = useSiteMetadata()
  const { footerContentLocation, useFooterSocialLinks } = useFooterConfig()
  const { theme } = useThemeUI()
  const isLeft = footerContentLocation === "left"
  const isRight = footerContentLocation === "right"
  const isCenter = footerContentLocation === "center"

  return (
    <footer
      sx={{
        color: "footer.text",
        backgroundColor: "footer.background",
        textAlign:
          (isLeft && "left") || (isRight && "right") || (isCenter && "center"),
        px: 3,
        py: 3,
        gridArea: "footer",
        a: {
          color: "footer.links",
        },
        variant: "variants.footer",
      }}
    >
      <Helmet>
        <meta
          property="og:image"
          content="https://www.pyohio.org/pyohio-2021-logo-og.jpg"
        />
        <meta
          name="twitter:image"
          content="https://www.pyohio.org/pyohio-2021-logo-og.jpg"
        />
      </Helmet>
      <div
        sx={{
          display: "grid",
          alignContent: "center",
          justifyContent:
            (isLeft && "start") || (isRight && "end") || (isCenter && "center"),
          width: "100%",
          maxWidth: "maxPageWidth",
          mx: "auto",
          my: 0,
        }}
      >
        <div
          sx={{
            a: {
              color: "footer.icons",
              mr: 3,
            },
            "a:last-of-type": {
              mr: 0,
            },
            "a:hover": {
              color: "primary",
            },
          }}
        >
          <IconContext.Provider value={{ size: theme.sizes.iconsFooter }}>
            {useFooterSocialLinks && <SocialFooter />}
          </IconContext.Provider>
        </div>
        <div>
          <StaticImage
            src="../../../content/assets/pyohio-2021-lightning-snake-transparent.png"
            sx={{
              // Styling for the logo using the breakpoint syntax from Theme-UI. Imagine something like [xs, sm, md, l, xl] for the breakpoint sizes. Play around with the logo sizes and your screen size to see the effects
              height: ["30px", "30px", null, "30px", null],
              width: ["100px", "100px", null, "150px", null],
              // variant: "variants.siteLogo",
            }}
            alt="PyOhio Snake"
            imgStyle={{ objectFit: "contain" }}
            placeholder="blurred"
          />
        </div>
        <Themed.p sx={{ m: 0 }}>
          © {new Date().getFullYear()} {title}
        </Themed.p>
        <Themed.p sx={{ mb: 0 }}>
          <a href="https://www.netlify.com">
            <img
              src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"
              alt="Deploys by Netlify"
            />
          </a>
        </Themed.p>
      </div>
    </footer>
  )
}

export default SiteFooter

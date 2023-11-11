import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-kGreenColor text-white cursor-pointer hover:bg-kGreenColor/96 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50 select-none truncate'],
    ['btn-outlined', 'px-4 py-1 rounded inline-block border-2 border-kGreenColor text-kGreenColor cursor-pointer hover:bg-kGreenColor/96 hover:text-white font-semibold disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50 select-none truncate'],
    ['icon-btn', 'inline-block cursor-pointer opacity-75 transition duration-200 ease-in-out select-none truncate'],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    colors: {
      kOrangeColor: '#FC8019',
      kGreenColor: '#09AA29',
      kGoldenColor: '#FFF2E8',
      kDarkColor: '#171826',
      kGrayColor: '#9F9F9E',
      kWhiteColor: '#F5F5F5',
    },
  },
})

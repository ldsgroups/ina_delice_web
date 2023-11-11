import { launch } from 'puppeteer'

export default defineEventHandler(async (event) => {
  const { orderName } = await readBody(event)
  const browser = await launch({ headless: 'new' })

  const page = await browser.newPage()
  await page.goto(`http://localhost:3000/receipt/${orderName}`, { waitUntil: 'networkidle0' })
  await page.emulateMediaType('screen')

  // waiting for select 'table' balise
  await page.waitForSelector('table', { visible: true, timeout: 10000 })

  const pdf = await page.pdf({
    path: 'result.pdf',
    margin: { top: '20px', right: '10px', bottom: '20px', left: '10px' },
    printBackground: true,
    // format: 'A6',
    width: '2in',
    height: '2.9in',

  })

  await page.evaluate(() => {
    window.print()
  })

  await browser.close()

  return pdf
})

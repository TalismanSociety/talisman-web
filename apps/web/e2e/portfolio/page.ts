import type { Locator, Page } from '@playwright/test'

export default class PortfolioPage {
  readonly inputAnyAddress: Locator
  readonly btnAdd: Locator
  readonly btnAddWatch: Locator
  readonly inputWalletAddress: Locator
  
  constructor(private readonly page: Page) {
    this.inputAnyAddress = page.getByPlaceholder('Enter any address')
    this.btnAdd = page.getByRole('button', { name: 'Add' })
    this.btnAddWatch = page.getByRole('article').filter({ hasText: 'Add watch only address' })
    this.inputWalletAddress = page.getByPlaceholder('Enter wallet address')
  }
  
  spanAddress = (wallet: string) => this.page.locator('#root').getByText(this.formatWallet(wallet))
  divAddress = (wallet: string) => this.page.getByRole('article').filter({ hasText: this.formatWallet(wallet) })
  
  async goto() {
    await this.page.goto('/portfolio')
  }

  async addWatchedAccountFromMain(wallet: string) {
    await this.inputAnyAddress.fill(wallet)
    await this.btnAdd.click()
  }

  async addWatchedAccountFromMenu(wallet: string) {
    await this.btnAddWatch.click()
    await this.inputWalletAddress.fill(wallet)
    await this.btnAdd.click()
  }

  formatWallet = (wallet: string) => wallet.replace(wallet.substring(4, wallet.length - 4), '...')
}
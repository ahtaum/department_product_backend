import { DateTime } from 'luxon'
import { BaseModel, HasMany, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Sales from './Sales'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public phone: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Sales)
  public sales: HasMany<typeof Sales>

  @beforeSave()
  public static async generateCode(customer: Customer) {
    if (!customer.code) {
      const itemId = generateItemId()
      const uniqueCode = generateUniqueCode(itemId)
      customer.code = uniqueCode
    }
  }
}

function generateItemId(): string {
  const timestamp = Date.now().toString()
  return timestamp
}

function generateUniqueCode(customerID: string): string {
  const random = Math.random().toString(36).substr(2, 6)
  return customerID + random
}
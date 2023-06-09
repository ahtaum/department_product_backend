import { DateTime } from 'luxon'
import { BaseModel, HasOne, beforeSave, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import SalesDet from './SalesDet'

export default class Item extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column()
  public name: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => SalesDet)
  public salesDets: HasOne<typeof SalesDet>

  // Generate unique random for code field
  @beforeSave()
  public static async generateCode(item: Item) {
    if (!item.code) {
      const itemId = generateItemId()
      const uniqueCode = generateUniqueCode(itemId)
      item.code = uniqueCode
    }
  }
}

function generateItemId(): string {
  const timestamp = Date.now().toString()
  return timestamp
}

function generateUniqueCode(itemId: string): string {
  const random = Math.random().toString(36).substr(2, 6)
  return itemId + random
}
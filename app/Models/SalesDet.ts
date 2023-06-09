import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Item from './Item'

export default class SalesDet extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public salesId: number

  @column()
  public itemId: number

  @column()
  public listPrice: number

  @column()
  public quantity: number

  @column()
  public discountPercentage: number

  @column()
  public discountAmount: number

  @column()
  public discountedPrice: number

  @column()
  public total: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Item)
  public items: BelongsTo<typeof Item>
}

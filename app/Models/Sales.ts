import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Customer from './Customer'
import SalesDet from './SalesDet'

export default class Sales extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public code: string

  @column()
  public date: DateTime

  @column()
  public customerId: number

  @column()
  public subtotal: number

  @column()
  public discount: number

  @column()
  public shippingCost: number

  @column()
  public totalCost: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Customer)
  public customers: BelongsTo<typeof Customer>

  @hasMany(() => SalesDet)
  public salesDets: HasMany<typeof SalesDet>
}

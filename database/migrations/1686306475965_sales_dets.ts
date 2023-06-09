import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'sales_dets'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('sales_id').unsigned().references('sales.id').onDelete('CASCADE')
      table.integer('item_id').unsigned().references('items.id').onDelete('CASCADE')
      table.decimal('list_price')
      table.integer('quantity')
      table.decimal('discount_percentage')
      table.decimal('discount_amount')
      table.decimal('discounted_price')
      table.decimal('total')
      table.timestamps()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
